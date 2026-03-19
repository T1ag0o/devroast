"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const leaderboardData = [
	{
		rank: 1,
		score: 2.1,
		code: "function calculateTotal(items) {",
		language: "javascript",
	},
	{
		rank: 2,
		score: 3.5,
		code: "const sum = (arr) => arr.reduce(",
		language: "javascript",
	},
	{
		rank: 3,
		score: 4.2,
		code: "let result = 0; for...",
		language: "javascript",
	},
];

export default function HomePage() {
	const [code, setCode] = useState("");
	const MAX_LENGTH = 2000;
	const isOverLimit = code.length > MAX_LENGTH;

	return (
		<main className="flex flex-col items-center w-full">
			<div className="w-full max-w-[1440px] px-10 flex flex-col items-center gap-8 pt-20">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="font-mono text-4xl font-bold text-text-primary">
						<span className="text-accent-green">$</span> paste your code. get
						roasted.
					</h1>
					<p className="font-mono text-sm text-text-secondary">
						{/* drop your code below and we'll rate it — brutally honest or full roast mode */}
					</p>
				</div>

				<CodeEditor value={code} onChange={setCode} maxLength={MAX_LENGTH} />

				<div className="w-full max-w-[780px] flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Toggle defaultChecked={true} label="roast mode" />
						<span className="font-mono text-xs text-text-tertiary">
							{/* maximum sarcasm enabled */}
						</span>
					</div>
					<Button variant="default" disabled={isOverLimit}>
						$ roast_my_code
					</Button>
				</div>

				<div className="flex items-center gap-6 text-text-tertiary font-mono text-xs">
					<span>2,847 codes roasted</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>

				<div className="w-full max-w-[960px] flex flex-col gap-6 pt-20 pb-20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-accent-green font-mono text-sm font-bold">
								{"//"}
							</span>
							<span className="text-text-primary font-mono text-sm font-bold">
								shame_leaderboard
							</span>
						</div>
						<Button variant="outline" size="sm">
							$ view_all &gt;&gt;
						</Button>
					</div>

					<p className="font-mono text-xs text-text-tertiary">
						{/* the worst code on the internet, ranked by shame */}
					</p>

					<div className="border border-border-primary rounded overflow-hidden">
						<div className="flex items-center h-10 px-5 bg-bg-surface border-b border-border-primary">
							<span className="font-mono text-xs text-text-tertiary w-[50px]">
								rank
							</span>
							<span className="font-mono text-xs text-text-tertiary w-[70px]">
								score
							</span>
							<span className="font-mono text-xs text-text-tertiary flex-1">
								code
							</span>
							<span className="font-mono text-xs text-text-tertiary w-[100px] text-right">
								lang
							</span>
						</div>
						{leaderboardData.map((item) => (
							<TableRow
								key={item.rank}
								rank={item.rank}
								score={item.score}
								code={item.code}
								language={item.language}
							/>
						))}
					</div>

					<div className="text-center pt-4">
						<span className="font-mono text-xs text-text-tertiary">
							showing top 3 of 2,847 ·{" "}
							<a
								href="/leaderboard"
								className="text-text-secondary hover:underline"
							>
								view full leaderboard &gt;&gt;
							</a>
						</span>
					</div>
				</div>
			</div>
		</main>
	);
}
