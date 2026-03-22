import type { Metadata } from "next";
import { LeaderboardCard } from "@/components/ui/leaderboard-card";
import { getLeaderboardTop, getMetrics } from "@/trpc/server";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "shame_leaderboard | devroast",
	description: "The most roasted code on the internet",
};

export default async function LeaderboardPage() {
	const [entries, metrics] = await Promise.all([
		getLeaderboardTop(20),
		getMetrics(),
	]);

	return (
		<main className="flex flex-col items-center w-full">
			<div className="w-full max-w-[1440px] px-10 flex flex-col gap-10 pt-20 pb-20">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="text-accent-green font-mono text-[32px] font-bold">
							&gt;
						</span>
						<h1 className="font-mono text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-text-secondary">
						<span className="text-accent-green">//</span> the most roasted code
						on the internet
					</p>
					<div className="flex items-center gap-2 text-text-tertiary font-mono text-xs">
						<span>{metrics.totalCodes.toLocaleString()} submissions</span>
						<span>·</span>
						<span>avg score: {metrics.avgScore.toFixed(1)}/10</span>
					</div>
				</div>

				<div className="flex flex-col gap-5">
					{entries.map((entry) => (
						<LeaderboardCard
							key={entry.id}
							rank={entry.rank ?? 0}
							score={entry.score}
							codePreviewHtml={entry.codePreviewHtml}
							codeFullHtml={entry.codeFullHtml}
							hasMore={entry.hasMore}
							language={entry.language}
							authorName={entry.authorName}
						/>
					))}
				</div>
			</div>
		</main>
	);
}
