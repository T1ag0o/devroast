"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import { AnimatedNumber } from "./animated-number";

export function MetricsDisplay() {
	const [mounted, setMounted] = useState(false);
	const { data } = trpc.metrics.getStats.useQuery(undefined, {
		enabled: mounted,
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	const totalCodes = data?.totalCodes ?? 0;
	const avgScore = data?.avgScore ?? 0;

	return (
		<div className="flex items-center gap-6 text-text-tertiary font-mono text-xs">
			<span>
				<AnimatedNumber value={totalCodes} />
				{",000 codes roasted"}
			</span>
			<span>·</span>
			<span>
				avg score: <AnimatedNumber value={avgScore} precision={1} />
				/10
			</span>
		</div>
	);
}
