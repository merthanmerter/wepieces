import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { db } from "../database";
import {
  type SelectSession,
  type SelectUser,
  sessions,
  users,
} from "../database/schema";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<SelectSession> {
  const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: SelectSession = {
    id,
    userId,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(sessions).values(session).execute();
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expires.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expires.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessions)
      .set({
        expires: session.expires,
      })
      .where(eq(sessions.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export type SessionValidationResult =
  | { session: SelectSession; user: SelectUser }
  | { session: null; user: null };

export function setSessionTokenCookie(
  response: Response,
  token: string,
  expires: Date,
): void {}

export function deleteSessionTokenCookie(response: Response): void {}
