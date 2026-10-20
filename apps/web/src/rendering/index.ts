import type { ParamValues } from "@/params";
import { isScaleMode, type ScaleMode } from "@/rendering/scale-mode";

export type { ScaleMode } from "@/rendering/scale-mode";
export {
	SCALE_MODE_OPTIONS,
	getBaseScaleFactors,
	isScaleMode,
} from "@/rendering/scale-mode";

export interface Transform {
	scaleX: number;
	scaleY: number;
	position: {
		x: number;
		y: number;
	};
	rotate: number;
}

export type BlendMode =
	| "normal"
	| "darken"
	| "multiply"
	| "color-burn"
	| "lighten"
	| "screen"
	| "plus-lighter"
	| "color-dodge"
	| "overlay"
	| "soft-light"
	| "hard-light"
	| "difference"
	| "exclusion"
	| "hue"
	| "saturation"
	| "color"
	| "luminosity";

export function buildTransformFromParams({
	params,
}: {
	params: ParamValues;
}): Transform {
	return {
		scaleX: readNumberParam({ params, key: "transform.scaleX", fallback: 1 }),
		scaleY: readNumberParam({ params, key: "transform.scaleY", fallback: 1 }),
		position: {
			x: readNumberParam({ params, key: "transform.positionX", fallback: 0 }),
			y: readNumberParam({ params, key: "transform.positionY", fallback: 0 }),
		},
		rotate: readNumberParam({ params, key: "transform.rotate", fallback: 0 }),
	};
}

export function readOpacityFromParams({
	params,
}: {
	params: ParamValues;
}): number {
	return readNumberParam({ params, key: "opacity", fallback: 1 });
}

export function readScaleModeFromParams({
	params,
}: {
	params: ParamValues;
}): ScaleMode {
	const value = params["transform.scaleMode"];
	return isScaleMode(value) ? value : "fit";
}

export function readBlendModeFromParams({
	params,
}: {
	params: ParamValues;
}): BlendMode {
	const value = params.blendMode;
	return typeof value === "string" && isBlendMode(value) ? value : "normal";
}

function readNumberParam({
	params,
	key,
	fallback,
}: {
	params: ParamValues;
	key: string;
	fallback: number;
}): number {
	const value = params[key];
	return typeof value === "number" ? value : fallback;
}

function isBlendMode(value: string): value is BlendMode {
	return (
		value === "normal" ||
		value === "darken" ||
		value === "multiply" ||
		value === "color-burn" ||
		value === "lighten" ||
		value === "screen" ||
		value === "plus-lighter" ||
		value === "color-dodge" ||
		value === "overlay" ||
		value === "soft-light" ||
		value === "hard-light" ||
		value === "difference" ||
		value === "exclusion" ||
		value === "hue" ||
		value === "saturation" ||
		value === "color" ||
		value === "luminosity"
	);
}
