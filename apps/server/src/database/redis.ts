import { Redis } from "ioredis";
import { env } from "../../env";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

redis.on("error", (err) => {
  console.error(`Redis error:`, err);
  process.exit(1);
});

redis.on("ready", () => {
  console.log("  [\x1b[92m✓\x1b[0m] Redis is running.");
});
