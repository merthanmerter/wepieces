import { env } from "./env";
import pkg from "./package.json";
import app from "./src/app";

const port = env.PORT;

const server = Bun.serve({
  port,
  fetch: app.fetch,
});

if (server.url) {
  console.log(`
  [\x1b[92m✓\x1b[0m] ${pkg.displayName} Server started!
  
  \x1b[92m➜ \x1b[0m Local: \x1b[94m${server.url}\x1b[0m
  \x1b[92m➜ \x1b[0m Domain: \x1b[94m${env.DOMAIN}\x1b[0m
  \x1b[92m➜ \x1b[0m Environment: \x1b[94m${import.meta.env.NODE_ENV}\x1b[0m
  \x1b[92m➜ \x1b[0m Version: \x1b[97m${pkg.version}\x1b[0m
  `);
}

// console.log(await s3Client.file("123.txt").text());
