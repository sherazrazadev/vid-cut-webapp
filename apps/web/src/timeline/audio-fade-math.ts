export const AUDIO_FADE_TICKS_PER_SECOND = 120_000;
export const AUDIO_FADE_SILENCE_DB = -60;

export type FadeVolumeKeyframe = {
	time: number;
	value: number;
};

/**
 * Build volume (dB) keyframes for linear fade-in / fade-out.
 * Silence uses AUDIO_FADE_SILENCE_DB. Overlapping fades are scaled to fit duration.
 */
export function buildFadeVolumeKeyframes({
	durationTicks,
	baseVolumeDb,
	fadeInSeconds,
	fadeOutSeconds,
	ticksPerSecond = AUDIO_FADE_TICKS_PER_SECOND,
	silenceDb = AUDIO_FADE_SILENCE_DB,
}: {
	durationTicks: number;
	baseVolumeDb: number;
	fadeInSeconds: number;
	fadeOutSeconds: number;
	ticksPerSecond?: number;
	silenceDb?: number;
}): FadeVolumeKeyframe[] {
	const durationSeconds = Math.max(0, durationTicks / ticksPerSecond);
	if (durationSeconds <= 0) {
		return [];
	}

	let fadeIn = Math.max(0, fadeInSeconds);
	let fadeOut = Math.max(0, fadeOutSeconds);

	if (fadeIn + fadeOut > durationSeconds && fadeIn + fadeOut > 0) {
		const scale = durationSeconds / (fadeIn + fadeOut);
		fadeIn *= scale;
		fadeOut *= scale;
	}

	if (fadeIn <= 0 && fadeOut <= 0) {
		return [];
	}

	const points: FadeVolumeKeyframe[] = [];
	const pushUnique = ({ time, value }: FadeVolumeKeyframe) => {
		const last = points[points.length - 1];
		if (last && last.time === time) {
			last.value = value;
			return;
		}
		points.push({ time, value });
	};

	const toTicks = (seconds: number) => Math.round(seconds * ticksPerSecond);

	if (fadeIn > 0) {
		pushUnique({ time: 0, value: silenceDb });
		pushUnique({
			time: toTicks(fadeIn),
			value: baseVolumeDb,
		});
	}

	if (fadeOut > 0) {
		const fadeOutStart = Math.max(0, durationSeconds - fadeOut);
		pushUnique({
			time: toTicks(fadeOutStart),
			value: baseVolumeDb,
		});
		pushUnique({
			time: toTicks(durationSeconds),
			value: silenceDb,
		});
	}

	return points;
}
