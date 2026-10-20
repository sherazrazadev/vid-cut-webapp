import { features } from "@/env/features";
import { webEnv } from "@/env/web";

export async function checkRateLimit({
	request,
}: {
	request: Request;
}): Promise<{ success: boolean; limited: boolean }> {
	if (!features.redis) {
		return { success: true, limited: false };
	}

	const { Ratelimit } = await import("@upstash/ratelimit");
	const { Redis } = await import("@upstash/redis");

	const redis = new Redis({
		url: webEnv.UPSTASH_REDIS_REST_URL!,
		token: webEnv.UPSTASH_REDIS_REST_TOKEN!,
	});

	const limiter = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(100, "1 m"),
		analytics: false,
		prefix: "rate-limit",
	});

	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = await limiter.limit(ip);
	return { success, limited: !success };
}
