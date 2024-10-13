CREATE TABLE IF NOT EXISTS "wepieces_posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wepieces_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar DEFAULT 'user' NOT NULL,
	"password" varchar(512) NOT NULL,
	CONSTRAINT "wepieces_users_email_unique" UNIQUE("email")
);
