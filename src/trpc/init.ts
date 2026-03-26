import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

interface TRPCContext {
	headers?: Headers;
}

export const createTRPCContext = async (
	opts: FetchCreateContextFnOptions,
): Promise<TRPCContext> => {
	return {
		headers: opts.req.headers,
	};
};

export const createServerContext = async (): Promise<TRPCContext> => {
	return {};
};

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
