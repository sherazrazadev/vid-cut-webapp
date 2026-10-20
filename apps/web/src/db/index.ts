import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { webEnv } from "@/env/web";
import { features } from "@/env/features";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | null = null;

export function isDatabaseConfigured(): boolean {
	return features.database;
}

export function getDb(): Db {
	if (!features.database || !webEnv.DATABASE_URL) {
		throw new Error(
			"Database is not configured. Set DATABASE_URL or disable features that need Postgres.",
		);
	}

	if (!_db) {
		const client = postgres(webEnv.DATABASE_URL);
		_db = drizzle(client, { schema });
	}

	return _db;
}

/** Lazy accessor — does not connect at import time. */
export const db = new Proxy({} as Db, {
	get(_target, prop, receiver) {
		const instance = getDb();
		const value = Reflect.get(instance, prop, receiver);
		return typeof value === "function" ? value.bind(instance) : value;
	},
});

export * from "./schema";
