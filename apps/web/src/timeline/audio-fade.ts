import { getChannel, setChannel, upsertPathKeyframe } from "@/animation";
import type { ElementAnimations } from "@/animation/types";
import { resolveAnimationTarget } from "@/timeline/animation-targets";
import { VOLUME_DB_MIN } from "@/timeline/audio-constants";
import {
	getElementVolume,
	type AudioCapableElement,
} from "@/timeline/audio-state";
import {
	buildFadeVolumeKeyframes as buildFadeVolumeKeyframesMath,
} from "@/timeline/audio-fade-math";
import {
	TICKS_PER_SECOND,
	mediaTime,
	type MediaTime,
	ZERO_MEDIA_TIME,
} from "@/wasm";

export const DEFAULT_AUDIO_FADE_SECONDS = 0.5;

export type FadeVolumeKeyframe = {
	time: MediaTime;
	value: number;
};

export function buildFadeVolumeKeyframes({
	durationTicks,
	baseVolumeDb,
	fadeInSeconds,
	fadeOutSeconds,
}: {
	durationTicks: number;
	baseVolumeDb: number;
	fadeInSeconds: number;
	fadeOutSeconds: number;
}): FadeVolumeKeyframe[] {
	return buildFadeVolumeKeyframesMath({
		durationTicks,
		baseVolumeDb,
		fadeInSeconds,
		fadeOutSeconds,
		ticksPerSecond: TICKS_PER_SECOND,
		silenceDb: VOLUME_DB_MIN,
	}).map((point) => ({
		time: mediaTime({ ticks: point.time }),
		value: point.value,
	}));
}

export function applyFadeVolumeAnimations({
	element,
	fadeInSeconds,
	fadeOutSeconds,
}: {
	element: AudioCapableElement;
	fadeInSeconds: number;
	fadeOutSeconds: number;
}): ElementAnimations | undefined {
	const target = resolveAnimationTarget({
		element,
		path: "volume",
	});
	if (!target) {
		return element.animations;
	}

	let animations = setChannel({
		animations: element.animations,
		propertyPath: "volume",
		channel: undefined,
	});

	const keyframes = buildFadeVolumeKeyframes({
		durationTicks: element.duration,
		baseVolumeDb: getElementVolume({ element }),
		fadeInSeconds,
		fadeOutSeconds,
	});

	for (const keyframe of keyframes) {
		animations = upsertPathKeyframe({
			animations,
			propertyPath: "volume",
			time: keyframe.time,
			value: keyframe.value,
			interpolation: "linear",
			channelLayout: target.channelLayout,
			coerceValue: target.coerceValue,
		});
	}

	return animations;
}

export function estimateFadeSecondsFromAnimations({
	element,
}: {
	element: AudioCapableElement;
}): { fadeInSeconds: number; fadeOutSeconds: number } {
	const channel = getChannel({
		animations: element.animations,
		propertyPath: "volume",
	});
	if (!channel || !("keys" in channel) || channel.keys.length < 2) {
		return { fadeInSeconds: 0, fadeOutSeconds: 0 };
	}

	const keys = [...channel.keys].sort((a, b) => a.time - b.time);
	const durationSeconds = element.duration / TICKS_PER_SECOND;
	const baseVolume = getElementVolume({ element });

	let fadeInSeconds = 0;
	let fadeOutSeconds = 0;

	const first = keys[0];
	const second = keys[1];
	if (
		first.time === ZERO_MEDIA_TIME &&
		typeof first.value === "number" &&
		first.value <= VOLUME_DB_MIN + 0.01 &&
		typeof second.value === "number" &&
		Math.abs(second.value - baseVolume) < 0.01
	) {
		fadeInSeconds = second.time / TICKS_PER_SECOND;
	}

	const last = keys[keys.length - 1];
	const prev = keys[keys.length - 2];
	if (
		typeof last.value === "number" &&
		last.value <= VOLUME_DB_MIN + 0.01 &&
		typeof prev.value === "number" &&
		Math.abs(prev.value - baseVolume) < 0.01
	) {
		fadeOutSeconds = Math.max(0, durationSeconds - prev.time / TICKS_PER_SECOND);
	}

	return { fadeInSeconds, fadeOutSeconds };
}
