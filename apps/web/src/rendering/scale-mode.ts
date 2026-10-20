export type ScaleMode = "fit" | "fill" | "stretch";

export const SCALE_MODE_OPTIONS: {
	value: ScaleMode;
	label: string;
}[] = [
	{ value: "fit", label: "Fit" },
	{ value: "fill", label: "Fill" },
	{ value: "stretch", label: "Stretch" },
];

export function isScaleMode(value: unknown): value is ScaleMode {
	return value === "fit" || value === "fill" || value === "stretch";
}

/**
 * Base scale applied before the element transform so media matches the canvas.
 * - fit: contain (letterbox)
 * - fill: cover (crop overflow)
 * - stretch: independent axes to fill the canvas
 */
export function getBaseScaleFactors({
	mode,
	canvasWidth,
	canvasHeight,
	sourceWidth,
	sourceHeight,
}: {
	mode: ScaleMode;
	canvasWidth: number;
	canvasHeight: number;
	sourceWidth: number;
	sourceHeight: number;
}): { scaleX: number; scaleY: number } {
	if (sourceWidth <= 0 || sourceHeight <= 0) {
		return { scaleX: 1, scaleY: 1 };
	}

	if (mode === "stretch") {
		return {
			scaleX: canvasWidth / sourceWidth,
			scaleY: canvasHeight / sourceHeight,
		};
	}

	const contain = Math.min(
		canvasWidth / sourceWidth,
		canvasHeight / sourceHeight,
	);
	const cover = Math.max(
		canvasWidth / sourceWidth,
		canvasHeight / sourceHeight,
	);
	const scale = mode === "fill" ? cover : contain;

	return { scaleX: scale, scaleY: scale };
}
