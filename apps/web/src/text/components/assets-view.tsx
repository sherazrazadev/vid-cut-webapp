"use client";

import { DraggableItem } from "@/components/editor/panels/assets/draggable-item";
import { PanelView } from "@/components/editor/panels/assets/views/base-panel";
import { useEditor } from "@/editor/use-editor";
import {
	TEXT_TITLE_PRESETS,
	buildPresetTextParams,
	type TextTitlePreset,
} from "@/text/presets";
import { DEFAULTS } from "@/timeline/defaults";
import { buildTextElement } from "@/timeline/element-utils";
import { cn } from "@/utils/ui";
import type { MediaTime } from "@/wasm";

export function TextView() {
	const editor = useEditor();

	const handleAddPreset = ({
		preset,
		currentTime,
	}: {
		preset: TextTitlePreset;
		currentTime: MediaTime;
	}) => {
		const activeScene = editor.scenes.getActiveScene();
		if (!activeScene) return;

		const element = buildTextElement({
			raw: {
				...DEFAULTS.text.element,
				name: preset.name,
				params: buildPresetTextParams({ preset }),
			},
			startTime: currentTime,
		});

		editor.timeline.insertElement({
			element,
			placement: { mode: "auto" },
		});
	};

	return (
		<PanelView title="Text">
			<div className="grid grid-cols-2 gap-2 p-1">
				{TEXT_TITLE_PRESETS.map((preset) => (
					<DraggableItem
						key={preset.id}
						name={preset.name}
						preview={
							<div className="bg-neutral-900 flex size-full items-center justify-center rounded">
								<span className={cn("select-none", preset.previewClassName)}>
									{preset.label}
								</span>
							</div>
						}
						dragData={{
							id: `text-preset-${preset.id}`,
							type: DEFAULTS.text.element.type,
							name: preset.name,
							content:
								typeof preset.params.content === "string"
									? preset.params.content
									: preset.name,
							params: buildPresetTextParams({ preset }),
						}}
						aspectRatio={1}
						onAddToTimeline={({ currentTime }) =>
							handleAddPreset({ preset, currentTime })
						}
						shouldShowLabel
					/>
				))}
			</div>
		</PanelView>
	);
}
