CREATE TABLE IF NOT EXISTS "wepieces_todo" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"tenant" text NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false,
	"type" varchar DEFAULT 'personal' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_todo" ADD CONSTRAINT "wepieces_todo_created_by_wepieces_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."wepieces_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_todo" ADD CONSTRAINT "wepieces_todo_updated_by_wepieces_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."wepieces_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_todo" ADD CONSTRAINT "wepieces_todo_tenant_wepieces_tenants_id_fk" FOREIGN KEY ("tenant") REFERENCES "public"."wepieces_tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
