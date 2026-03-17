"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";
import { LANGUAGES } from "@/lib/languages";

const selectorVariants = tv({
	base: "relative flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-primary rounded font-mono text-xs text-text-secondary cursor-pointer hover:border-accent-orange focus:outline-none focus-within:border-accent-orange transition-colors",
});

const dropdownVariants = tv({
	base: "absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-primary rounded shadow-lg max-h-60 overflow-auto z-50",
});

export interface LanguageSelectorProps {
	value: string;
	onChange: (language: string) => void;
	className?: string;
	autoDetected?: boolean;
}

export const LanguageSelector = forwardRef<
	HTMLButtonElement,
	LanguageSelectorProps
>(({ className, value, onChange, autoDetected }, ref) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentLanguage = LANGUAGES.find(
		(lang) =>
			lang.id === value.toLowerCase() ||
			lang.aliases?.includes(value.toLowerCase()),
	);
	const displayName = currentLanguage?.name || value || "Plain Text";

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (langId: string) => {
		onChange(langId);
		setIsOpen(false);
	};

	return (
		<div ref={containerRef} className="relative">
			<button
				ref={ref}
				type="button"
				className={selectorVariants({ className })}
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<svg
					className="w-3 h-3 text-text-tertiary pointer-events-none"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
				<span className="pointer-events-none truncate">
					{autoDetected && value ? `${displayName} (auto)` : displayName}
				</span>
			</button>
			{isOpen && (
				<div className={dropdownVariants()}>
					{LANGUAGES.map((lang) => (
						<button
							key={lang.id}
							type="button"
							className="w-full px-3 py-2 text-left hover:bg-bg-input cursor-pointer font-mono text-xs text-text-secondary hover:text-text-primary"
							onClick={() => handleSelect(lang.id)}
						>
							{lang.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
});

LanguageSelector.displayName = "LanguageSelector";
