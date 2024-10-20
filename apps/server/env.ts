import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SECRET: z.string(),
    SUPERADMIN_USERNAME: z.string(),
    SUPERADMIN_EMAIL: z.string(),
    SUPERADMIN_PASSWORD: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_SCHEMA: z.string(),
    DATABASE_PORT: z.coerce.number().min(1).max(65535),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().min(1).max(65535),
    NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: {
    // Server settings
    SECRET: Bun.env.SECRET,

    // Super admin credentials
    SUPERADMIN_USERNAME: Bun.env.SUPERADMIN_USERNAME,
    SUPERADMIN_EMAIL: Bun.env.SUPERADMIN_EMAIL,
    SUPERADMIN_PASSWORD: Bun.env.SUPERADMIN_PASSWORD,

    // Database settings
    DATABASE_HOST: Bun.env.DATABASE_HOST,
    DATABASE_USER: Bun.env.DATABASE_USER,
    DATABASE_PASSWORD: Bun.env.DATABASE_PASSWORD,
    DATABASE_SCHEMA: Bun.env.DATABASE_SCHEMA,
    DATABASE_PORT: Bun.env.DATABASE_PORT,

    // Redis settings
    REDIS_HOST: Bun.env.REDIS_HOST,
    REDIS_PORT: Bun.env.REDIS_PORT,
    NODE_ENV: Bun.env.NODE_ENV,
  },
  skipValidation: !!Bun.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
