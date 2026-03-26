import "server-only";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createServerContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createServerContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
	caller,
	getQueryClient,
);

export async function getMetrics() {
	return caller.metrics.getStats();
}

export async function getLeaderboardTop(limit = 3) {
	return caller.leaderboard.getTop({ limit });
}
