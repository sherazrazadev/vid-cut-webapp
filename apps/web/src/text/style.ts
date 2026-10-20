import type { ParamValues } from "@/params";

const DEFAULT_STROKE = {
	enabled: false,
	color: "#000000",
	width: 4,
};

const DEFAULT_SHADOW = {
	enabled: false,
	color: "rgba(0,0,0,0.55)",
	blur: 8,
	offsetX: 0,
	offsetY: 4,
};

export type TextStrokeStyle = {
	enabled: boolean;
	color: string;
	width: number;
};

export type TextShadowStyle = {
	enabled: boolean;
	color: string;
	blur: number;
	offsetX: number;
	offsetY: number;
};

function readBoolean({
	params,
	key,
	fallback,
}: {
	params: ParamValues;
	key: string;
	fallback: boolean;
}): boolean {
	const value = params[key];
	return typeof value === "boolean" ? value : fallback;
}

function readString({
	params,
	key,
	fallback,
}: {
	params: ParamValues;
	key: string;
	fallback: string;
}): string {
	const value = params[key];
	return typeof value === "string" ? value : fallback;
}

function readNumber({
	params,
	key,
	fallback,
}: {
	params: ParamValues;
	key: string;
	fallback: number;
}): number {
	const value = params[key];
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function buildTextStrokeFromParams({
	params,
}: {
	params: ParamValues;
}): TextStrokeStyle {
	return {
		enabled: readBoolean({
			params,
			key: "stroke.enabled",
			fallback: DEFAULT_STROKE.enabled,
		}),
		color: readString({
			params,
			key: "stroke.color",
			fallback: DEFAULT_STROKE.color,
		}),
		width: readNumber({
			params,
			key: "stroke.width",
			fallback: DEFAULT_STROKE.width,
		}),
	};
}

export function buildTextShadowFromParams({
	params,
}: {
	params: ParamValues;
}): TextShadowStyle {
	return {
		enabled: readBoolean({
			params,
			key: "shadow.enabled",
			fallback: DEFAULT_SHADOW.enabled,
		}),
		color: readString({
			params,
			key: "shadow.color",
			fallback: DEFAULT_SHADOW.color,
		}),
		blur: readNumber({
			params,
			key: "shadow.blur",
			fallback: DEFAULT_SHADOW.blur,
		}),
		offsetX: readNumber({
			params,
			key: "shadow.offsetX",
			fallback: DEFAULT_SHADOW.offsetX,
		}),
		offsetY: readNumber({
			params,
			key: "shadow.offsetY",
			fallback: DEFAULT_SHADOW.offsetY,
		}),
	};
}
