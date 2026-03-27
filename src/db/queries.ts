import { db, rawQuery } from "./index";
import {
	leaderboard,
	type NewLeaderboardEntry,
	type NewRoast,
	type NewSubmission,
	roasts,
	submissions,
} from "./schema";

export async function createSubmission(data: NewSubmission) {
	const result = await db.insert(submissions).values(data).returning();
	return result[0];
}

export async function getSubmissionById(id: string) {
	const result = await db
		.select()
		.from(submissions)
		.where(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(submissions: any) => submissions.id.eq(id),
		);
	return result[0];
}

export async function getRecentSubmissions(limit = 10) {
	return (
		db
			.select()
			.from(submissions)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where((submissions: any) => submissions.id.isNotNull())
			.orderBy(submissions.createdAt)
			.limit(limit)
	);
}

export async function createRoast(data: NewRoast) {
	const result = await db.insert(roasts).values(data).returning();
	return result[0];
}

export async function getRoastBySubmissionId(submissionId: string) {
	const result = await db
		.select()
		.from(roasts)
		.where(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(roasts: any) => roasts.submissionId.eq(submissionId),
		);
	return result[0];
}

export async function createLeaderboardEntry(data: NewLeaderboardEntry) {
	const result = await db.insert(leaderboard).values(data).returning();
	return result[0];
}

export async function getLeaderboard(limit = 50) {
	return (
		db
			.select()
			.from(leaderboard)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where((leaderboard: any) => leaderboard.id.isNotNull())
			.orderBy(leaderboard.shameScore)
			.limit(limit)
	);
}

export async function canSubmit(
	ipHash: string,
): Promise<{ canSubmit: boolean; waitSeconds: number }> {
	const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
	const sql = `
    SELECT created_at FROM submissions
    WHERE ip_hash = $1 AND created_at >= $2
    ORDER BY created_at DESC
    LIMIT 1
  `;
	const result = await rawQuery<{ created_at: Date }>(sql, [
		ipHash,
		tenMinutesAgo.toISOString(),
	]);

	if (!result || result.length === 0) {
		return { canSubmit: true, waitSeconds: 0 };
	}

	const lastSubmission = result[0].created_at;
	const nextSubmitTime = new Date(lastSubmission.getTime() + 10 * 60 * 1000);
	const now = new Date();
	const waitMs = nextSubmitTime.getTime() - now.getTime();

	if (waitMs <= 0) {
		return { canSubmit: true, waitSeconds: 0 };
	}

	return { canSubmit: false, waitSeconds: Math.ceil(waitMs / 1000) };
}

export async function getLeaderboardWithSubmissions(limit = 50) {
	const sql = `
    SELECT 
      l.id,
      l.submission_id,
      l.author_name,
      l.shame_score,
      l.rank_position,
      l.created_at,
      s.code,
      s.language
    FROM leaderboard l
    JOIN submissions s ON l.submission_id = s.id
    ORDER BY l.shame_score DESC
    LIMIT ${Number(limit)}
  `;
	const result = await rawQuery<{
		id: string;
		submission_id: string;
		author_name: string | null;
		shame_score: number;
		rank_position: number | null;
		created_at: Date;
		code: string;
		language: string;
	}>(sql, []);
	return result;
}

export async function getSubmissionWithRoast(id: string) {
	const sql = `
    SELECT 
      s.id as submission_id,
      s.code,
      s.language,
      s.created_at,
      r.id as roast_id,
      r.score,
      r.feedback,
      r.roast_type,
      r.badge_status
    FROM submissions s
    LEFT JOIN roasts r ON r.submission_id = s.id
    WHERE s.id = $1
  `;
	const result = await rawQuery<{
		submission_id: string;
		code: string;
		language: string;
		created_at: Date;
		roast_id: string | null;
		score: number | null;
		feedback: string | null;
		roast_type: string | null;
		badge_status: string | null;
	}>(sql, [id]);
	return result[0];
}

export async function getMetrics() {
	const sql = `
    SELECT 
      (SELECT COUNT(*) FROM submissions) as total_codes,
      (SELECT COALESCE(AVG(score::numeric), 0) FROM roasts) as avg_score
  `;
	const result = await rawQuery<{ total_codes: bigint; avg_score: string }>(
		sql,
		[],
	);
	return result;
}
