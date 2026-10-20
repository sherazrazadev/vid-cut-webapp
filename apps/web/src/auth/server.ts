import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Redis } from "@upstash/redis";
import { getDb } from "@/db";
import { features } from "@/env/features";
import { webEnv } from "@/env/web";

function createAuth() {
	if (!features.auth) {
		throw new Error("Auth is disabled. Set AUTH_ENABLED=true and DATABASE_URL.");
	}
	if (!webEnv.BETTER_AUTH_SECRET) {
		throw new Error("BETTER_AUTH_SECRET is required when AUTH_ENABLED=true.");
	}
	if (!features.database) {
		throw new Error("DATABASE_URL is required when AUTH_ENABLED=true.");
	}

	const db = getDb();

	const authConfig: Parameters<typeof betterAuth>[0] = {
		database: drizzleAdapter(db, {
			provider: "pg",
			usePlural: true,
		}),
		secret: webEnv.BETTER_AUTH_SECRET,
		user: {
			deleteUser: {
				enabled: true,
			},
		},
		emailAndPassword: {
			enabled: true,
		},
		baseURL: webEnv.NEXT_PUBLIC_SITE_URL,
		appName: "vid-cut",
		trustedOrigins: [webEnv.NEXT_PUBLIC_SITE_URL],
	};

	if (features.redis) {
		const redis = new Redis({
			url: webEnv.UPSTASH_REDIS_REST_URL!,
			token: webEnv.UPSTASH_REDIS_REST_TOKEN!,
		});
		authConfig.rateLimit = {
			storage: "secondary-storage",
			customStorage: {
				get: async (key) => {
					const value = await redis.get(key);
					return value as RateLimit | undefined;
				},
				set: async (key, value) => {
					await redis.set(key, value);
				},
			},
		};
	}

	return betterAuth(authConfig);
}

let _auth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
	if (!_auth) {
		_auth = createAuth();
	}
	return _auth;
}

export type Auth = ReturnType<typeof betterAuth>;
