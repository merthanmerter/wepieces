import { migrate as migrator } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../../env";
import { hashPassword } from "../lib/auth";
import { DATABASE_OPTIONS, db } from "./";
import { users } from "./schema";

export const migrate = async () => {
  /**
   * 1. Create the `database` if it doesn't exist.
   */
  try {
    await postgres({ ...DATABASE_OPTIONS, database: undefined }).unsafe(
      `CREATE DATABASE ${env.DATABASE_SCHEMA};`,
    );
  } catch (error) {}

  /**
   * 2. Migrate the database.
   */
  try {
    await migrator(db, {
      migrationsFolder: "drizzle",
    });
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }

  /**
   * 3. Create the superadmin user if it doesn't exist.
   */
  try {
    await db
      .insert(users)
      .values({
        username: env.SUPERADMIN_USERNAME,
        email: env.SUPERADMIN_EMAIL,
        role: "superadmin",
        password: await hashPassword(env.SUPERADMIN_PASSWORD),
      })
      .execute();
  } catch (error) {}

  console.log("[\x1b[32m✓\x1b[0m] Migration completed");
  process.exit(0);
};

migrate();
