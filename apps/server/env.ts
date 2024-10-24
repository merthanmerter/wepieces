import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DOMAIN: z.string(),
    SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]),
    SUPERADMIN_USERNAME: z.string(),
    SUPERADMIN_EMAIL: z.string(),
    SUPERADMIN_PASSWORD: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_SCHEMA: z.string(),
    DATABASE_PORT: z.coerce.number().min(1).max(65535),
  },
  runtimeEnv: {
    // Server settings
    DOMAIN: Bun.env.DOMAIN,
    SECRET: Bun.env.SECRET,
    NODE_ENV: Bun.env.NODE_ENV,

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
  },
  skipValidation: !!Bun.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
