import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "@app/server/src/api/trpc";
import { MESSAGES } from "@app/server/src/constants";
import { users } from "@app/server/src/database/schema";
import {
  AUTH_COOKIE_OPTS,
  decrypt,
  encrypt,
  getAuthSession,
  revokeAuthSession,
  serializeSession,
  storeAuthSession,
  verifyPassword,
} from "@app/server/src/lib/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authLoginSchema } from "./definitions";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(authLoginSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (trx) => {
        const { username } = input;
        const [user] = await trx
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            password: users.password,
          })
          .from(users)
          .where(eq(users.username, username))
          .execute();

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: MESSAGES.invalidCredentials,
          });
        }

        const isValid = await verifyPassword(input.password, user.password);

        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: MESSAGES.invalidCredentials,
          });
        }

        const payload = {
          id: user.id,
          username: user.username,
          role: user.role,
          exp: AUTH_COOKIE_OPTS.expires.getTime() / 1000,
        };

        const session = await encrypt(payload);

        await storeAuthSession(ctx.appContext, session);

        const parsed = await decrypt(session);

        return {
          success: true,
          credentials: serializeSession(parsed),
        };
      });
    }),

  me: userProcedure.query(async ({ ctx }) => {
    const session = await getAuthSession(ctx.appContext);
    return { success: true, credentials: serializeSession(session) };
  }),

  refresh: userProcedure
    .input(
      z.object({
        revalidate: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
      const { session } = ctx;

      if (input.revalidate) {
        const [user] = await ctx.db
          .select({
            id: users.id,
            username: users.username,
            role: users.role,
          })
          .from(users)
          .where(eq(users.id, session.id));

        if (!user) {
          await revokeAuthSession(ctx.appContext);
          return { success: false, credentials: null };
        }

        session.username = user.username;
        session.role = user.role;
      }

      session.exp = AUTH_COOKIE_OPTS.expires.getTime() / 1000;

      await storeAuthSession(ctx.appContext, await encrypt(session), "refresh");

      return { success: true, credentials: serializeSession(session) };
    }),

  logout: userProcedure.query(async ({ ctx }) => {
    await revokeAuthSession(ctx.appContext);
  }),
});
