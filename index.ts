import { $ } from "bun";

// "dev": "concurrently \"cd apps/server && bun run dev -w\" \"cd apps/client && bun run dev\"",

await Promise.all([
  $`cd apps/server && bun run dev -w`,
  $`cd apps/client && bun run dev`,
]);
