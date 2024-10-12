import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export const sessionKey = "_session";
const key = new TextEncoder().encode(Bun.env.SECRET!);

type AuthCookieOpts = {
  httpOnly: boolean;
  sameSite: "lax";
  path: string;
  expires: Date;
  secure: boolean;
};

export const authCookieOpts: AuthCookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  secure: true,
};

export const encrypt = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 week")
    .sign(key);
};

export const decrypt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, key, {
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

export const serializeSession = (session: JWTPayload | null): Credentials => {
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

export const getAuthSession = async (c: Context) => {
  const session = getCookie(c, sessionKey);
  if (!session) {
    await revokeAuthSession(c);
    return null;
  }

  const payload = await decrypt(session);
  return serializeSession(payload);
};

export const revokeAuthSession = async (c: Context) => {
  setCookie(c, sessionKey, "", {
    ...authCookieOpts,
    expires: new Date(0),
  });
};
