import { authRouter } from "./routers/auth";
import { postsRouter } from "./routers/posts";
import { tenantsRouter } from "./routers/tenants";
import { todoRouter } from "./routers/todo";
import { usersRouter } from "./routers/users";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  posts: postsRouter,
  todo: todoRouter,
  users: usersRouter,
  tenants: tenantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
