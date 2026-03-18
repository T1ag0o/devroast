import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "shame_leaderboard | devroast",
	description: "The most roasted code on the internet",
};

const leaderboardData = [
	{
		rank: 1,
		score: 2.1,
		code: "function calculateTotal(items) {\n  return items.reduce((acc, item) => acc + item.price, 0);\n}",
		language: "javascript",
		lines: 2,
	},
	{
		rank: 2,
		score: 3.5,
		code: "const sum = (arr) => arr.reduce((a, b) => a + b, 0);",
		language: "javascript",
		lines: 1,
	},
	{
		rank: 3,
		score: 4.2,
		code: "let result = 0;\nfor (let i = 0; i < arr.length; i++) {\n  result += arr[i];\n}",
		language: "javascript",
		lines: 3,
	},
	{
		rank: 4,
		score: 5.0,
		code: "def get_user(id): return db.query('SELECT * FROM users WHERE id = ' + id)",
		language: "python",
		lines: 1,
	},
	{
		rank: 5,
		score: 5.8,
		code: "const data = JSON.parse(JSON.stringify(obj));",
		language: "javascript",
		lines: 1,
	},
	{
		rank: 6,
		score: 6.1,
		code: "if (condition) {\n  return true;\n} else {\n  return false;\n}",
		language: "javascript",
		lines: 4,
	},
	{
		rank: 7,
		score: 6.5,
		code: "try { } catch (e) { }",
		language: "javascript",
		lines: 2,
	},
	{
		rank: 8,
		score: 7.0,
		code: "var x = document.getElementById('myDiv').style.display;",
		language: "javascript",
		lines: 1,
	},
	{
		rank: 9,
		score: 7.2,
		code: "function doStuff() {\n  // TODO: implement\n}",
		language: "javascript",
		lines: 2,
	},
	{
		rank: 10,
		score: 7.8,
		code: "Array.from({ length: 10 }).map((_, i) => i)",
		language: "javascript",
		lines: 1,
	},
];

export default function LeaderboardPage() {
	return (
		<main className="flex flex-col items-center w-full">
			<div className="w-full max-w-[1440px] px-10 flex flex-col gap-10 pt-20 pb-20">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="text-accent-green font-mono text-[32px] font-bold">
							$
						</span>
						<h1 className="font-mono text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-text-secondary">
						{/* the most roasted code on the internet */}
					</p>
					<div className="flex items-center gap-2 text-text-tertiary font-mono text-xs">
						<span>2,847 submissions</span>
						<span>·</span>
						<span>avg score: 4.2/10</span>
					</div>
				</div>

				<div className="flex flex-col gap-5">
					{leaderboardData.map((item) => (
						<div
							key={item.rank}
							className="flex flex-col border border-border-primary rounded overflow-hidden"
						>
							<div className="flex items-center justify-between h-12 px-5 bg-bg-surface border-b border-border-primary">
								<div className="flex items-center gap-4">
									<span className="font-mono text-sm text-text-tertiary w-[30px]">
										#{item.rank}
									</span>
									<span className="font-mono text-sm font-bold text-text-primary w-[50px]">
										{item.score}/10
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs text-text-secondary">
										{item.language}
									</span>
									<span className="font-mono text-xs text-text-tertiary">
										{item.lines} lines
									</span>
								</div>
							</div>
							<div className="flex bg-bg-input h-[120px]">
								<div className="flex flex-col gap-1 px-[14px] py-3 bg-bg-surface border-r border-border-primary min-w-[40px]">
									{item.code.split("\n").map((_line, idx) => (
										<span
											key={`${item.rank}-${idx}`}
											className="font-mono text-xs text-text-tertiary text-right leading-[22px]"
										>
											{idx + 1}
										</span>
									))}
								</div>
								<pre className="flex-1 overflow-hidden px-4 py-3">
									<code className="font-mono text-xs text-text-primary leading-[22px] whitespace-pre">
										{item.code}
									</code>
								</pre>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-center">
					<Button variant="outline">$ load_more</Button>
				</div>
			</div>
		</main>
	);
}
