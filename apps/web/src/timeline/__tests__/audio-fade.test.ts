import { describe, expect, test } from "bun:test";
import {
	AUDIO_FADE_SILENCE_DB,
	AUDIO_FADE_TICKS_PER_SECOND,
	buildFadeVolumeKeyframes,
} from "@/timeline/audio-fade-math";

describe("buildFadeVolumeKeyframes", () => {
	const durationTicks = 10 * AUDIO_FADE_TICKS_PER_SECOND;
	const baseVolumeDb = 0;

	test("returns empty when both fades are zero", () => {
		expect(
			buildFadeVolumeKeyframes({
				durationTicks,
				baseVolumeDb,
				fadeInSeconds: 0,
				fadeOutSeconds: 0,
			}),
		).toEqual([]);
	});

	test("builds fade-in from silence to base volume", () => {
		const keys = buildFadeVolumeKeyframes({
			durationTicks,
			baseVolumeDb,
			fadeInSeconds: 1,
			fadeOutSeconds: 0,
		});
		expect(keys).toHaveLength(2);
		expect(keys[0]).toEqual({ time: 0, value: AUDIO_FADE_SILENCE_DB });
		expect(keys[1].value).toBe(baseVolumeDb);
		expect(keys[1].time).toBe(AUDIO_FADE_TICKS_PER_SECOND);
	});

	test("builds fade-out from base volume to silence", () => {
		const keys = buildFadeVolumeKeyframes({
			durationTicks,
			baseVolumeDb,
			fadeInSeconds: 0,
			fadeOutSeconds: 2,
		});
		expect(keys).toHaveLength(2);
		expect(keys[0].value).toBe(baseVolumeDb);
		expect(keys[0].time).toBe(8 * AUDIO_FADE_TICKS_PER_SECOND);
		expect(keys[1].value).toBe(AUDIO_FADE_SILENCE_DB);
		expect(keys[1].time).toBe(durationTicks);
	});

	test("scales overlapping fades to fit duration", () => {
		const keys = buildFadeVolumeKeyframes({
			durationTicks: 2 * AUDIO_FADE_TICKS_PER_SECOND,
			baseVolumeDb,
			fadeInSeconds: 2,
			fadeOutSeconds: 2,
		});
		expect(keys.length).toBeGreaterThanOrEqual(3);
		expect(keys[0].time).toBe(0);
		expect(keys[0].value).toBe(AUDIO_FADE_SILENCE_DB);
		expect(keys[keys.length - 1].value).toBe(AUDIO_FADE_SILENCE_DB);
	});
});
