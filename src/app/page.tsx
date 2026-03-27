import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardFooter } from "@/components/leaderboard-footer";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";
import { MetricsDisplay } from "@/components/metrics-display";
import { HomeClient } from "./home-client";

export const revalidate = 3600;

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
						<Link
							href="/leaderboard"
							className="flex items-center gap-1 px-3 py-1.5 border border-border-primary font-mono text-xs text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-colors"
						>
							$ view_all &gt;&gt;
						</Link>
					</div>

					<p className="font-mono text-xs text-text-tertiary">
						<span className="font-bold">//</span> the worst code on the
						internet, ranked by shame
					</p>

					<Suspense fallback={<LeaderboardSkeleton />}>
						<LeaderboardPreview />
					</Suspense>

					<LeaderboardFooter />
				</div>
			</div>
		</main>
	);
}
