import type { EditorSelectionPatch } from "@/selection/editor-selection";
import type { ElementRef } from "@/timeline/types";

export interface CommandResult {
	selection?: EditorSelectionPatch;
}

export function createElementSelectionResult(
	selectedElements: ElementRef[],
): CommandResult {
	return {
		selection: {
			selectedElements,
			selectedKeyframes: [],
			keyframeSelectionAnchor: null,
			selectedMaskPoints: null,
		},
	};
}

export function commandLabelFromName({ name }: { name: string }): string {
	const withoutSuffix = name.replace(/Command$/, "");
	const spaced = withoutSuffix
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.trim();
	return spaced.length > 0 ? spaced : "Edit";
}

export abstract class Command {
	readonly label: string;

	constructor({ label }: { label?: string } = {}) {
		this.label = label ?? commandLabelFromName({ name: this.constructor.name });
	}

	abstract execute(): CommandResult | undefined;

	undo(): void {
		throw new Error("Undo not implemented for this command");
	}

	redo(): CommandResult | undefined {
		return this.execute();
	}
}
