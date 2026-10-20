/**
 * Runtime feature flags for the $0 / local-first path.
 * Server-only secrets must never be read from client components.
 */

function truthy(value: string | undefined): boolean {
	if (!value) return false;
	return value === "1" || value.toLowerCase() === "true";
}

export const features = {
	/** Better Auth + DB adapter. Off by default for MVP. */
	get auth(): boolean {
		return truthy(process.env.AUTH_ENABLED);
	},
	/** Postgres via Drizzle. Required only when auth or feedback persistence is on. */
	get database(): boolean {
		const url = process.env.DATABASE_URL;
		return Boolean(url && (url.startsWith("postgres://") || url.startsWith("postgresql://")));
	},
	/** Upstash / serverless Redis for rate limits. */
	get redis(): boolean {
		return Boolean(
			process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
		);
	},
	/** Freesound stock audio search. */
	get freesound(): boolean {
		return Boolean(process.env.FREESOUND_API_KEY);
	},
	/** Marble CMS blog. */
	get marble(): boolean {
		return Boolean(process.env.MARBLE_WORKSPACE_KEY);
	},
	/** Third-party analytics (Databuddy). Off unless explicitly enabled. */
	get analytics(): boolean {
		return truthy(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED);
	},
};
