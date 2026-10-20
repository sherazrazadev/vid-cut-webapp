import { createAuthClient } from "better-auth/react";

const baseURL =
	process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
	"http://localhost:3000";

export const { signIn, signUp, useSession } = createAuthClient({
	baseURL,
});
