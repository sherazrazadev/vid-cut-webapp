import type { ParamValues } from "@/params";

export type TextTitlePreset = {
	id: string;
	name: string;
	label: string;
	previewClassName: string;
	params: ParamValues;
};

/** Shared base params for presets (no wasm/timeline imports). */
const PRESET_BASE_PARAMS: ParamValues = {
	textDecoration: "none",
	letterSpacing: 0,
	lineHeight: 1.2,
	"background.enabled": false,
	"background.color": "#000000",
	"background.cornerRadius": 0,
	"background.paddingX": 30,
	"background.paddingY": 42,
	"background.offsetX": 0,
	"background.offsetY": 0,
	"stroke.enabled": false,
	"stroke.color": "#000000",
	"stroke.width": 4,
	"shadow.enabled": false,
	"shadow.color": "rgba(0,0,0,0.55)",
	"shadow.blur": 8,
	"shadow.offsetX": 0,
	"shadow.offsetY": 4,
	"transform.positionX": 0,
	"transform.positionY": 0,
	"transform.scaleX": 1,
	"transform.scaleY": 1,
	"transform.rotate": 0,
	"transform.scaleMode": "fit",
	opacity: 1,
	blendMode: "normal",
};

/**
 * Original vid-cut title styles — not CapCut assets.
 */
export const TEXT_TITLE_PRESETS: TextTitlePreset[] = [
	{
		id: "plain-white",
		name: "Plain",
		label: "Aa",
		previewClassName: "text-white text-sm font-sans",
		params: {
			content: "Title",
			fontFamily: "Arial",
			fontSize: 18,
			color: "#ffffff",
			textAlign: "center",
			fontWeight: "bold",
			fontStyle: "normal",
			textDecoration: "none",
			"stroke.enabled": false,
			"shadow.enabled": false,
			"background.enabled": false,
		},
	},
	{
		id: "lower-third",
		name: "Lower third",
		label: "NAME",
		previewClassName: "text-white text-[10px] font-bold bg-sky-600 px-2 py-1 rounded-sm",
		params: {
			content: "Name · Role",
			fontFamily: "Arial",
			fontSize: 12,
			color: "#ffffff",
			textAlign: "left",
			fontWeight: "bold",
			"background.enabled": true,
			"background.color": "#0284c7",
			"background.cornerRadius": 12,
			"background.paddingX": 24,
			"background.paddingY": 18,
			"stroke.enabled": false,
			"shadow.enabled": false,
			"transform.positionY": 280,
		},
	},
	{
		id: "outline-impact",
		name: "Outline",
		label: "BIG",
		previewClassName: "text-yellow-300 text-sm font-black",
		params: {
			content: "BIG MOMENT",
			fontFamily: "Impact",
			fontSize: 28,
			color: "#fde047",
			textAlign: "center",
			fontWeight: "bold",
			"stroke.enabled": true,
			"stroke.color": "#000000",
			"stroke.width": 6,
			"shadow.enabled": true,
			"shadow.color": "rgba(0,0,0,0.55)",
			"shadow.blur": 8,
			"shadow.offsetX": 0,
			"shadow.offsetY": 4,
			"background.enabled": false,
		},
	},
	{
		id: "soft-caption",
		name: "Caption",
		label: "sub",
		previewClassName: "text-white text-[11px] bg-black/70 px-2 py-0.5 rounded",
		params: {
			content: "Caption line",
			fontFamily: "Arial",
			fontSize: 11,
			color: "#ffffff",
			textAlign: "center",
			fontWeight: "normal",
			"background.enabled": true,
			"background.color": "#000000",
			"background.cornerRadius": 40,
			"background.paddingX": 28,
			"background.paddingY": 16,
			"stroke.enabled": false,
			"shadow.enabled": false,
			"transform.positionY": 320,
		},
	},
	{
		id: "serif-quote",
		name: "Quote",
		label: "“Q”",
		previewClassName: "text-stone-100 text-sm italic font-serif",
		params: {
			content: "“A short quote.”",
			fontFamily: "Georgia",
			fontSize: 16,
			color: "#f5f5f4",
			textAlign: "center",
			fontWeight: "normal",
			fontStyle: "italic",
			"stroke.enabled": false,
			"shadow.enabled": true,
			"shadow.color": "rgba(0,0,0,0.65)",
			"shadow.blur": 12,
			"shadow.offsetX": 0,
			"shadow.offsetY": 2,
			"background.enabled": false,
		},
	},
	{
		id: "neon-pop",
		name: "Neon",
		label: "POP",
		previewClassName: "text-fuchsia-300 text-sm font-bold",
		params: {
			content: "POP",
			fontFamily: "Arial",
			fontSize: 26,
			color: "#f0abfc",
			textAlign: "center",
			fontWeight: "bold",
			"stroke.enabled": true,
			"stroke.color": "#86198f",
			"stroke.width": 3,
			"shadow.enabled": true,
			"shadow.color": "rgba(232,121,249,0.85)",
			"shadow.blur": 18,
			"shadow.offsetX": 0,
			"shadow.offsetY": 0,
			"background.enabled": false,
		},
	},
];

export function buildPresetTextParams({
	preset,
}: {
	preset: TextTitlePreset;
}): ParamValues {
	return {
		...PRESET_BASE_PARAMS,
		...preset.params,
	};
}
