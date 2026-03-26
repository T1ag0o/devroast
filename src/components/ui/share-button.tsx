"use client";

import { useState } from "react";
import { tv } from "tailwind-variants";

interface ShareButtonProps {
	url: string;
}

const buttonVariants = tv({
	base: "flex items-center gap-2 px-4 py-2 border font-mono text-xs transition-all w-fit",
	variants: {
		variant: {
			default:
				"border-border-primary text-text-primary hover:border-text-tertiary",
			success: "border-accent-green text-accent-green",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export function ShareButton({ url }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			window.open(
				`https://twitter.com/intent/tweet?text=Check%20my%20code%20roast&url=${encodeURIComponent(url)}`,
				"_blank",
			);
		}
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className={buttonVariants({ variant: copied ? "success" : "default" })}
		>
			<span>$</span>
			<span>{copied ? "copied!" : "share_roast"}</span>
		</button>
	);
}
