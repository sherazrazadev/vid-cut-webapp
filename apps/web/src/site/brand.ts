const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const SITE_URL = envUrl || "http://localhost:3000";

export const SITE_INFO = {
	title: "vid-cut",
	description:
		"A free, open-source video editor for the browser. Local-first. No watermark.",
	url: SITE_URL,
	openGraphImage: "/open-graph/default.jpg",
	twitterImage: "/open-graph/default.jpg",
	favicon: "/favicon.ico",
};

export const DEFAULT_LOGO_URL = "/logos/vid-cut/svg/logo.svg";
