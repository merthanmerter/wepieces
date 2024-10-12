import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../../env";
import * as schema from "./schema";

const pool = postgres({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_SCHEMA,
});

export const db = drizzle(pool, { schema: schema });
