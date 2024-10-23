import { $ } from "bun";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    exe: {
      type: "boolean",
      default: false,
    },
    migrate: {
      type: "boolean",
      default: false,
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.migrate) {
  await Promise.all([
    $`cd apps/server && bun run db:generate && bun run db:migrate`,
  ]);
}

if (values.exe) {
  await Promise.all([$`cd apps/server && bun run build:win`]);
}
