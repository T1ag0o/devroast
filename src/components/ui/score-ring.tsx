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

function getScoreGradientStops(
	value: number,
	max: number,
): { color: string; offset: string }[] {
	const percentage = value / max;
	if (percentage >= 0.7) {
		return [
			{ color: "#EF4444", offset: "0%" },
			{ color: "#F59E0B", offset: "35%" },
			{ color: "#10B981", offset: "35%" },
		];
	}
	if (percentage >= 0.4) {
		return [
			{ color: "#EF4444", offset: "0%" },
			{ color: "#F59E0B", offset: "0%" },
		];
	}
	return [{ color: "#EF4444", offset: "0%" }];
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
	(
		{ value, max = 10, size = 180, strokeWidth = 4, className, ...props },
		ref,
	) => {
		const percentage = Math.min(Math.max(value / max, 0), 1);
		const radius = (size - strokeWidth) / 2;
		const circumference = 2 * Math.PI * radius;
		const strokeDashoffset = circumference * (1 - percentage);
		const scoreColor = getScoreColor(value, max);
		const gradientStops = getScoreGradientStops(value, max);
		const gradientId = `score-gradient-${Math.random().toString(36).substr(2, 9)}`;

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
					<defs>
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
							{gradientStops.map((stop, i) => (
								<stop key={i} offset={stop.offset} stopColor={stop.color} />
							))}
						</linearGradient>
					</defs>
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
						stroke={`url(#${gradientId})`}
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
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
