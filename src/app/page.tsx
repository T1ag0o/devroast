import { MetricsDisplay } from "@/components/metrics-display";
import { HomeClient } from "./home-client";

export default function HomePage() {
	return (
		<main className="flex flex-col items-center w-full">
			<div className="w-full max-w-[1440px] px-10 flex flex-col items-center gap-8 pt-20">
				<HomeClient />

				<MetricsDisplay />

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
						<span className="text-text-secondary font-mono text-xs hover:text-text-primary cursor-pointer">
							$ view_all &gt;&gt;
						</span>
					</div>

					<p className="font-mono text-xs text-text-tertiary">
						{/* the worst code on the internet, ranked by shame */}
					</p>

					<div className="border border-border-primary rounded overflow-hidden bg-bg-surface">
						<div className="flex items-center h-10 px-5 border-b border-border-primary">
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
					</div>

					<div className="text-center pt-4">
						<span className="font-mono text-xs text-text-tertiary">
							showing top 3 ·{" "}
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
