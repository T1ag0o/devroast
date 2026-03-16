"use client";

import { forwardRef, useState } from "react";
import { tv } from "tailwind-variants";

const containerVariants = tv({
	base: "inline-flex items-center gap-3 font-mono text-xs transition-colors cursor-pointer select-none",
	variants: {
		checked: {
			true: "text-accent-green",
			false: "text-text-secondary",
		},
	},
	defaultVariants: {
		checked: false,
	},
});

const trackVariants = tv({
	base: "relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	variants: {
		checked: {
			true: "bg-accent-green",
			false: "bg-border-primary",
		},
	},
	defaultVariants: {
		checked: false,
	},
});

const thumbVariants = tv({
	base: "pointer-events-none block h-4 w-4 rounded-full shadow-lg transition-transform duration-200",
	variants: {
		checked: {
			true: "translate-x-[18px] bg-[#0A0A0A]",
			false: "translate-x-0 bg-text-secondary",
		},
	},
	defaultVariants: {
		checked: false,
	},
});

export interface ToggleProps {
	label?: string;
	className?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
	({ className, label, checked, defaultChecked, onCheckedChange }, ref) => {
		const [isChecked, setIsChecked] = useState(defaultChecked ?? false);
		const isControlled = checked !== undefined;
		const checkedValue = isControlled ? checked : isChecked;

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.checked;
			if (!isControlled) {
				setIsChecked(newValue);
			}
			onCheckedChange?.(newValue);
		};

		return (
			<label
				className={containerVariants({ checked: checkedValue, className })}
			>
				<input
					ref={ref}
					type="checkbox"
					className="sr-only"
					{...(isControlled ? { checked: checkedValue } : { defaultChecked })}
					onChange={handleChange}
				/>
				<span className={trackVariants({ checked: checkedValue })}>
					<span className={thumbVariants({ checked: checkedValue })} />
				</span>
				{label && <span>{label}</span>}
			</label>
		);
	},
);

Toggle.displayName = "Toggle";
