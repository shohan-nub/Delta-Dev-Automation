CREATE TABLE "products" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"wid" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(90) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"color" varchar(50) NOT NULL,
	"size" text[],
	"stock" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_wid_workspace_id_fk" FOREIGN KEY ("wid") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;