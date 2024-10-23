CREATE TABLE IF NOT EXISTS "wepieces_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wepieces_session" ADD CONSTRAINT "wepieces_session_userId_wepieces_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."wepieces_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
