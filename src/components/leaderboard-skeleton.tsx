export function LeaderboardSkeleton() {
	return (
		<div className="border border-border-primary rounded overflow-hidden">
			<div className="flex items-center h-10 px-5 border-b border-border-primary bg-bg-surface">
				<span className="font-mono text-xs text-text-tertiary w-[40px]">
					rank
				</span>
				<span className="font-mono text-xs text-text-tertiary w-[60px]">
					score
				</span>
				<span className="font-mono text-xs text-text-tertiary flex-1">
					code
				</span>
				<span className="font-mono text-xs text-text-tertiary w-[100px] text-right">
					lang
				</span>
			</div>
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex items-center px-5 py-4 border-b border-border-primary animate-pulse"
				>
					<div className="h-4 w-[40px] bg-bg-input rounded" />
					<div className="h-4 w-[60px] bg-bg-input rounded ml-2" />
					<div className="flex-1 mx-4">
						<div className="h-3 w-3/4 bg-bg-input rounded mb-1" />
						<div className="h-3 w-1/2 bg-bg-input rounded" />
					</div>
					<div className="h-4 w-[100px] bg-bg-input rounded" />
				</div>
			))}
		</div>
	);
}
