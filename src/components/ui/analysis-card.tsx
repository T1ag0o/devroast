import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { tv } from "tailwind-variants";

const analysisCardVariants = tv({
	base: "border border-border-primary p-5 flex flex-col gap-3 bg-transparent",
});

const dotVariants = tv({
	base: "h-2 w-2 rounded-full",
	variants: {
		severity: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
		},
	},
	defaultVariants: {
		severity: "critical",
	},
});

const labelVariants = tv({
	base: "font-mono text-xs",
	variants: {
		severity: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
		},
	},
	defaultVariants: {
		severity: "critical",
	},
});

export interface AnalysisCardProps extends HTMLAttributes<HTMLDivElement> {
	severity?: "critical" | "warning" | "good";
	title: string;
	children?: ReactNode;
}

export const AnalysisCard = forwardRef<HTMLDivElement, AnalysisCardProps>(
	({ className, severity = "critical", title, children, ...props }, ref) => {
		return (
			<div ref={ref} className={analysisCardVariants({ className })} {...props}>
				<div className="flex items-center gap-2">
					<span className={dotVariants({ severity })} />
					<span className={labelVariants({ severity })}>{severity}</span>
				</div>
				<p className="font-mono text-[13px] text-text-primary">{title}</p>
				{children && (
					<p className="font-mono text-xs text-text-secondary leading-relaxed">
						{children}
					</p>
				)}
			</div>
		);
	},
);

AnalysisCard.displayName = "AnalysisCard";
