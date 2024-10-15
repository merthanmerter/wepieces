import { Redis as Dragonfly } from "ioredis";
import { env } from "../../env";

export const df = new Dragonfly({
  host: env.DRAGONFLY_HOST,
  port: env.DRAGONFLY_PORT,
});

df.on("error", (err) => {
  console.error(`Dragonfly error:`, err);
  process.exit(1);
});

df.on("ready", () => {
  console.log("  🦋 Dragonfly is ready.");
});
