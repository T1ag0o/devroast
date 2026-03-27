/**
 * Route handler para geração de imagem OpenGraph.
 *
 * GET /results/[id]/opengraph
 *
 * Retorna uma imagem PNG/WebP com:
 * - Score do roast
 * - Quote sarcástica
 * - Verdict badge colorido baseado no score
 * - Linguagem e quantidade de linhas
 *
 * @throws 404 - Se o roast não for encontrado
 *
 * @see RoastOG
 * @see https://github.com/kane50613/takumi
 */

import { ImageResponse } from "@takumi-rs/image-response";
import { RoastOG } from "@/components/og/roast-og";
import { getSubmissionWithRoast } from "@/db/queries";
import { getFonts } from "@/lib/fonts";

export const dynamic = "force-dynamic";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		console.log("[OG] Generating image for:", id);

		const data = await getSubmissionWithRoast(id);

		if (!data || !data.code) {
			console.log("[OG] Data not found for:", id);
			return new Response("Not Found", { status: 404 });
		}

		const score = data.score ? Number(data.score) : 5;
		let feedback: { quote?: string; verdict?: string } = {};
		if (data.feedback) {
			if (typeof data.feedback === "object") {
				feedback = data.feedback;
			} else if (typeof data.feedback === "string") {
				try {
					feedback = JSON.parse(data.feedback);
				} catch {
					feedback = {};
				}
			}
		}
		const lineCount = data.code.split("\n").length;

		console.log("[OG] Score:", score, "Quote:", feedback.quote);

		const fonts = await getFonts();
		console.log("[OG] Fonts loaded:", fonts.length);

		const response = new ImageResponse(
			<RoastOG
				score={score}
				quote={feedback.quote || "Code roasted!"}
				verdict={feedback.verdict || "roasted"}
				language={data.language}
				lineCount={lineCount}
			/>,
			{
				width: 1200,
				height: 630,
				fonts,
			},
		);

		console.log(
			"[OG] Response headers:",
			Object.fromEntries(response.headers.entries()),
		);
		return response;
	} catch (error) {
		console.error("[OG] Error generating image:", error);
		return new Response("Error generating image", { status: 500 });
	}
}
