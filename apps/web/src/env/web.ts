import { z } from "zod";

/**
 * Minimal env for free/local MVP.
 * Paid/ops services are optional — see `features.ts` and `.env.example`.
 */
const webEnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	ANALYZE: z.string().optional(),
	NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),

	NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
	NEXT_PUBLIC_MARBLE_API_URL: z.string().url().optional(),
	NEXT_PUBLIC_ANALYTICS_ENABLED: z.string().optional(),
	NEXT_PUBLIC_GITHUB_REPO: z.string().optional(),

	AUTH_ENABLED: z.string().optional(),

	DATABASE_URL: z.string().optional(),
	BETTER_AUTH_SECRET: z.string().optional(),
	UPSTASH_REDIS_REST_URL: z.string().optional(),
	UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
	MARBLE_WORKSPACE_KEY: z.string().optional(),
	FREESOUND_CLIENT_ID: z.string().optional(),
	FREESOUND_API_KEY: z.string().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webEnv = webEnvSchema.parse({
	NODE_ENV: process.env.NODE_ENV,
	ANALYZE: process.env.ANALYZE,
	NEXT_RUNTIME: process.env.NEXT_RUNTIME,
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	NEXT_PUBLIC_MARBLE_API_URL: process.env.NEXT_PUBLIC_MARBLE_API_URL,
	NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
	NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO,
	AUTH_ENABLED: process.env.AUTH_ENABLED,
	DATABASE_URL: process.env.DATABASE_URL,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
	UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
	MARBLE_WORKSPACE_KEY: process.env.MARBLE_WORKSPACE_KEY,
	FREESOUND_CLIENT_ID: process.env.FREESOUND_CLIENT_ID,
	FREESOUND_API_KEY: process.env.FREESOUND_API_KEY,
});
