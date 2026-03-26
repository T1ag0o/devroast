"use client";

import hljs from "highlight.js";
import {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { tv } from "tailwind-variants";
import "highlight.js/styles/github-dark.css";
import { LanguageSelector } from "./language-selector";

const editorVariants = tv({
	base: "border border-border-primary rounded overflow-hidden w-full max-w-[780px] font-mono",
});

const windowHeaderVariants = tv({
	base: "flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface",
});

const windowDotVariants = tv({
	base: "rounded-full",
	variants: {
		color: {
			red: "bg-accent-red",
			yellow: "bg-accent-amber",
			green: "bg-accent-green",
		},
	},
});

const codeContainerVariants = tv({
	base: "relative bg-bg-input overflow-hidden",
});

const highlightedCodeStyles = tv({
	base: "absolute inset-0 p-4 font-mono text-sm overflow-auto pointer-events-none whitespace-pre-wrap break-words text-text-secondary",
});

const textareaStyles = tv({
	base: "absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-transparent caret-white resize-none focus:outline-none whitespace-pre-wrap break-words",
});

const indicatorVariants = tv({
	base: "absolute bottom-2 right-3 font-mono text-xs select-none z-10",
	variants: {
		state: {
			normal: "text-text-tertiary",
			warning: "text-accent-amber",
			error: "text-accent-red",
		},
	},
});

export interface CodeEditorProps {
	filename?: string;
	lineCount?: number;
	value?: string;
	onChange?: (value: string) => void;
	onLanguageChange?: (language: string) => void;
	maxLength?: number;
	className?: string;
}

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
	(
		{
			className,
			value: controlledValue,
			onChange,
			onLanguageChange,
			filename,
			lineCount = 16,
			maxLength = 2000,
		},
		ref,
	) => {
		const [internalValue, setInternalValue] = useState("");
		const [language, setLanguage] = useState("plaintext");
		const [autoDetected, setAutoDetected] = useState(true);
		const [highlightedHtml, setHighlightedHtml] = useState("");
		const textareaRef = useRef<HTMLTextAreaElement>(null);
		const highlightRef = useRef<HTMLDivElement>(null);
		const isControlled = controlledValue !== undefined;
		const code = isControlled ? controlledValue : internalValue;

		const isOverLimit = code.length > maxLength;
		const isNearLimit = code.length > maxLength * 0.9;
		const indicatorState = isOverLimit
			? "error"
			: isNearLimit
				? "warning"
				: "normal";

		const debounceRef = useRef<NodeJS.Timeout | null>(null);

		const detectLanguage = useCallback((codeToDetect: string) => {
			if (!codeToDetect || codeToDetect.trim().length < 10) {
				return;
			}

			// Manual detection based on keywords
			const jsPatterns = [
				/\bfunction\s+\w+\s*\(/,
				/\bconst\s+\w+\s*=/,
				/\blet\s+\w+\s*=/,
				/\bvar\s+\w+\s*=/,
				/\b=>\s*{/,
				/\bconsole\.log\(/,
				/\breturn\s+/,
				/\basync\s+/,
				/\bawait\s+/,
				/\bexport\s+/,
				/\bimport\s+.*from/,
				/\bclass\s+\w+/,
			];

			const pythonPatterns = [
				/\bdef\s+\w+\s*\(/,
				/\bimport\s+\w+/,
				/\bfrom\s+\w+\s+import/,
				/\bprint\s*\(/,
				/\bself\./,
				/\b__init__\s*\(/,
				/\belif\s+/,
			];

			const rustPatterns = [
				/\bfn\s+\w+\s*\(/,
				/\blet\s+mut\s+/,
				/\bimpl\s+\w+/,
				/\bstruct\s+\w+/,
				/\benum\s+\w+/,
				/\bpub\s+fn/,
				/\buse\s+\w+::/,
			];

			const goPatterns = [
				/\bfunc\s+\w+\s*\(/,
				/\bpackage\s+\w+/,
				/\bimport\s+\(/,
				/\bfmt\./,
				/\bgo\s+func/,
				/\bchan\s+\w+/,
			];

			const javaPatterns = [
				/\bSystem\.out\.println/,
				/\bString\s+\w+\s*=/,
				/\bpublic\s+static\s+void\s+main\s*\(\s*String\[\]/,
				/\bpublic\s+class\s+\w+/,
				/\bprivate\s+\w+\s+\w+\s*[;=]/,
				/\b@Override\s*/,
				/\bnew\s+\w+\s*\([^)]*\)\s*{/,
			];

			const cPatterns = [
				/#include\s*</,
				/\bint\s+main\s*\(/,
				/\bprintf\s*\(/,
				/\bscanf\s*\(/,
				/\bmalloc\s*\(/,
				/\bfree\s*\(/,
				/\bstruct\s+\w+\s*{/,
				/\bvoid\s+\*+/,
				/\breturn\s+0\s*;/,
				/\bchar\s+\w+\s*\[\s*\d+\s*\]/,
			];

			const cppPatterns = [
				/\bstd::/,
				/\bcout\s*<</,
				/\bcin\s*>>/,
				/\bclass\s+\w+\s*{/,
				/\bpublic:\s*$/m,
				/\bprivate:\s*$/m,
				/\bvirtual\s+/,
				/\btemplate\s*</,
				/\bnamespace\s+\w+/,
			];

			const code = codeToDetect;

			// Check C/C++ first (before Java because they share patterns)
			const cScore = cPatterns.filter((p) => p.test(code)).length;
			const cppScore = cppPatterns.filter((p) => p.test(code)).length;
			if (cppScore >= 2) {
				setLanguage("cpp");
				onLanguageChange?.("cpp");
				setAutoDetected(true);
				return;
			}
			if (cScore >= 2) {
				setLanguage("c");
				onLanguageChange?.("c");
				setAutoDetected(true);
				return;
			}

			// Check Java (before C# because they share some patterns)
			const javaScore = javaPatterns.filter((p) => p.test(code)).length;
			if (javaScore >= 1) {
				setLanguage("java");
				onLanguageChange?.("java");
				setAutoDetected(true);
				return;
			}

			// Check JavaScript
			const jsScore = jsPatterns.filter((p) => p.test(code)).length;
			if (jsScore >= 2) {
				setLanguage("javascript");
				onLanguageChange?.("javascript");
				setAutoDetected(true);
				return;
			}

			// Check Python
			const pyScore = pythonPatterns.filter((p) => p.test(code)).length;
			if (pyScore >= 2) {
				setLanguage("python");
				onLanguageChange?.("python");
				setAutoDetected(true);
				return;
			}

			// Check Rust
			const rustScore = rustPatterns.filter((p) => p.test(code)).length;
			if (rustScore >= 2) {
				setLanguage("rust");
				onLanguageChange?.("rust");
				setAutoDetected(true);
				return;
			}

			// Check Go
			const goScore = goPatterns.filter((p) => p.test(code)).length;
			if (goScore >= 2) {
				setLanguage("go");
				onLanguageChange?.("go");
				setAutoDetected(true);
				return;
			}

			// Fallback to highlight.js with higher threshold
			try {
				const result = hljs.highlightAuto(codeToDetect);
				if (result.language && result.relevance >= 10) {
					setLanguage(result.language);
					setAutoDetected(true);
				}
			} catch {
				// Ignore detection errors
			}
		}, []);

		const highlightCode = useCallback(
			(codeToHighlight: string, lang: string) => {
				if (!codeToHighlight) {
					setHighlightedHtml("");
					return;
				}
				try {
					const langToUse = lang.toLowerCase() || "plaintext";
					const result = hljs.highlight(codeToHighlight, {
						language: langToUse,
						ignoreIllegals: true,
					});
					setHighlightedHtml(result.value);
				} catch {
					const escaped = codeToHighlight
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;");
					setHighlightedHtml(escaped);
				}
			},
			[],
		);

		useEffect(() => {
			highlightCode(code, language);
		}, [code, language, highlightCode]);

		useEffect(() => {
			if (code && code.trim().length >= 10 && autoDetected) {
				if (debounceRef.current) {
					clearTimeout(debounceRef.current);
				}
				debounceRef.current = setTimeout(() => {
					detectLanguage(code);
				}, 500);
			}
			return () => {
				if (debounceRef.current) {
					clearTimeout(debounceRef.current);
				}
			};
		}, [code, autoDetected, detectLanguage]);

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = e.target.value;
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(newValue);
		};

		const handleLanguageChange = (newLanguage: string) => {
			setLanguage(newLanguage);
			setAutoDetected(false);
		};

		const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
			if (highlightRef.current) {
				highlightRef.current.scrollTop = e.currentTarget.scrollTop;
				highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
			}
		};

		const hasCode = code.length > 0;
		const displayLines = hasCode ? code.split("\n").length : lineCount;

		const lineNumbers = useMemo(
			() => Array.from({ length: displayLines }, (_, i) => i + 1),
			[displayLines],
		);

		return (
			<div ref={ref} className={editorVariants({ className })}>
				<div className={windowHeaderVariants()}>
					<div className="flex items-center gap-2">
						<span
							className={windowDotVariants({ color: "red" })}
							style={{ width: 12, height: 12 }}
						/>
						<span
							className={windowDotVariants({ color: "yellow" })}
							style={{ width: 12, height: 12 }}
						/>
						<span
							className={windowDotVariants({ color: "green" })}
							style={{ width: 12, height: 12 }}
						/>
					</div>
					<div className="flex-1" />
					<LanguageSelector
						value={language}
						onChange={handleLanguageChange}
						autoDetected={autoDetected}
					/>
					{filename && (
						<span className="font-mono text-xs text-text-tertiary ml-4">
							{filename}
						</span>
					)}
				</div>
				<div className="flex" style={{ height: 360 }}>
					<div className="flex flex-col items-end gap-0 pr-3 pl-4 py-3 border-r border-border-primary bg-bg-surface font-mono text-xs text-text-tertiary select-none min-w-[40px]">
						{lineNumbers.map((num) => (
							<span key={num} className="leading-6 h-6">
								{num}
							</span>
						))}
					</div>
					<div
						className={codeContainerVariants()}
						style={{ height: "100%", flex: 1 }}
					>
						<div
							ref={highlightRef}
							className={highlightedCodeStyles()}
							dangerouslySetInnerHTML={{ __html: highlightedHtml || "&nbsp;" }}
						/>
						<textarea
							ref={textareaRef}
							className={textareaStyles()}
							value={code}
							onChange={handleChange}
							onScroll={handleScroll}
							placeholder="paste your code here..."
							spellCheck={false}
							style={{ height: "100%" }}
						/>
						<span className={indicatorVariants({ state: indicatorState })}>
							{code.length.toLocaleString()} / {maxLength.toLocaleString()}
						</span>
					</div>
				</div>
			</div>
		);
	},
);

CodeEditor.displayName = "CodeEditor";
