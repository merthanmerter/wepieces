import { env } from "./env";
import pkg from "./package.json";
import app from "./src/app";
import { migrate } from "./src/database/migrate";
import { redis } from "./src/database/redis";

const port = 5000;
const server = Bun.serve({ port, fetch: app.fetch });

/**
 * Runs database migrations on startup
 * Migrations will run automatically when the server starts.
 * This is a more convenient way to run migrations as database ports will not be exposed.
 * Change .env MIGRATE=0 to disable.
 */
if (server && env.MIGRATE) migrate();

redis.on("error", (err) => {
  console.error(`Redis error:`, err);
  process.exit(1);
});

redis.on("ready", () => {
  console.log(`
  [\x1b[92m✓\x1b[0m] ${pkg.displayName} Server started!
  
  \x1b[92m➜ \x1b[0m Local: \x1b[94m${server.url}\x1b[0m
  \x1b[92m➜ \x1b[0m Redis is running on port \x1b[96m${redis.options.port}\x1b[0m
  \x1b[92m➜ \x1b[0m Version: \x1b[97m${pkg.version}\x1b[0m
  `);
});
