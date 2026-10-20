"use client";

import { useState } from "react";
import { useEditor } from "@/editor/use-editor";
import {
	Section,
	SectionContent,
	SectionField,
	SectionFields,
} from "@/components/section";
import { NumberField } from "@/components/ui/number-field";
import { usePropertyDraft } from "@/components/editor/panels/properties/hooks/use-property-draft";
import {
	DEFAULT_AUDIO_FADE_SECONDS,
	estimateFadeSecondsFromAnimations,
} from "@/timeline/audio-fade";
import type { AudioCapableElement } from "@/timeline/audio-state";
import { TICKS_PER_SECOND } from "@/wasm";
import { clamp, formatNumberForDisplay } from "@/utils/math";

export function AudioFadeControls({
	element,
	trackId,
}: {
	element: AudioCapableElement;
	trackId: string;
}) {
	const editor = useEditor();
	const estimated = estimateFadeSecondsFromAnimations({ element });
	const maxFade = Math.max(0, element.duration / TICKS_PER_SECOND);

	const [fadeInSeconds, setFadeInSeconds] = useState(() =>
		estimated.fadeInSeconds > 0
			? estimated.fadeInSeconds
			: 0,
	);
	const [fadeOutSeconds, setFadeOutSeconds] = useState(() =>
		estimated.fadeOutSeconds > 0
			? estimated.fadeOutSeconds
			: 0,
	);
	const [pendingFadeIn, setPendingFadeIn] = useState(fadeInSeconds);
	const [pendingFadeOut, setPendingFadeOut] = useState(fadeOutSeconds);

	const applyFades = ({
		nextFadeIn,
		nextFadeOut,
	}: {
		nextFadeIn: number;
		nextFadeOut: number;
	}) => {
		const fadeIn = clamp({ value: nextFadeIn, min: 0, max: maxFade });
		const fadeOut = clamp({ value: nextFadeOut, min: 0, max: maxFade });
		setFadeInSeconds(fadeIn);
		setFadeOutSeconds(fadeOut);
		editor.timeline.applyAudioFades({
			trackId,
			elementId: element.id,
			fadeInSeconds: fadeIn,
			fadeOutSeconds: fadeOut,
		});
	};

	const fadeInDraft = usePropertyDraft({
		displayValue: formatNumberForDisplay({
			value: fadeInSeconds,
			maxFractionDigits: 2,
		}),
		parse: (input) => {
			const parsed = Number(input);
			if (!Number.isFinite(parsed)) return null;
			return clamp({ value: parsed, min: 0, max: maxFade });
		},
		onStartEditing: () => setPendingFadeIn(fadeInSeconds),
		onPreview: (value) => setPendingFadeIn(value),
		onCommit: () => {
			if (pendingFadeIn !== fadeInSeconds) {
				applyFades({
					nextFadeIn: pendingFadeIn,
					nextFadeOut: fadeOutSeconds,
				});
			}
		},
	});

	const fadeOutDraft = usePropertyDraft({
		displayValue: formatNumberForDisplay({
			value: fadeOutSeconds,
			maxFractionDigits: 2,
		}),
		parse: (input) => {
			const parsed = Number(input);
			if (!Number.isFinite(parsed)) return null;
			return clamp({ value: parsed, min: 0, max: maxFade });
		},
		onStartEditing: () => setPendingFadeOut(fadeOutSeconds),
		onPreview: (value) => setPendingFadeOut(value),
		onCommit: () => {
			if (pendingFadeOut !== fadeOutSeconds) {
				applyFades({
					nextFadeIn: fadeInSeconds,
					nextFadeOut: pendingFadeOut,
				});
			}
		},
	});

	return (
		<Section sectionKey={`${element.id}:audio-fade`}>
			<SectionContent className="pt-2">
				<SectionFields>
					<SectionField label="Fade in">
						<NumberField
							value={fadeInDraft.displayValue}
							suffix="s"
							scrubClamp={{ min: 0, max: maxFade }}
							onFocus={fadeInDraft.onFocus}
							onChange={fadeInDraft.onChange}
							onBlur={fadeInDraft.onBlur}
							onScrub={fadeInDraft.scrubTo}
							onScrubEnd={fadeInDraft.commitScrub}
							onReset={() =>
								applyFades({
									nextFadeIn: DEFAULT_AUDIO_FADE_SECONDS,
									nextFadeOut: fadeOutSeconds,
								})
							}
							isDefault={fadeInSeconds === 0}
						/>
					</SectionField>
					<SectionField label="Fade out">
						<NumberField
							value={fadeOutDraft.displayValue}
							suffix="s"
							scrubClamp={{ min: 0, max: maxFade }}
							onFocus={fadeOutDraft.onFocus}
							onChange={fadeOutDraft.onChange}
							onBlur={fadeOutDraft.onBlur}
							onScrub={fadeOutDraft.scrubTo}
							onScrubEnd={fadeOutDraft.commitScrub}
							onReset={() =>
								applyFades({
									nextFadeIn: fadeInSeconds,
									nextFadeOut: DEFAULT_AUDIO_FADE_SECONDS,
								})
							}
							isDefault={fadeOutSeconds === 0}
						/>
					</SectionField>
				</SectionFields>
			</SectionContent>
		</Section>
	);
}
