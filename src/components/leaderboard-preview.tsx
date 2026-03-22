import { LeaderboardRow } from "@/components/ui/collapsible-row";
import { getLeaderboardTop } from "@/trpc/server";

export async function LeaderboardPreview() {
	const entries = await getLeaderboardTop(3);

	return (
		<div className="border border-border-primary rounded overflow-hidden">
			<div className="flex items-center px-5 py-4 border-b border-border-primary bg-bg-surface">
				<span className="font-mono text-xs text-text-tertiary w-[50px]">#</span>
				<span className="font-mono text-xs text-text-tertiary w-[70px]">
					score
				</span>
				<span className="font-mono text-xs text-text-tertiary flex-1">
					code
				</span>
				<span className="font-mono text-xs text-text-tertiary w-[100px] text-right">
					lang
				</span>
			</div>
			{entries.length === 0 ? (
				<div className="px-5 py-8 text-center">
					<span className="font-mono text-xs text-text-tertiary">
						No roasts yet. Be the first!
					</span>
				</div>
			) : (
				entries.map((entry) => (
					<LeaderboardRow
						key={entry.rank ?? 0}
						rank={entry.rank ?? 0}
						score={entry.score}
						codePreviewHtml={entry.codePreviewHtml}
						codeFullHtml={entry.codeFullHtml}
						hasMore={entry.hasMore}
						language={entry.language}
					/>
				))
			)}
		</div>
	);
}
