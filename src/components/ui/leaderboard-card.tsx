"use client";

import { CodeHtml } from "./code-html";

interface LeaderboardCardProps {
	rank: number;
	score: number;
	codePreviewHtml: string;
	codeFullHtml: string;
	hasMore: boolean;
	language: string;
	authorName: string | null;
}

function getScoreColor(score: number): string {
	if (score >= 8) return "text-accent-green";
	if (score >= 5) return "text-accent-amber";
	return "text-accent-red";
}

function getLineCount(html: string): number {
	const match = html.match(/<span class="line"/g);
	return match ? match.length : 0;
}

export function LeaderboardCard({
	rank,
	score,
	codePreviewHtml,
	codeFullHtml,
	hasMore,
	language,
	authorName,
}: LeaderboardCardProps) {
	const previewLineCount = getLineCount(codePreviewHtml);
	const fullLineCount = getLineCount(codeFullHtml);

	return (
		<div className="flex flex-col border border-border-primary rounded overflow-hidden">
			<div className="flex items-center justify-between h-12 px-5 bg-bg-surface border-b border-border-primary min-w-0">
				<div className="flex items-center gap-4 min-w-0">
					<span className="font-mono text-[13px]">
						<span className="text-text-tertiary">#</span>
						<span className="text-primary font-bold">{rank}</span>
					</span>
					<span className="font-mono text-[12px] text-text-tertiary">
						score:{" "}
						<span
							className={`font-mono text-[13px] font-bold ${getScoreColor(score)}`}
						>
							{score.toFixed(1)}
						</span>
					</span>
				</div>
				<div className="flex items-center gap-3 flex-shrink-0">
					{authorName && (
						<span className="font-mono text-xs text-text-tertiary">
							@{authorName}
						</span>
					)}
					<span className="font-mono text-xs text-text-secondary">
						{language}
					</span>
					<span className="font-mono text-xs text-text-tertiary">
						{fullLineCount} lines
					</span>
				</div>
			</div>
			<CodeHtml
				previewHtml={codePreviewHtml}
				fullHtml={codeFullHtml}
				hasMore={hasMore}
				previewLineCount={previewLineCount}
				fullLineCount={fullLineCount}
			/>
		</div>
	);
}
