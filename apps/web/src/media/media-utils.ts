import type { MediaAsset, MediaType } from "@/media/types";

export const SUPPORTS_AUDIO: readonly MediaType[] = ["audio", "video"];

/** Accept string for `<input type="file">` — MIME + extensions for empty-type OS dialogs. */
export const MEDIA_FILE_ACCEPT = [
	"image/*",
	"video/*",
	"audio/*",
	".png",
	".jpg",
	".jpeg",
	".webp",
	".gif",
	".svg",
	".mp4",
	".webm",
	".mov",
	".m4v",
	".mkv",
	".mp3",
	".wav",
	".aac",
	".m4a",
	".ogg",
	".flac",
].join(",");

const EXTENSION_MEDIA_TYPE: Record<string, MediaType> = {
	png: "image",
	jpg: "image",
	jpeg: "image",
	webp: "image",
	gif: "image",
	svg: "image",
	bmp: "image",
	avif: "image",
	mp4: "video",
	webm: "video",
	mov: "video",
	m4v: "video",
	mkv: "video",
	avi: "video",
	mp3: "audio",
	wav: "audio",
	aac: "audio",
	m4a: "audio",
	ogg: "audio",
	flac: "audio",
	opus: "audio",
};

export function mediaSupportsAudio({
	media,
}: {
	media: MediaAsset | null | undefined;
}): boolean {
	if (!media) return false;
	return SUPPORTS_AUDIO.includes(media.type);
}

function getExtension({ fileName }: { fileName: string }): string {
	const base = fileName.split(/[/\\]/).pop() ?? fileName;
	const dot = base.lastIndexOf(".");
	if (dot <= 0 || dot === base.length - 1) return "";
	return base.slice(dot + 1).toLowerCase();
}

export const getMediaTypeFromFile = ({
	file,
}: {
	file: File;
}): MediaType | null => {
	const { type } = file;

	if (type.startsWith("image/")) {
		return "image";
	}
	if (type.startsWith("video/")) {
		return "video";
	}
	if (type.startsWith("audio/")) {
		return "audio";
	}

	// Some OS/browsers leave File.type empty (especially .mov / .mkv).
	const ext = getExtension({ fileName: file.name });
	return EXTENSION_MEDIA_TYPE[ext] ?? null;
};
