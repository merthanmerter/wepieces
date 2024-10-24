import { env } from "./env";
import pkg from "./package.json";
import app from "./src/app";
import { migrate } from "./src/database/migrate";
import { $catch } from "./src/lib/catch-error";

const port = 5000;
const server = Bun.serve({ port, fetch: app.fetch });

await $catch(migrate());

if (server) {
  console.log(`
  [\x1b[92m✓\x1b[0m] ${pkg.displayName} Server started!
  
  \x1b[92m➜ \x1b[0m Local: \x1b[94m${server.url}\x1b[0m
  \x1b[92m➜ \x1b[0m Environment: \x1b[94m${env.NODE_ENV}\x1b[0m
  \x1b[92m➜ \x1b[0m Version: \x1b[97m${pkg.version}\x1b[0m
  `);
}
