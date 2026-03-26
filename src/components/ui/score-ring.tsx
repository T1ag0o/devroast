import { forwardRef, type HTMLAttributes } from "react";

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
	value: number;
	max?: number;
	size?: number;
	strokeWidth?: number;
}

const COLORS = {
	green: "#10B981",
	amber: "#F59E0B",
	red: "#EF4444",
} as const;

function getScoreColor(value: number, max: number): string {
	const percentage = value / max;
	if (percentage >= 0.7) return COLORS.green;
	if (percentage >= 0.4) return COLORS.amber;
	return COLORS.red;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
	(
		{ value, max = 10, size = 180, strokeWidth = 8, className, ...props },
		ref,
	) => {
		const percentage = Math.min(Math.max(value / max, 0), 1);
		const radius = (size - strokeWidth) / 2;
		const circumference = 2 * Math.PI * radius;
		const scoreColor = getScoreColor(value, max);

		const filledLength = circumference * percentage;
		const emptyLength = circumference - filledLength;

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
						strokeDasharray={`${filledLength} ${emptyLength}`}
						strokeLinecap="round"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span
						className="font-mono font-bold leading-none"
						style={{ fontSize: size * 0.267, color: scoreColor }}
					>
						{value.toFixed(1)}
					</span>
					<span
						className="font-mono text-text-tertiary"
						style={{ fontSize: size * 0.089 }}
					>
						/{max}
					</span>
				</div>
			</div>
		);
	},
);

ScoreRing.displayName = "ScoreRing";
