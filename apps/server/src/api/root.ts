import { authRouter } from "./routers/auth";
import { tenantsRouter } from "./routers/tenants";
import { usersRouter } from "./routers/users";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  tenants: tenantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
