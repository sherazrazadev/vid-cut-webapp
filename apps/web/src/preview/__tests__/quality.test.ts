import { describe, expect, test } from "bun:test";
import { getPreviewMaxImageSize } from "@/preview/quality";

describe("getPreviewMaxImageSize", () => {
	test("full quality uses 2048", () => {
		expect(getPreviewMaxImageSize({ quality: "full" })).toBe(2048);
	});

	test("performance quality uses 1024", () => {
		expect(getPreviewMaxImageSize({ quality: "performance" })).toBe(1024);
	});
});
