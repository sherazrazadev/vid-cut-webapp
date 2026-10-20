export const EXPORT_RESOLUTION_VALUES = [
	"project",
	"720p",
	"1080p",
	"4k",
] as const;

export type ExportResolution = (typeof EXPORT_RESOLUTION_VALUES)[number];

export const EXPORT_RESOLUTION_OPTIONS: {
	value: ExportResolution;
	label: string;
}[] = [
	{ value: "project", label: "Project size" },
	{ value: "720p", label: "720p" },
	{ value: "1080p", label: "1080p" },
	{ value: "4k", label: "4K" },
];

type Size = { width: number; height: number };

function even({ value }: { value: number }): number {
	const rounded = Math.max(2, Math.round(value));
	return rounded % 2 === 0 ? rounded : rounded + 1;
}

function boxForPreset({
	isLandscape,
	preset,
}: {
	isLandscape: boolean;
	preset: Exclude<ExportResolution, "project">;
}): Size {
	if (preset === "720p") {
		return isLandscape
			? { width: 1280, height: 720 }
			: { width: 720, height: 1280 };
	}
	if (preset === "1080p") {
		return isLandscape
			? { width: 1920, height: 1080 }
			: { width: 1080, height: 1920 };
	}
	return isLandscape
		? { width: 3840, height: 2160 }
		: { width: 2160, height: 3840 };
}

/** Scale project canvas into a 720p / 1080p / 4K box, keeping aspect ratio. */
export function scaleExportResolution({
	width,
	height,
	resolution,
}: Size & { resolution: ExportResolution }): Size {
	if (resolution === "project" || width <= 0 || height <= 0) {
		return { width: even({ value: width }), height: even({ value: height }) };
	}

	const isLandscape = width >= height;
	const box = boxForPreset({ isLandscape, preset: resolution });
	const scale = Math.min(box.width / width, box.height / height);

	return {
		width: even({ value: width * scale }),
		height: even({ value: height * scale }),
	};
}

export function isExportResolution(value: string): value is ExportResolution {
	return EXPORT_RESOLUTION_VALUES.some((candidate) => candidate === value);
}
