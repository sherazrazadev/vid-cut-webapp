import { describe, expect, test } from "bun:test";
import {
	TEXT_TITLE_PRESETS,
	buildPresetTextParams,
} from "@/text/presets";
import {
	buildTextShadowFromParams,
	buildTextStrokeFromParams,
} from "@/text/style";

describe("TEXT_TITLE_PRESETS", () => {
	test("includes original title styles", () => {
		expect(TEXT_TITLE_PRESETS.length).toBeGreaterThanOrEqual(5);
		const ids = TEXT_TITLE_PRESETS.map((preset) => preset.id);
		expect(ids).toContain("plain-white");
		expect(ids).toContain("outline-impact");
		expect(ids).toContain("lower-third");
	});

	test("buildPresetTextParams merges defaults with preset", () => {
		const preset = TEXT_TITLE_PRESETS.find(
			(candidate) => candidate.id === "outline-impact",
		);
		expect(preset).toBeDefined();
		if (!preset) return;

		const params = buildPresetTextParams({ preset });
		expect(params.content).toBe("BIG MOMENT");
		expect(params["stroke.enabled"]).toBe(true);
		expect(params["shadow.enabled"]).toBe(true);
		expect(params.opacity).toBe(1);
	});
});

describe("text stroke/shadow style readers", () => {
	test("reads enabled stroke and shadow", () => {
		const stroke = buildTextStrokeFromParams({
			params: {
				"stroke.enabled": true,
				"stroke.color": "#111111",
				"stroke.width": 5,
			},
		});
		expect(stroke).toEqual({
			enabled: true,
			color: "#111111",
			width: 5,
		});

		const shadow = buildTextShadowFromParams({
			params: {
				"shadow.enabled": true,
				"shadow.color": "#222222",
				"shadow.blur": 10,
				"shadow.offsetX": 2,
				"shadow.offsetY": 3,
			},
		});
		expect(shadow).toEqual({
			enabled: true,
			color: "#222222",
			blur: 10,
			offsetX: 2,
			offsetY: 3,
		});
	});
});
