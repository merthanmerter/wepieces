import { and, eq, lt, or } from "drizzle-orm";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "../../env";
import {
  sessions,
  tenants,
  users,
  usersTenants,
  type SelectSession,
  type SelectTenant,
} from "../database/schema";

/**
 * Constants for session management
 * and cookie options.
 */
const SESSION_PREFIX = "_session";
const SIGNING_KEY: Uint8Array = new TextEncoder().encode(env.SECRET);

export const AUTH_COOKIE_OPTS: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  path: "/",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  secure: import.meta.env.NODE_ENV === "production",
  domain: import.meta.env.NODE_ENV === "development" ? undefined : env.DOMAIN,
};

export const encrypt = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 week")
    .sign(SIGNING_KEY);
};

export const decrypt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SIGNING_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password);
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await Bun.password.verify(password, hash);
};

/**
 * We make sure that the session data
 * type is correct. And we return only
 * secure credentials.
 */
export const secureCredentials = (
  session: JWTPayload | null,
): Credentials | null => {
  if (hasValidSessionData(session)) {
    return {
      id: session.id,
      username: session.username,
      exp: session.exp,
      role: session.role,
      activeTenant: session.activeTenant,
      tenants: session.tenants,
    };
  }
  return null;
};

export const createAuthSession = async (
  c: Context,
  payload: Credentials,
): Promise<JWTPayload | null> => {
  const db = c.get("db");

  // 1. Revoke the previous session
  await revokeAuthSession(c);

  // 2. Encrypt the payload
  const token = await encrypt(payload);

  // 3. Set the session in the database
  const values = {
    id: token,
    userId: payload.id,
    expires: new Date(payload.exp * 1000),
  };
  await db
    .insert(sessions)
    .values(values)
    .onConflictDoUpdate({
      target: [sessions.id],
      set: values,
    })
    .execute();

  // 4. Set the cookie
  setCookie(c, SESSION_PREFIX, token, {
    ...AUTH_COOKIE_OPTS,
  });

  // 5. Decrypt the payload and return it
  return await decrypt(token);
};

export const validateAuthSession = async (
  c: Context,
): Promise<Credentials | null> => {
  const db = c.get("db");
  const token = getCookie(c, SESSION_PREFIX);

  if (!token) {
    await revokeAuthSession(c);
    return null;
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, token))
    .execute();

  if (!session || Date.now() >= session.expires.getTime()) {
    await revokeAuthSession(c);
    return null;
  }

  const payload = await decrypt(token);
  return secureCredentials(payload);
};

/**
 * Revokes the current session.
 * If `userId` is provided, it will
 * revoke all sessions for the user.
 * @param userId
 */
export const revokeAuthSession = async (
  c: Context,
  userId: string | null = null,
): Promise<void> => {
  const db = c.get("db");

  const token = getCookie(c, SESSION_PREFIX);
  if (!token) return;

  if (userId) {
    await db.delete(sessions).where(eq(sessions.userId, userId)).execute();
  } else {
    await db.delete(sessions).where(eq(sessions.id, token)).execute();
  }

  /**
   * Invalidate _all_ expired sessions
   * when a session is revoked on demand.
   */
  await invalidateExpiredSessions(c);

  setCookie(c, SESSION_PREFIX, "", {
    ...AUTH_COOKIE_OPTS,
    expires: new Date(0),
  });
};

/**
 * This can bu used on demand
 * to invalidate all expired sessions
 * in the database.
 */
export const invalidateExpiredSessions = async (
  c: Context,
): Promise<SelectSession[]> => {
  const db = c.get("db");
  return await db
    .delete(sessions)
    .where(lt(sessions.expires, new Date()))
    .returning()
    .execute();
};

/**
 * Get user from database
 * @param c Hono context
 * @param by The user id, username or email
 */
export const getUserFromDatabase = async (c: Context, by: string) => {
  const db = c.get("db");

  try {
    const user = await db.transaction(async (trx) => {
      // Step 1: Fetch the user along with the active tenant details
      const [user] = await trx
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          password: users.password,
          role: usersTenants.role,
          activeTenant: tenants, // We will check if this tenant is active or passive
          recoveryCode: users.recoveryCode,
        })
        .from(users)
        .where(
          or(eq(users.id, by), eq(users.username, by), eq(users.email, by)),
        )
        .innerJoin(
          usersTenants,
          and(
            eq(users.activeTenantId, usersTenants.tenantId),
            eq(usersTenants.userId, users.id),
          ),
        )
        .innerJoin(tenants, eq(users.activeTenantId, tenants.id))
        .execute();

      // Step 2: Fetch the list of active tenants for this user
      const activeTenants = await trx
        .select({
          id: tenants.id,
          name: tenants.name,
          status: tenants.status,
        })
        .from(tenants)
        .where(
          and(eq(usersTenants.userId, user.id), eq(tenants.status, "active")),
        )
        .innerJoin(usersTenants, eq(tenants.id, usersTenants.tenantId))
        .execute();

      // Step 3: Check if the active tenant is passive (i.e., status is not active)
      const currentActiveTenant = user.activeTenant;
      let selectedTenant = currentActiveTenant;

      if (currentActiveTenant.status !== "active" && activeTenants.length > 0) {
        // If the active tenant is passive and there are active tenants, select the first active tenant
        selectedTenant = activeTenants[0];

        await trx
          .update(users)
          .set({
            activeTenantId: selectedTenant.id,
          })
          .returning()
          .execute();
      }

      // Step 4: Return the user object with the correct active tenant and the list of tenants
      return {
        ...user,
        activeTenant: selectedTenant, // Update the active tenant if necessary
        tenants: activeTenants,
      };
    });

    if (user.activeTenant.status === "passive") return null;

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Types
 */
type Roles = "user" | "admin" | "superadmin";
export interface Credentials extends JWTPayload {
  id: string;
  username: string;
  role: Roles;
  exp: number;
  activeTenant: SelectTenant;
  tenants: SelectTenant[];
}

const hasValidSessionData = (
  session: JWTPayload | null,
): session is Credentials => {
  return (
    session !== null &&
    typeof session.id === "string" &&
    typeof session.username === "string" &&
    typeof session.exp === "number" &&
    typeof session.role === "string" &&
    Array.isArray(session.tenants) &&
    session.activeTenant !== undefined
  );
};
