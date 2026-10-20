import { features } from "@/env/features";
import { generateUUID } from "@/utils/id";
import type { FeedbackEntry, SubmitFeedbackInput } from "./types";

export async function submitFeedback({
	message,
}: SubmitFeedbackInput): Promise<FeedbackEntry> {
	const id = generateUUID();
	const now = new Date();

	if (!features.database) {
		// Free path: accept locally without persistence.
		return { id, message, createdAt: now.toISOString() };
	}

	const { getDb, feedback } = await import("@/db");
	const db = getDb();
	await db.insert(feedback).values({ id, message, createdAt: now });

	return { id, message, createdAt: now.toISOString() };
}
