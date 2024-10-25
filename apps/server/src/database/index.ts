import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../../env";
import * as schema from "./schema";

export const DATABASE_OPTIONS: postgres.Options<{}> = {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_SCHEMA,
  // connect_timeout: 10000,
  // idle_timeout: 10000,
  // keep_alive: true,
  // max: 10,
  ssl: true,
  onnotice: () => {}, // Suppress Postgres notices
};

const pool = postgres(DATABASE_OPTIONS);

export const db = drizzle(pool, { schema: schema });
