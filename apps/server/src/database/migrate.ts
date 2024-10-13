import { migrate as drizzle_migrate } from "drizzle-orm/postgres-js/migrator";
import { env } from "../../env";
import { hashPassword } from "../lib/auth";
import { db } from "./";
import { users } from "./schema";

export const migrate = async () => {
  try {
    await drizzle_migrate(db, {
      migrationsFolder: "drizzle",
    });

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
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

migrate();
