"use client";

import { forwardRef, useState } from "react";
import { tv } from "tailwind-variants";

const editorVariants = tv({
	base: "border border-border-primary rounded overflow-hidden w-full max-w-[780px]",
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

const lineNumbersVariants = tv({
	base: "flex flex-col items-end gap-1 pr-3 pl-4 py-3 border-r border-border-primary bg-bg-surface font-mono text-xs text-text-tertiary select-none",
});

const codeAreaVariants = tv({
	base: "flex-1 p-4 bg-bg-input font-mono text-sm text-text-secondary overflow-auto resize-none focus:outline-none",
});

export interface CodeEditorProps {
	filename?: string;
	lineCount?: number;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
	(
		{ className, value: controlledValue, onChange, filename, lineCount = 16 },
		ref,
	) => {
		const [internalValue, setInternalValue] = useState("");
		const isControlled = controlledValue !== undefined;
		const code = isControlled ? controlledValue : internalValue;

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = e.target.value;
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(newValue);
		};

		const hasCode = code.length > 0;
		const displayLines = hasCode ? code.split("\n").length : lineCount;
		const lineNumbers = Array.from({ length: displayLines }, (_, i) => i + 1);

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
					{filename && (
						<>
							<div className="flex-1" />
							<span className="font-mono text-xs text-text-tertiary">
								{filename}
							</span>
						</>
					)}
				</div>
				<div className="flex" style={{ height: 360 }}>
					<div className={lineNumbersVariants()}>
						{lineNumbers.map((num) => (
							<span key={num} className="leading-6">
								{num}
							</span>
						))}
					</div>
					<textarea
						className={codeAreaVariants()}
						value={code}
						onChange={handleChange}
						placeholder="paste your code here..."
						spellCheck={false}
						style={{ height: "100%" }}
					/>
				</div>
			</div>
		);
	},
);

CodeEditor.displayName = "CodeEditor";
