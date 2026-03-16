import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
	base: "inline-flex items-center gap-2 font-mono text-sm px-4 py-2 w-full",
	variants: {
		type: {
			removed: "bg-[#1A0A0A] text-text-secondary",
			added: "bg-[#0A1A0F] text-text-primary",
			context: "bg-transparent text-text-secondary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

const prefixVariants = tv({
	base: "font-mono text-sm w-4 text-right",
	variants: {
		type: {
			removed: "text-accent-red",
			added: "text-accent-green",
			context: "text-text-tertiary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineVariants> {
	prefix?: "-" | "+" | " ";
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
	({ className, type, prefix = " ", children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={diffLineVariants({ type, className })}
				{...props}
			>
				<span className={prefixVariants({ type })}>{prefix}</span>
				<span>{children}</span>
			</div>
		);
	},
);

DiffLine.displayName = "DiffLine";
