import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
	process.env.DATABASE_URL ||
	"postgresql://devroast:devroast@localhost:5432/devroast";

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getClient() {
	if (!client) {
		client = postgres(connectionString, { max: 1 });
	}
	return client;
}

function getDb() {
	if (!dbInstance) {
		dbInstance = drizzle(getClient(), { schema });
	}
	return dbInstance;
}

export const db = {
	get insert() {
		return getDb().insert;
	},
	get select() {
		return getDb().select;
	},
	get update() {
		return getDb().update;
	},
	get delete() {
		return getDb().delete;
	},
};

export async function rawQuery<T>(
	sql: string,
	params: unknown[] = [],
): Promise<T[]> {
	try {
		const c = getClient();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = await (c as any).unsafe(sql, ...params);
		return result as T[];
	} catch (err) {
		console.error("rawQuery error:", err);
		return [];
	}
}
