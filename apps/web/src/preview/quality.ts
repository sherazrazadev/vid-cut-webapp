export type PreviewQuality = "full" | "performance";

export const PREVIEW_QUALITY_OPTIONS: {
	value: PreviewQuality;
	label: string;
}[] = [
	{ value: "full", label: "Full" },
	{ value: "performance", label: "Performance" },
];

/** Max image edge length used while building the preview scene. */
export function getPreviewMaxImageSize({
	quality,
}: {
	quality: PreviewQuality;
}): number {
	return quality === "performance" ? 1024 : 2048;
}
