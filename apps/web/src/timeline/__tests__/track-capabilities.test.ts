import { describe, expect, it } from "bun:test";
import {
	canTrackBeHidden,
	canTrackHaveAudio,
	isTrackLocked,
} from "../track-capabilities";
import type { AudioTrack, TimelineTrack, VideoTrack } from "../types";

function videoTrack(overrides: Partial<VideoTrack> = {}): VideoTrack {
	return {
		id: "v1",
		name: "Video",
		type: "video",
		elements: [],
		muted: false,
		hidden: false,
		...overrides,
	};
}

function audioTrack(overrides: Partial<AudioTrack> = {}): AudioTrack {
	return {
		id: "a1",
		name: "Audio",
		type: "audio",
		elements: [],
		muted: false,
		...overrides,
	};
}

describe("track capabilities", () => {
	it("detects audio-capable tracks", () => {
		expect(canTrackHaveAudio(videoTrack())).toBe(true);
		expect(canTrackHaveAudio(audioTrack())).toBe(true);
	});

	it("hides non-audio tracks only", () => {
		expect(canTrackBeHidden(videoTrack())).toBe(true);
		expect(canTrackBeHidden(audioTrack())).toBe(false);
	});

	it("treats missing locked as unlocked", () => {
		expect(isTrackLocked(videoTrack())).toBe(false);
		expect(isTrackLocked(undefined)).toBe(false);
	});

	it("detects locked tracks", () => {
		const locked: TimelineTrack = videoTrack({ locked: true });
		expect(isTrackLocked(locked)).toBe(true);
	});
});
