ALTER TABLE "wepieces_posts" ALTER COLUMN "created_by" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "wepieces_posts" ALTER COLUMN "updated_by" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_posts" ADD CONSTRAINT "wepieces_posts_created_by_wepieces_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."wepieces_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_posts" ADD CONSTRAINT "wepieces_posts_updated_by_wepieces_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."wepieces_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
