import { $ } from "bun";

await Promise.all([
  $`cd apps/server && bun run db:generate && bun run db:migrate`,
]);
