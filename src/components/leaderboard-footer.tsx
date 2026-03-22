import { getMetrics } from "@/trpc/server";

export async function LeaderboardFooter() {
	const metrics = await getMetrics();
	const totalCodes = metrics.totalCodes;

	return (
		<div className="text-center pt-4">
			<span className="font-mono text-xs text-text-tertiary">
				showing top 3 of {totalCodes.toLocaleString("en-US")} ·{" "}
				<a href="/leaderboard" className="text-text-secondary hover:underline">
					view full leaderboard &gt;&gt;
				</a>
			</span>
		</div>
	);
}
