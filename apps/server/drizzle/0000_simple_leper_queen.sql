CREATE TABLE IF NOT EXISTS "wepieces_posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"tenant" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wepieces_tenants" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wepieces_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar DEFAULT 'user' NOT NULL,
	"password" varchar(512) NOT NULL,
	"active_tenant" text NOT NULL,
	CONSTRAINT "wepieces_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wepieces_users_tenants" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tenant_id" text NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_posts" ADD CONSTRAINT "wepieces_posts_tenant_wepieces_tenants_id_fk" FOREIGN KEY ("tenant") REFERENCES "public"."wepieces_tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_users" ADD CONSTRAINT "wepieces_users_active_tenant_wepieces_tenants_id_fk" FOREIGN KEY ("active_tenant") REFERENCES "public"."wepieces_tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_users_tenants" ADD CONSTRAINT "wepieces_users_tenants_user_id_wepieces_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."wepieces_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_users_tenants" ADD CONSTRAINT "wepieces_users_tenants_tenant_id_wepieces_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."wepieces_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
