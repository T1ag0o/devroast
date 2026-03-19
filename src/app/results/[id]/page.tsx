import type { Metadata } from "next";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata: Metadata = {
	title: "roast_result | devroast",
	description: "Your code has been roasted",
};

interface RoastResultPageProps {
	params: Promise<{ id: string }>;
}

const languageExtensions: Record<string, string> = {
	javascript: "js",
	typescript: "ts",
	python: "py",
	rust: "rs",
	go: "go",
	java: "java",
};

const roastSummary = {
	score: 3.5,
	totalIssues: 4,
	critical: 2,
	warnings: 1,
	suggestions: 1,
	verdict: "needs_serious_help",
	roastQuote:
		"this code looks like it was written during a power outage... in 2005.",
};

const submittedCode = {
	code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
	language: "javascript",
	lines: 6,
};

const issues = [
	{
		severity: "critical" as const,
		title: "Using for loop instead of reduce",
		description:
			"Who writes a for loop in 2024? JavaScript has reduce(), map(), filter() and more. This is basically using a spoon to eat soup.",
	},
	{
		severity: "critical" as const,
		title: "No type safety",
		description:
			"AnyType™️ strikes again. What happens if items is null? undefined? A string? Your code hopes for the best.",
	},
	{
		severity: "warning" as const,
		title: "Verbose variable naming",
		description:
			"'total' is fine, but you don't need 'let' if you're not mutating it. Also, i? Really? i what?",
	},
	{
		severity: "good" as const,
		title: "Function has a clear purpose",
		description: "At least it does one thing. Small mercies.",
	},
];

const diffLines = [
	{
		type: "removed" as const,
		prefix: "-" as const,
		content: "function calculateTotal(items) {",
	},
	{
		type: "removed" as const,
		prefix: "-" as const,
		content: "  let total = 0;",
	},
	{
		type: "removed" as const,
		prefix: "-" as const,
		content: "  for (let i = 0; i < items.length; i++) {",
	},
	{
		type: "removed" as const,
		prefix: "-" as const,
		content: "    total = total + items[i].price;",
	},
	{ type: "removed" as const, prefix: "-" as const, content: "  }" },
	{
		type: "removed" as const,
		prefix: "-" as const,
		content: "  return total;",
	},
	{ type: "removed" as const, prefix: "-" as const, content: "}" },
	{ type: "context" as const, prefix: " " as const, content: "" },
	{
		type: "added" as const,
		prefix: "+" as const,
		content: "const calculateTotal = (items: { price: number }[]): number =>",
	},
	{
		type: "added" as const,
		prefix: "+" as const,
		content: "  items.reduce((sum, item) => sum + item.price, 0);",
	},
];

export default async function RoastResultPage({
	params,
}: RoastResultPageProps) {
	void (await params);

	return (
		<main className="flex flex-col items-center w-full">
			<div className="w-full max-w-[1280px] px-20 flex flex-col gap-10 py-10">
				<div className="flex items-center gap-12">
					<ScoreRing value={roastSummary.score} size={180} strokeWidth={4} />

					<div className="flex flex-col gap-4 flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="text-accent-red font-mono text-sm font-medium">
								verdict: {roastSummary.verdict}
							</span>
						</div>

						<p
							className="text-text-primary text-xl leading-relaxed"
							style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
						>
							&quot;{roastSummary.roastQuote}&quot;
						</p>

						<div className="flex items-center gap-4 text-text-tertiary font-mono text-xs">
							<span>lang: {submittedCode.language}</span>
							<span>·</span>
							<span>{submittedCode.lines} lines</span>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<button className="flex items-center gap-2 px-4 py-2 border border-border-primary font-mono text-xs text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-colors">
								<span>$</span>
								<span>share</span>
							</button>
						</div>
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							//
						</span>
						<span className="text-text-primary font-mono text-sm font-bold">
							your_submission
						</span>
					</div>

					<div className="flex min-h-[180px] border border-border-primary rounded overflow-hidden bg-bg-input">
						<div className="flex flex-col gap-1 px-[14px] py-3 bg-bg-surface border-r border-border-primary min-w-[40px] flex-shrink-0">
							{submittedCode.code.split("\n").map((_, idx) => (
								<span
									key={idx}
									className="font-mono text-xs text-text-tertiary text-right leading-[22px]"
								>
									{idx + 1}
								</span>
							))}
						</div>
						<div className="flex-1 min-w-0 overflow-hidden">
							<CodeBlock
								code={submittedCode.code}
								language={submittedCode.language}
							/>
						</div>
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							//
						</span>
						<span className="text-text-primary font-mono text-sm font-bold">
							detailed_analysis
						</span>
					</div>

					<div className="grid grid-cols-2 gap-5">
						{issues.map((issue, idx) => (
							<AnalysisCard
								key={idx}
								severity={issue.severity}
								title={issue.title}
								className="flex-1 min-w-0"
							>
								{issue.description}
							</AnalysisCard>
						))}
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							//
						</span>
						<span className="text-text-primary font-mono text-sm font-bold">
							suggested_fix
						</span>
					</div>

					<div className="flex flex-col border border-border-primary rounded overflow-hidden">
						<div className="flex items-center gap-3 h-10 px-4 bg-bg-surface border-b border-border-primary">
							<span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
							<span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
							<span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
							<span className="font-mono text-xs text-text-secondary ml-2">
								your_code.
								{languageExtensions[submittedCode.language] ||
									submittedCode.language}{" "}
								→ improved_code.
								{languageExtensions[submittedCode.language] ||
									submittedCode.language}
							</span>
						</div>
						<div className="bg-bg-input overflow-auto">
							{diffLines.map((line, idx) => (
								<DiffLine key={idx} type={line.type} prefix={line.prefix}>
									{line.content}
								</DiffLine>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
