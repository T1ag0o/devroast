"use client";

import { CodeHtml } from "./code-html";

interface LeaderboardRowProps {
	rank: number;
	score: number;
	codePreviewHtml: string;
	codeFullHtml: string;
	hasMore: boolean;
	language: string;
	previewLineCount?: number;
}

export function LeaderboardRow({
	rank,
	score,
	codePreviewHtml,
	codeFullHtml,
	hasMore,
	language,
	previewLineCount,
}: LeaderboardRowProps) {
	const getScoreVariant = () => {
		if (score >= 8) return "text-accent-green";
		if (score >= 5) return "text-accent-amber";
		return "text-accent-red";
	};

	return (
		<div className="border-b border-border-primary">
			<div className="flex items-center w-full px-5 py-3">
				<span className="font-mono text-xs text-text-tertiary w-[50px]">
					#{rank}
				</span>
				<span
					className={`font-mono text-xs font-bold w-[70px] ${getScoreVariant()}`}
				>
					{score.toFixed(1)}
				</span>
				<span className="flex-1 min-w-0 overflow-hidden relative">
					<CodeHtml
						previewHtml={codePreviewHtml}
						fullHtml={codeFullHtml}
						hasMore={hasMore}
						previewLineCount={previewLineCount}
						dynamicHeight
					/>
				</span>
				<span className="font-mono text-xs text-text-secondary w-[100px] text-right">
					{language}
				</span>
			</div>
		</div>
	);
}
