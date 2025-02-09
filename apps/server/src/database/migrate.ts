import { migrate as migrator } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../../env";
import { hashPassword } from "../lib/auth";
import { DATABASE_OPTIONS, db } from "./";
import { tenants, users, usersTenants } from "./schema";

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
    await db.transaction(async (trx) => {
      const [tenant] = await trx
        .insert(tenants)
        .values({
          name: "default",
          status: "active",
        })
        .onConflictDoNothing({
          target: tenants.name,
        })
        .returning()
        .execute();

      if (!tenant) return;

      const [user] = await trx
        .insert(users)
        .values({
          username: env.SUPERADMIN_USERNAME,
          email: env.SUPERADMIN_EMAIL,
          password: await hashPassword(env.SUPERADMIN_PASSWORD),
          activeTenantId: tenant.id,
        })
        .returning()
        .execute();

      await trx.insert(usersTenants).values({
        userId: user.id,
        tenantId: tenant.id,
        role: "superadmin",
      });
      // .onConflictDoNothing({
      //   target: [usersTenants.userId, usersTenants.tenantId],
      // })
      // .execute();
    });
  } catch (error) {}

  console.log(`  [\x1b[32m✓\x1b[0m] Database migration completed`);
  process.exit(0);
};

migrate();
