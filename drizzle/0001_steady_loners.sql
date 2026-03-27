ALTER TABLE "roasts" ALTER COLUMN "badge_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."badge_status";--> statement-breakpoint
CREATE TYPE "public"."badge_status" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
ALTER TABLE "roasts" ALTER COLUMN "badge_status" SET DATA TYPE "public"."badge_status" USING "badge_status"::"public"."badge_status";--> statement-breakpoint
ALTER TABLE "roasts" ALTER COLUMN "score" SET DATA TYPE numeric(4, 1);