import { describe, expect, test } from "bun:test";
import { DEFAULT_CANVAS_PRESETS } from "@/canvas/sizes";
import { dimensionToAspectRatio } from "@/utils/geometry";

describe("DEFAULT_CANVAS_PRESETS", () => {
	test("includes CapCut-style ratios including 4:5", () => {
		const ratios = DEFAULT_CANVAS_PRESETS.map((preset) =>
			dimensionToAspectRatio(preset),
		);
		expect(ratios).toContain("16:9");
		expect(ratios).toContain("9:16");
		expect(ratios).toContain("1:1");
		expect(ratios).toContain("4:5");
	});
});
