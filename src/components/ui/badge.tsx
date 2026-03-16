import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	base: "inline-flex items-center gap-2 font-mono text-xs font-normal",
	variants: {
		variant: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
			verdict: "text-accent-red",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

const dotVariants = tv({
	base: "h-2 w-2 rounded-full",
	variants: {
		variant: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
			verdict: "bg-accent-red",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	dot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant, dot = true, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={badgeVariants({ variant, className })}
				{...props}
			>
				{dot && <span className={dotVariants({ variant })} />}
				{children}
			</div>
		);
	},
);

Badge.displayName = "Badge";
