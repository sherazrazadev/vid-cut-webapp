import type { FrameRate } from "opencut-wasm";
import { EXPORT_MIME_TYPES } from "./mime-types";
import type { ExportResolution } from "./resolution";

export const EXPORT_QUALITY_VALUES = [
	"low",
	"medium",
	"high",
	"very_high",
] as const;

export const EXPORT_FORMAT_VALUES = ["mp4", "webm"] as const;

export const EXPORT_VIDEO_CODEC_VALUES = ["avc", "hevc", "vp9", "av1"] as const;

export type ExportFormat = (typeof EXPORT_FORMAT_VALUES)[number];
export type ExportQuality = (typeof EXPORT_QUALITY_VALUES)[number];
export type ExportVideoCodec = (typeof EXPORT_VIDEO_CODEC_VALUES)[number];
export type { ExportResolution };

export interface ExportOptions {
	format: ExportFormat;
	quality: ExportQuality;
	fps?: FrameRate;
	includeAudio?: boolean;
	audioOnly?: boolean;
	resolution?: ExportResolution;
	videoCodec?: ExportVideoCodec;
}

export interface ExportResult {
	success: boolean;
	buffer?: ArrayBuffer;
	error?: string;
	cancelled?: boolean;
}

export interface ExportState {
	isExporting: boolean;
	progress: number;
	result: ExportResult | null;
}

export function getDefaultVideoCodec({
	format,
}: {
	format: ExportFormat;
}): ExportVideoCodec {
	return format === "webm" ? "vp9" : "avc";
}

export function getFormatForVideoCodec({
	codec,
}: {
	codec: ExportVideoCodec;
}): ExportFormat {
	return codec === "vp9" || codec === "av1" ? "webm" : "mp4";
}

export function getExportMimeType({
	format,
	audioOnly,
}: {
	format: ExportFormat;
	audioOnly?: boolean;
}): string {
	if (audioOnly) {
		return format === "webm" ? "audio/webm" : "audio/mp4";
	}
	return EXPORT_MIME_TYPES[format];
}

export function getExportFileExtension({
	format,
	audioOnly,
}: {
	format: ExportFormat;
	audioOnly?: boolean;
}): string {
	if (audioOnly && format === "mp4") {
		return ".m4a";
	}
	return `.${format}`;
}

export function downloadBuffer({
	buffer,
	filename,
	mimeType,
}: {
	buffer: ArrayBuffer;
	filename: string;
	mimeType: string;
}): void {
	const blob = new Blob([buffer], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const downloadLink = document.createElement("a");
	downloadLink.href = url;
	downloadLink.download = filename;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	URL.revokeObjectURL(url);
}

export {
	EXPORT_RESOLUTION_OPTIONS,
	EXPORT_RESOLUTION_VALUES,
	isExportResolution,
	scaleExportResolution,
} from "./resolution";
