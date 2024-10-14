import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export const SESSION_PREFIX = "_session";
export const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;
export const SESSION_KEY = (key: string) => `${SESSION_PREFIX}:${key}`;
const SIGNING_KEY = new TextEncoder().encode(Bun.env.SECRET!);

type AuthCookieOptions = {
  httpOnly: boolean;
  sameSite: "lax";
  path: string;
  expires: Date;
  secure: boolean;
};

export const AUTH_COOKIE_OPTS: AuthCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  expires: new Date(Date.now() + SESSION_EXPIRY),
  secure: true,
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
  username: string;
  role: Roles;
  id: string;
  exp: number;
} | null;

export const secureSessionToCredentials = (
  session: JWTPayload | null,
): Credentials => {
  if (
    session &&
    "id" in session &&
    "username" in session &&
    "role" in session &&
    "exp" in session &&
    typeof session.id === "string" &&
    typeof session.username === "string" &&
    (session.role === "user" ||
      session.role === "admin" ||
      session.role === "superadmin") &&
    typeof session.exp === "number"
  ) {
    return {
      username: session.username,
      role: session.role,
      id: session.id,
      exp: session.exp,
    };
  }
  return null;
};

export const storeAuthSession = async (
  c: Context,
  session: string,
  type?: "login" | "refresh",
) => {
  const df = c.get("df"); // Get the DragonflyDB instance from the context
  const sessionKey = SESSION_KEY(session); // Create a unique key for the session

  /**
   * Check if there is an existing session
   * If there is, refresh the session by removing
   * the old one and storing the new one
   */
  const oldSession = getCookie(c, SESSION_PREFIX);
  if (oldSession) {
    const oldSessionKey = SESSION_KEY(oldSession);
    await df.del(oldSessionKey);
  }

  // Store the new session token in DragonflyDB
  await df.set(sessionKey, session);
  await df.expire(sessionKey, SESSION_EXPIRY); // Set the expiration time for the session

  // Update the cookie with the new session token
  setCookie(c, SESSION_PREFIX, session, {
    ...AUTH_COOKIE_OPTS,
  });
};

export const getAuthSession = async (c: Context) => {
  const df = c.get("df"); // Get the dragonfly database from the context

  const token = getCookie(c, SESSION_PREFIX);
  if (!token) return null;

  const sessionKey = SESSION_KEY(token); // Create a unique key for the session
  const session = await df.get(sessionKey); // Get the session data from dragonfly

  if (!session) {
    await revokeAuthSession(c);
    return null;
  }

  const payload = await decrypt(session);
  return secureSessionToCredentials(payload);
};

export const revokeAuthSession = async (c: Context) => {
  const df = c.get("df"); // Get the dragonfly database from the context

  const token = getCookie(c, SESSION_PREFIX);
  if (!token) return;

  const sessionKey = SESSION_KEY(token); // Create a unique key for the session
  await df.del(sessionKey); // Delete the session from dragonfly
  // await df.expire(sessionKey, 0); // Set the expiry time for the session

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
