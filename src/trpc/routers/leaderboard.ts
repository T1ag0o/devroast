import { codeToHtml } from "shiki";
import { z } from "zod";
import { getLeaderboardWithSubmissions } from "@/db/queries";
import { publicProcedure, router } from "../init";

function cleanShikiHtml(html: string): string {
	return html.replace(/style="background-color:[^"]*"/gi, 'style=""');
}

export const leaderboardRouter = router({
	getTop: publicProcedure
		.input(
			z
				.object({
					limit: z.number().default(3),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const limit = input?.limit ?? 3;
			const entries = await getLeaderboardWithSubmissions(limit);

			const results = await Promise.all(
				entries.map(async (entry) => {
					const codePreview = entry.code.split("\n").slice(0, 6).join("\n");
					const codeFull = entry.code;
					const hasMore = entry.code.split("\n").length > 6;

					const [previewHtml, fullHtml] = await Promise.all([
						codeToHtml(codePreview, {
							lang: entry.language,
							theme: "dracula",
						}),
						codeToHtml(codeFull, {
							lang: entry.language,
							theme: "dracula",
						}),
					]);

					return {
						rank: entry.rank_position,
						score: Math.round((10 - entry.shame_score / 10) * 10) / 10,
						codeLines: entry.code.split("\n").slice(0, 6),
						codePreviewHtml: cleanShikiHtml(previewHtml),
						codeFullHtml: cleanShikiHtml(fullHtml),
						hasMore,
						language: entry.language,
						authorName: entry.author_name,
					};
				}),
			);

			return results;
		}),
});
