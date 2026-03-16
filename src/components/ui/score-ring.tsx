import { forwardRef, type HTMLAttributes } from "react";

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
	value: number;
	max?: number;
	size?: number;
	strokeWidth?: number;
}

function getScoreColor(value: number, max: number): string {
	const percentage = value / max;
	if (percentage >= 0.7) return "#10B981";
	if (percentage >= 0.4) return "#F59E0B";
	return "#EF4444";
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
	(
		{ value, max = 10, size = 180, strokeWidth = 8, className, ...props },
		ref,
	) => {
		const percentage = Math.min(Math.max(value / max, 0), 1);
		const radius = (size - strokeWidth) / 2;
		const circumference = 2 * Math.PI * radius;
		const strokeDashoffset = circumference * (1 - percentage);
		const scoreColor = getScoreColor(value, max);

		return (
			<div
				ref={ref}
				className={`relative inline-flex items-center justify-center ${className}`}
				style={{ width: size, height: size, borderRadius: "50%" }}
				{...props}
			>
				<svg
					width={size}
					height={size}
					role="img"
					aria-label={`Score: ${value} out of ${max}`}
					style={{ transform: "rotate(-90deg)" }}
				>
					<title>{`Score: ${value} out of ${max}`}</title>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="var(--color-border-primary)"
						strokeWidth={strokeWidth}
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={scoreColor}
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="font-mono text-4xl font-bold text-text-primary leading-none">
						{value.toFixed(1)}
					</span>
					<span className="font-mono text-sm text-text-tertiary">/{max}</span>
				</div>
			</div>
		);
	},
);

ScoreRing.displayName = "ScoreRing";
