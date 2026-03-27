import { createHash } from "node:crypto";
import { z } from "zod";
import {
	canSubmit,
	createLeaderboardEntry,
	createRoast,
	createSubmission,
} from "@/db/queries";
import {
	calculateRoastShameScore,
	generateRoast,
	getBadgeStatus,
} from "@/lib/gemini";
import { publicProcedure, router } from "../init";

const submitSchema = z.object({
	code: z.string().min(1).max(5000),
	language: z.string().min(1).max(50),
	roastType: z.enum(["brutal", "friendly"]).default("brutal"),
	nickname: z.string().max(30).optional(),
});

function getIpHash(ip: string | null): string {
	if (!ip) {
		return createHash("sha256").update("anonymous").digest("hex");
	}
	return createHash("sha256").update(ip).digest("hex");
}

export const roastRouter = router({
	submit: publicProcedure
		.input(submitSchema)
		.mutation(async ({ input, ctx }) => {
			const ip =
				ctx.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
				ctx.headers?.get("x-real-ip") ||
				null;
			const ipHash = getIpHash(ip);

			const rateLimit = await canSubmit(ipHash);
			if (!rateLimit.canSubmit) {
				const minutes = Math.ceil(rateLimit.waitSeconds / 60);
				throw new Error(
					`RATE_LIMIT:${rateLimit.waitSeconds}:Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before submitting again`,
				);
			}

			const submission = await createSubmission({
				code: input.code,
				language: input.language,
				ipHash,
			});

			const analysis = await generateRoast(
				input.code,
				input.language,
				input.roastType,
			);

			const shameScore = calculateRoastShameScore(analysis.score);
			const badgeStatus = getBadgeStatus(analysis.issues);

			const roast = await createRoast({
				submissionId: submission.id,
				score: String(Math.round(analysis.score * 10) / 10),
				feedback: JSON.stringify({
					verdict: analysis.verdict,
					quote: analysis.quote,
					issues: analysis.issues,
					suggestedFix: analysis.suggestedFix,
				}),
				roastType: input.roastType,
				badgeStatus,
			});

			await createLeaderboardEntry({
				submissionId: submission.id,
				shameScore,
				rankPosition: null,
				authorName: input.nickname || "anonymous",
			});

			return {
				submissionId: submission.id,
				roastId: roast.id,
				score: analysis.score,
				verdict: analysis.verdict,
				quote: analysis.quote,
				issues: analysis.issues,
				suggestedFix: analysis.suggestedFix,
				badgeStatus,
			};
		}),
});
