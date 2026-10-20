import { describe, expect, test } from "bun:test";
import { getBaseScaleFactors, isScaleMode } from "@/rendering/scale-mode";

describe("getBaseScaleFactors", () => {
	const canvas = { canvasWidth: 1920, canvasHeight: 1080 };
	const source = { sourceWidth: 1080, sourceHeight: 1920 };

	test("fit uses contain (letterbox)", () => {
		const result = getBaseScaleFactors({ mode: "fit", ...canvas, ...source });
		expect(result.scaleX).toBeCloseTo(1080 / 1920);
		expect(result.scaleY).toBe(result.scaleX);
	});

	test("fill uses cover", () => {
		const result = getBaseScaleFactors({ mode: "fill", ...canvas, ...source });
		expect(result.scaleX).toBeCloseTo(1920 / 1080);
		expect(result.scaleY).toBe(result.scaleX);
	});

	test("stretch scales axes independently", () => {
		const result = getBaseScaleFactors({
			mode: "stretch",
			...canvas,
			...source,
		});
		expect(result.scaleX).toBeCloseTo(1920 / 1080);
		expect(result.scaleY).toBeCloseTo(1080 / 1920);
	});

	test("rejects invalid scale modes", () => {
		expect(isScaleMode("fit")).toBe(true);
		expect(isScaleMode("proxy")).toBe(false);
	});
});
