import { describe, expect, test } from "bun:test";
import { scaleExportResolution } from "@/export/resolution";

describe("scaleExportResolution", () => {
	test("project keeps canvas size, even dimensions", () => {
		expect(
			scaleExportResolution({
				width: 1920,
				height: 1080,
				resolution: "project",
			}),
		).toEqual({ width: 1920, height: 1080 });
	});

	test("720p landscape 16:9", () => {
		expect(
			scaleExportResolution({
				width: 1920,
				height: 1080,
				resolution: "720p",
			}),
		).toEqual({ width: 1280, height: 720 });
	});

	test("1080p portrait 9:16", () => {
		expect(
			scaleExportResolution({
				width: 1080,
				height: 1920,
				resolution: "1080p",
			}),
		).toEqual({ width: 1080, height: 1920 });
	});

	test("4K landscape 16:9", () => {
		expect(
			scaleExportResolution({
				width: 1920,
				height: 1080,
				resolution: "4k",
			}),
		).toEqual({ width: 3840, height: 2160 });
	});

	test("4:5 1080p fits inside 1080x1920", () => {
		expect(
			scaleExportResolution({
				width: 1080,
				height: 1350,
				resolution: "720p",
			}),
		).toEqual({ width: 720, height: 900 });
	});
});
