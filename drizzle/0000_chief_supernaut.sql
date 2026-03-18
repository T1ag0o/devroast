CREATE TYPE "public"."badge_status" AS ENUM('excellent', 'good', 'needs-improvement', 'bad', 'terrible');--> statement-breakpoint
CREATE TYPE "public"."roast_type" AS ENUM('brutal', 'friendly');--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"author_name" varchar(100),
	"shame_score" integer NOT NULL,
	"rank_position" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"feedback" text NOT NULL,
	"roast_type" "roast_type" DEFAULT 'brutal' NOT NULL,
	"badge_status" "badge_status",
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" varchar(50) NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
