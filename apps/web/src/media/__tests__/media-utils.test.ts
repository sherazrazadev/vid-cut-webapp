import { describe, expect, it } from "bun:test";
import { getMediaTypeFromFile, MEDIA_FILE_ACCEPT } from "../media-utils";

function fileWith({
	name,
	type,
}: {
	name: string;
	type: string;
}): File {
	return new File([new Uint8Array([0])], name, { type });
}

describe("getMediaTypeFromFile", () => {
	it("detects video/audio/image from MIME", () => {
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "a.mp4", type: "video/mp4" }),
			}),
		).toBe("video");
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "a.mp3", type: "audio/mpeg" }),
			}),
		).toBe("audio");
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "a.png", type: "image/png" }),
			}),
		).toBe("image");
	});

	it("falls back to extension when MIME is empty", () => {
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "clip.mov", type: "" }),
			}),
		).toBe("video");
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "track.m4a", type: "" }),
			}),
		).toBe("audio");
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "still.webp", type: "" }),
			}),
		).toBe("image");
	});

	it("returns null for unknown types", () => {
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "notes.txt", type: "text/plain" }),
			}),
		).toBeNull();
		expect(
			getMediaTypeFromFile({
				file: fileWith({ name: "archive.zip", type: "" }),
			}),
		).toBeNull();
	});
});

describe("MEDIA_FILE_ACCEPT", () => {
	it("includes common media MIME wildcards and extensions", () => {
		expect(MEDIA_FILE_ACCEPT).toContain("video/*");
		expect(MEDIA_FILE_ACCEPT).toContain("audio/*");
		expect(MEDIA_FILE_ACCEPT).toContain("image/*");
		expect(MEDIA_FILE_ACCEPT).toContain(".mov");
		expect(MEDIA_FILE_ACCEPT).toContain(".m4a");
	});
});
