import { getMetrics } from "@/db/queries";
import { publicProcedure, router } from "../init";

export const metricsRouter = router({
	getStats: publicProcedure.query(async () => {
		try {
			const { getMetrics } = await import("@/db/queries");
			const metrics = await getMetrics();
			if (!metrics || metrics.length === 0) {
				return { totalCodes: 0, avgScore: 0 };
			}
			return {
				totalCodes: Number(metrics[0].total_codes),
				avgScore: Number(metrics[0].avg_score),
			};
		} catch {
			return { totalCodes: 0, avgScore: 0 };
		}
	}),
});
