import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { ScoreRing } from "@/components/ui/score-ring";
import { ShareButton } from "@/components/ui/share-button";
import { getSubmissionWithRoast } from "@/db/queries";

interface RoastResultPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: RoastResultPageProps): Promise<Metadata> {
	const { id } = await params;
	const data = await getSubmissionWithRoast(id);

	if (!data) {
		return { title: "Roast Not Found" };
	}

	const score = data.score ? Number(data.score) : 5;
	const feedback = data.feedback ? JSON.parse(data.feedback) : {};

	return {
		title: `devroast | score: ${score.toFixed(1)}/10`,
		description: feedback.quote || "Your code has been roasted!",
		openGraph: {
			title: `devroast | score: ${score.toFixed(1)}/10`,
			description: feedback.quote || "Your code has been roasted!",
			images: [`/results/${id}/opengraph`],
		},
		twitter: {
			card: "summary_large_image",
			title: `devroast | score: ${score.toFixed(1)}/10`,
			description: feedback.quote || "Your code has been roasted!",
			images: [`/results/${id}/opengraph`],
		},
	};
}

const languageExtensions: Record<string, string> = {
	javascript: "js",
	typescript: "ts",
	python: "py",
	rust: "rs",
	go: "go",
	java: "java",
};

interface Issue {
	severity: "critical" | "warning" | "good";
	title: string;
	description: string;
}

export default async function RoastResultPage({
	params,
}: RoastResultPageProps) {
	const { id } = await params;

	const data = await getSubmissionWithRoast(id);

	if (!data || !data.code) {
		notFound();
	}

	let feedback = null;
	if (data.feedback) {
		try {
			feedback = JSON.parse(data.feedback);
		} catch {
			feedback = { quote: data.feedback, verdict: "analyzed" };
		}
	}
	const score = data.score ? Number(data.score) : 5;

	const issues: Issue[] = feedback?.issues || [
		{
			severity: "warning",
			title: "Code analysis completed",
			description: "Review the details below for more information.",
		},
	];

	const codeHtml = await codeToHtml(data.code, {
		lang: data.language,
		theme: "dracula",
	});

	const suggestedFix =
		feedback?.suggestedFix || "Refactor with best practices.";
	let fixedCodeHtml: string | null = null;

	try {
		const cleanCode = suggestedFix
			.replace(/^```\w*\n?/gm, "")
			.replace(/\n?```$/g, "")
			.trim();
		if (cleanCode && cleanCode.length > 0) {
			fixedCodeHtml = await codeToHtml(cleanCode, {
				lang: data.language,
				theme: "dracula",
			});
		}
	} catch {
		fixedCodeHtml = null;
	}

	return (
		<main className="flex flex-col items-center w-full">
			<div className="w-full max-w-[1280px] px-20 flex flex-col gap-10 py-10">
				<div className="flex items-center gap-12">
					<ScoreRing value={score} size={180} strokeWidth={4} />

					<div className="flex flex-col gap-4 flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="text-accent-red font-mono text-sm font-medium">
								verdict: {feedback?.verdict || "analyzed"}
							</span>
						</div>

						<p
							className="text-text-primary text-xl leading-relaxed"
							style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
						>
							&quot;{feedback?.quote || "Your code has been reviewed."}&quot;
						</p>

						<div className="flex items-center gap-4 text-text-tertiary font-mono text-xs">
							<span>lang: {data.language}</span>
							<span>·</span>
							<span>{data.code.split("\n").length} lines</span>
						</div>

						<ShareButton
							url={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/results/${id}`}
						/>
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							{"//"}
						</span>
						<span className="text-text-primary font-mono text-sm font-bold">
							your_submission
						</span>
					</div>

					<div className="flex min-h-[180px] border border-border-primary rounded overflow-hidden bg-bg-input">
						<div className="flex flex-col gap-1 px-[14px] py-3 bg-bg-surface border-r border-border-primary min-w-[40px] flex-shrink-0">
							{data.code.split("\n").map((_, idx) => (
								<span
									key={`orig-line-${idx}`}
									className="font-mono text-xs text-text-tertiary text-right leading-[22px]"
								>
									{idx + 1}
								</span>
							))}
						</div>
						<div
							className="flex-1 min-w-0 overflow-hidden [&_pre]:!bg-transparent"
							dangerouslySetInnerHTML={{ __html: codeHtml }}
						/>
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							{"//"}
						</span>
						<span className="text-text-primary font-mono text-sm font-bold">
							detailed_analysis
						</span>
					</div>

					<div className="grid grid-cols-2 gap-5">
						{issues.map((issue, idx) => (
							<AnalysisCard
								key={`issue-${idx}`}
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
							{"//"}
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
								improved_code.
								{languageExtensions[data.language] || data.language}
							</span>
						</div>
						<div className="bg-bg-input overflow-auto">
							{fixedCodeHtml ? (
								<div
									className="[&_pre]:!bg-transparent [&_pre]:p-4"
									dangerouslySetInnerHTML={{ __html: fixedCodeHtml }}
								/>
							) : (
								<div className="p-4 font-mono text-sm text-accent-green">
									{suggestedFix}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
