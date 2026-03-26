import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
	process.env.DATABASE_URL ||
	"postgresql://devroast:devroast@localhost:5432/devroast";

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

export { db };

export async function rawQuery<T>(
	sql: string,
	params: unknown[] = [],
): Promise<T[]> {
	try {
		const result = await client.unsafe(sql, params as never);
		return result as unknown as T[];
	} catch (err) {
		console.error("rawQuery error:", err);
		return [];
	}
}
