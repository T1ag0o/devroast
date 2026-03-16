import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const tableRowVariants = tv({
	base: "flex items-center px-5 py-4 border-b border-border-primary w-full",
});

const rankVariants = tv({
	base: "font-mono text-sm text-text-tertiary w-10",
});

const scoreVariants = tv({
	base: "font-mono text-sm font-bold w-[60px]",
	variants: {
		score: {
			low: "text-accent-red",
			medium: "text-accent-amber",
			high: "text-accent-green",
		},
	},
	defaultVariants: {
		score: "medium",
	},
});

const codeCellVariants = tv({
	base: "font-mono text-xs text-text-secondary flex-1 truncate",
});

const langCellVariants = tv({
	base: "font-mono text-xs text-text-tertiary w-[100px] text-right",
});

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
	rank?: number;
	score?: number;
	code?: string;
	language?: string;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
	(
		{ className, rank = 0, score = 0, code = "", language = "", ...props },
		ref,
	) => {
		const getScoreVariant = () => {
			if (score >= 8) return "high";
			if (score >= 5) return "medium";
			return "low";
		};

		return (
			<div ref={ref} className={tableRowVariants({ className })} {...props}>
				<span className={rankVariants()}>#{rank}</span>
				<span className={scoreVariants({ score: getScoreVariant() })}>
					{score.toFixed(1)}
				</span>
				<span className={codeCellVariants()}>{code}</span>
				<span className={langCellVariants()}>{language}</span>
			</div>
		);
	},
);

TableRow.displayName = "TableRow";
