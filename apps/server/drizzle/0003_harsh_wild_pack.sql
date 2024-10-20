ALTER TABLE "wepieces_posts" DROP CONSTRAINT "wepieces_posts_tenant_wepieces_tenants_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_posts" ADD CONSTRAINT "wepieces_posts_tenant_wepieces_tenants_id_fk" FOREIGN KEY ("tenant") REFERENCES "public"."wepieces_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "wepieces_users" DROP COLUMN IF EXISTS "role";