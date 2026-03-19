import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const roastTypeEnum = pgEnum("roast_type", ["brutal", "friendly"]);

export const badgeStatusEnum = pgEnum("badge_status", [
	"critical",
	"warning",
	"good",
]);

export const submissions = pgTable("submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull(),
	language: varchar("language", { length: 50 }).notNull(),
	ipHash: varchar("ip_hash", { length: 64 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roasts = pgTable("roasts", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id").notNull(),
	score: integer("score").notNull(),
	feedback: text("feedback").notNull(),
	roastType: roastTypeEnum("roast_type").notNull().default("brutal"),
	badgeStatus: badgeStatusEnum("badge_status"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id").notNull(),
	authorName: varchar("author_name", { length: 100 }),
	shameScore: integer("shame_score").notNull(),
	rankPosition: integer("rank_position"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert;
