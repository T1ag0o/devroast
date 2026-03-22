import Link from "next/link";
import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const navbarVariants = tv({
	base: "flex items-center h-14 px-6 border-b border-border-primary bg-bg-page w-full",
});

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
	logoText?: string;
	links?: { label: string; href?: string }[];
}

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
	({ className, logoText = "devroast", links = [], ...props }, ref) => {
		return (
			<nav ref={ref} className={navbarVariants({ className })} {...props}>
				<Link href="/" className="flex items-center gap-2">
					<span className="text-accent-green font-mono text-xl font-bold">
						&gt;
					</span>
					<span className="text-text-primary font-mono text-lg font-medium">
						{logoText}
					</span>
				</Link>
				<div className="flex-1" />
				{links.map((link) => (
					<a
						key={link.label}
						href={link.href}
						className="text-text-secondary font-mono text-sm hover:text-text-primary transition-colors"
					>
						{link.label}
					</a>
				))}
			</nav>
		);
	},
);

Navbar.displayName = "Navbar";
