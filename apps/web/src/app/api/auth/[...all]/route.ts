import { NextResponse } from "next/server";
import { features } from "@/env/features";

async function getHandlers() {
	const { getAuth } = await import("@/auth/server");
	const { toNextJsHandler } = await import("better-auth/next-js");
	return toNextJsHandler(getAuth());
}

export async function GET(request: Request) {
	if (!features.auth) {
		return NextResponse.json(
			{ error: "Auth is disabled for this deployment." },
			{ status: 501 },
		);
	}
	const handlers = await getHandlers();
	return handlers.GET(request);
}

export async function POST(request: Request) {
	if (!features.auth) {
		return NextResponse.json(
			{ error: "Auth is disabled for this deployment." },
			{ status: 501 },
		);
	}
	const handlers = await getHandlers();
	return handlers.POST(request);
}
