import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "@app/server/src/api/trpc";
import { MESSAGES } from "@app/server/src/constants";
import {
  AUTH_COOKIE_OPTS,
  decrypt,
  encrypt,
  getAuthSession,
  getUserFromDb,
  revokeAuthSession,
  secureSessionToCredentials,
  storeAuthSession,
  verifyPassword,
  type Credentials,
} from "@app/server/src/lib/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "../../../database/schema";
import { authLoginSchema } from "./definitions";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(authLoginSchema)
    .query(async ({ ctx, input }) => {
      const { username } = input;
      const user = await getUserFromDb(ctx.appContext, username);

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

      const payload: Credentials = {
        id: user.id,
        username: user.username,
        role: user.role,
        activeTenant: user.activeTenant,
        tenants: user.tenants,
        exp: AUTH_COOKIE_OPTS.expires.getTime() / 1000,
      };

      const session = await encrypt(payload);

      await storeAuthSession(ctx.appContext, session);

      const parsed = await decrypt(session);

      return {
        success: true,
        credentials: secureSessionToCredentials(parsed),
      };
    }),

  me: userProcedure.query(async ({ ctx }) => {
    const session = await getAuthSession(ctx.appContext);
    return { success: true, credentials: secureSessionToCredentials(session) };
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
        const user = await getUserFromDb(ctx.appContext, session.id);

        if (!user) {
          await revokeAuthSession(ctx.appContext);
          return { success: false, credentials: null };
        }

        session.username = user.username;
        session.role = user.role;
        session.activeTenant = user.activeTenant;
        session.tenants = user.tenants;
      }

      session.exp = AUTH_COOKIE_OPTS.expires.getTime() / 1000;

      await storeAuthSession(ctx.appContext, await encrypt(session));

      return {
        success: true,
        credentials: secureSessionToCredentials(session),
      };
    }),

  logout: userProcedure.query(async ({ ctx }) => {
    await revokeAuthSession(ctx.appContext);
  }),

  changeActiveTenant: userProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = ctx.session.tenants.find((t) => t.id === input.id);

      if (!tenant) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: MESSAGES.invalidCredentials,
        });
      }

      await ctx.db
        .update(users)
        .set({
          activeTenantId: tenant.id,
        })
        .where(eq(users.id, ctx.session.id))
        .returning()
        .execute();

      return {
        success: true,
        credentials: secureSessionToCredentials(ctx.session),
        tenant,
      };
    }),
});
