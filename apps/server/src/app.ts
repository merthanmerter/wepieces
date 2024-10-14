import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { createMiddleware } from "hono/factory";
import { appRouter } from "./api/root";
import { createContext } from "./api/trpc";
import { db } from "./database";
import { df } from "./database/dragonfly";

declare module "hono" {
  interface ContextVariableMap {
    db: typeof db;
    df: typeof df;
  }
}

const app = new Hono();

/**
 * Middleware to set variables on the app context
 * This is also used in the trpc context.
 * @file './api/trpc.ts'
 */
app.use(
  createMiddleware(async (c, next) => {
    c.set("db", db); // Set the postgres database to the context
    c.set("df", df); // Set the dragonfly database to the context

    /**
     * List all sessions
     */
    // const sessions = await df.keys("*_session:*");
    // console.log("Active sessions:", sessions.length);

    await next();
  }),
);

app.use(
  csrf({
    origin: ["http://localhost:4000"],
  }),
);
app.use(
  "*",
  cors({
    origin: ["http://localhost:4000"],
    allowHeaders: ["Content-Type", "Authorization", "Accept-Encoding"],
    allowMethods: ["POST", "GET", "DELETE", "OPTIONS", "PUT", "PATCH"],
    credentials: true,
    exposeHeaders: ["Cross-Origin-Resource-Policy"],
  }),
);

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (_opts, c) => createContext(c),
  }),
);

app.use("*", serveStatic({ root: "./dist" }));
app.use("*", serveStatic({ path: "./dist/index.html" }));
app.use("/assets/*", serveStatic({ root: "./dist/assets" }));
app.use("/favicon.ico", serveStatic({ path: "./dist/favicon.ico" }));

export default app;
export type AppRouter = typeof appRouter;
