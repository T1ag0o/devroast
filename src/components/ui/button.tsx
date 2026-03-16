import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center gap-2 font-mono text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-accent-green text-[#0A0A0A] hover:bg-accent-green/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline:
				"border border-border-primary bg-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary",
			ghost: "hover:bg-bg-surface hover:text-text-primary",
			link: "text-text-secondary underline-offset-4 hover:underline",
		},
		size: {
			default: "px-6 py-2.5",
			sm: "px-3 py-1.5 text-xs",
			lg: "px-8 py-3 text-sm",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, children, ...props }, ref) => {
		return (
			<button
				className={buttonVariants({ variant, size, className })}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";
