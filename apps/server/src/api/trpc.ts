/**
 * This file (trpc config) is originated from the create-t3-app.
 * Some options may have been changed and adapted to our use case.
 * For SSR compatible alternative please refer to the t3 repo.
 * @see https://create.t3.gg/
 */

import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import superjson from "superjson";
import { ZodError } from "zod";
import { MESSAGES } from "../constants";
import { getAuthSession } from "../lib/auth";

/**
 *
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export const createTRPCContext = async (appContext: Context) => {
  const db = appContext.get("db");
  const session = await getAuthSession(appContext);
  return { db, session, appContext };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a context for the tRPC API.
 * @example
 * createContext: (_opts, c) => createContext(c as HonoContext),
 */
export const createContext = async (c: Context<BlankEnv, "", BlankInput>) => {
  return createTRPCContext(c);
};

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware
 */
const middleware = t.middleware(async ({ next, path, ctx }) => {
  if (!["auth.refresh"].includes(path)) {
    const dateTime = new Date().toLocaleString("en-US", { hour12: false });
    console.log(
      `[\x1b[97m${dateTime}\x1b[0m] \x1b[91m${ctx.session ? ctx.session?.username + `(${ctx.session.role})` : "anonymous"}\x1b[0m made a \x1b[91m${ctx.appContext.req.method?.toLowerCase()}\x1b[0m request to \x1b[91m${path}\x1b[0m procedure.`,
    );
  }

  /*
  We can use hono context to control caching.
  const cacheVersion = ctx.appContext.req.headers.get("x-cache-version");
  ctx.appContext.res.headers.append(
    "Cache-Control",
    `private, max-age=0, stale-while-revalidate=60, version=${cacheVersion}`,
  );
  */

  return await next();
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(middleware);

/**
 * User (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */

export const userProcedure = t.procedure
  .use(middleware)
  .use(({ ctx, next }) => {
    /*
    Only users can access this procedure.
    */
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: MESSAGES.unauthorized,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });

/**
 * Admin (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in admins, use this.
 *
 * @see https://trpc.io/docs/procedures
 */

export const adminProcedure = t.procedure
  .use(middleware)
  .use(({ ctx, next }) => {
    /*
    Only admins and superadmins can access this procedure.
    */
    if (
      !ctx.session ||
      (ctx.session.role !== "admin" && ctx.session.role !== "superadmin")
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: !ctx.session ? MESSAGES.unauthorized : MESSAGES.notAdmin,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });

export const superAdminProcedure = t.procedure
  .use(middleware)
  .use(({ ctx, next }) => {
    /*
    Only admins and superadmins can access this procedure.
    */
    if (!ctx.session || ctx.session.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: !ctx.session ? MESSAGES.unauthorized : MESSAGES.notSuperAdmin,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });
