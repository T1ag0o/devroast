import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
	process.env.DATABASE_URL ||
	"postgresql://devroast:devroast@localhost:5432/devroast";

const client = postgres(connectionString, { max: 1 });

export const db = drizzle(client, { schema });

export async function rawQuery<T>(
	sql: string,
	params: unknown[] = [],
): Promise<T[]> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result = await (client as any).unsafeExecute(sql, params);
	return result.rows as T[];
}
