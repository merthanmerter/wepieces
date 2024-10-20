ALTER TABLE "wepieces_users_tenants" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "wepieces_tenants" ADD CONSTRAINT "wepieces_tenants_name_unique" UNIQUE("name");