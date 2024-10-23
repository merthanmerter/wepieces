import { and, eq, or } from "drizzle-orm";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "../../env";
import {
  tenants,
  users,
  usersTenants,
  type SelectTenant,
} from "../database/schema";

export const SESSION_PREFIX = "_session";
export const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;
export const SESSION_KEY = (key: string) => `${SESSION_PREFIX}:${key}`;
const SIGNING_KEY: Uint8Array = new TextEncoder().encode(Bun.env.SECRET!);

export const AUTH_COOKIE_OPTS: CookieOptions = {
  httpOnly: true,
  sameSite: "Strict",
  path: "/",
  expires: new Date(Date.now() + SESSION_EXPIRY),
  secure: true,
  domain: env.NODE_ENV === "development" ? undefined : env.DOMAIN,
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

export type Roles = "user" | "admin" | "superadmin";
export type Credentials = {
  id: string;
  username: string;
  role: Roles;
  exp: number;
  activeTenant: SelectTenant;
  tenants: SelectTenant[];
} | null;

export const secureSessionToCredentials = (
  session: JWTPayload | null,
): Credentials => {
  if (
    session &&
    typeof session.id === "string" &&
    typeof session.username === "string" &&
    typeof session.exp === "number"
  ) {
    return {
      id: session.id,
      username: session.username,
      exp: session.exp,
      role: session.role as Roles,
      activeTenant: session.activeTenant as SelectTenant,
      tenants: session.tenants as SelectTenant[],
    };
  }
  return null;
};

export const storeAuthSession = async (c: Context, session: string) => {
  const redis = c.get("redis"); // Get the RedisDB instance from the context
  const sessionKey = SESSION_KEY(session); // Create a unique key for the session

  /**
   * Check if there is an existing session
   * If there is, refresh the session by removing
   * the old one and storing the new one
   */
  const oldSession = getCookie(c, SESSION_PREFIX);
  if (oldSession) {
    const oldSessionKey = SESSION_KEY(oldSession);
    await redis.del(oldSessionKey);
  }

  // Store the new session token in RedisDB
  await redis.set(sessionKey, session);
  await redis.expire(sessionKey, SESSION_EXPIRY); // Set the expiration time for the session

  // Update the cookie with the new session token
  setCookie(c, SESSION_PREFIX, session, {
    ...AUTH_COOKIE_OPTS,
  });
};

export const getAuthSession = async (c: Context) => {
  const redis = c.get("redis"); // Get the redis database from the context

  const token = getCookie(c, SESSION_PREFIX);
  if (!token) return null;

  const sessionKey = SESSION_KEY(token); // Create a unique key for the session
  const session = await redis.get(sessionKey); // Get the session data from redis

  if (!session) {
    await revokeAuthSession(c);
    return null;
  }

  const payload = await decrypt(session);
  return secureSessionToCredentials(payload);
};

export const revokeAuthSession = async (c: Context) => {
  const redis = c.get("redis"); // Get the redis database from the context

  const token = getCookie(c, SESSION_PREFIX);
  if (!token) return;

  const sessionKey = SESSION_KEY(token); // Create a unique key for the session
  await redis.del(sessionKey); // Delete the session from redis
  // await redis.expire(sessionKey, 0); // Set the expiry time for the session

  setCookie(c, SESSION_PREFIX, "", {
    ...AUTH_COOKIE_OPTS,
    expires: new Date(0),
  });
};

export const hashPassword = async (password: string) => {
  const hash = await Bun.password.hash(password);
  return hash;
};

export const verifyPassword = async (password: string, hash: string) => {
  const isValid = await Bun.password.verify(password, hash);
  return isValid;
};

/**
 * Get user from database
 * @param c The context
 * @param by The user id, username or email
 * @returns The user object from the database
 */
export const getUserFromDb = async (c: Context, by: string) => {
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
