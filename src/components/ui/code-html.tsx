"use client";

import { useState } from "react";

interface CodeHtmlProps {
	previewHtml: string;
	fullHtml: string;
	hasMore: boolean;
	previewLineCount?: number;
	fullLineCount?: number;
	dynamicHeight?: boolean;
}

const LINE_HEIGHT = 22;

export function CodeHtml({
	previewHtml,
	fullHtml,
	hasMore,
	previewLineCount = 6,
	fullLineCount = 0,
	dynamicHeight = false,
}: CodeHtmlProps) {
	const [expanded, setExpanded] = useState(false);
	const currentLineCount = expanded ? fullLineCount : previewLineCount;
	const currentHtml = expanded ? fullHtml : previewHtml;
	const shouldLimitHeight = dynamicHeight && !expanded && hasMore;
	const gradientFadeHeight = 32;
	const dynamicMaxHeight = shouldLimitHeight
		? previewLineCount * LINE_HEIGHT + gradientFadeHeight
		: undefined;

	return (
		<div
			className="flex"
			style={{
				minHeight: dynamicHeight ? previewLineCount * LINE_HEIGHT : 120,
			}}
		>
			<div className="flex flex-col gap-1 px-3 py-3 bg-bg-surface border-r border-border-primary min-w-[40px] flex-shrink-0">
				{Array.from({ length: currentLineCount }, (_, i) => (
					<span
						key={i}
						className="font-mono text-xs text-text-tertiary text-right leading-[22px]"
					>
						{i + 1}
					</span>
				))}
			</div>
			<div className="flex-1 min-w-0">
				<div
					className="relative overflow-hidden"
					style={{
						maxHeight: dynamicMaxHeight ?? (expanded ? "none" : "144px"),
						maskImage:
							hasMore && !expanded
								? "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
								: undefined,
						WebkitMaskImage:
							hasMore && !expanded
								? "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
								: undefined,
					}}
				>
					<span
						className="[&_pre]:inline [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:!bg-transparent block"
						dangerouslySetInnerHTML={{
							__html: currentHtml,
						}}
					/>
				</div>
				{hasMore && (
					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						className="relative flex items-center justify-center w-full py-2 gap-2 text-text-tertiary hover:text-text-primary hover:bg-bg-surface/50 transition-colors border-t border-border-primary"
					>
						<span className="font-mono text-xs">
							{expanded ? "Show less" : "Show more"}
						</span>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className={expanded ? "rotate-180" : ""}
						>
							<path d="M6 9l6 6 6-6" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
}
