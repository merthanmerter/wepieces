import pkg from "./package.json";
import app from "./src/app";

const port = 5000;
Bun.serve({ port, fetch: app.fetch });

console.log(`
  [\x1b[92m✓\x1b[0m] ${pkg.displayName} Server started!
  
  \x1b[92m➜ \x1b[0m Local: \x1b[94mhttp://localhost:\x1b[0m\x1b[96m${port}\x1b[0m\x1b[94m/\x1b[0m
  \x1b[92m➜ \x1b[0m Version: \x1b[97m${pkg.version}\x1b[0m
  `);
