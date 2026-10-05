CREATE TABLE "knowledge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "workspace" CASCADE;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_wid_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "wid";