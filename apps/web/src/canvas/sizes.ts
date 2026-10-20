import type { TCanvasSize } from "@/project/types";

export const DEFAULT_CANVAS_PRESETS: TCanvasSize[] = [
	{ width: 1920, height: 1080 }, // 16:9
	{ width: 1080, height: 1920 }, // 9:16
	{ width: 1080, height: 1080 }, // 1:1
	{ width: 1080, height: 1350 }, // 4:5 (Reels/Feed)
	{ width: 1440, height: 1080 }, // 4:3
];

export const DEFAULT_CANVAS_SIZE: TCanvasSize = { width: 1920, height: 1080 };
