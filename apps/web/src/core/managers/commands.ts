import type { EditorCore } from "@/core";
import type { Command, CommandResult } from "@/commands";
import type { EditorSelectionSnapshot } from "@/selection/editor-selection";
import { applyRippleAdjustments, computeRippleAdjustments } from "@/ripple";
import type { SceneTracks } from "@/timeline/types";

export const MAX_COMMAND_HISTORY = 100;

export interface HistoryListEntry {
	id: number;
	label: string;
}

export interface CommandHistoryView {
	currentIndex: number;
	entries: HistoryListEntry[];
}

interface CommandHistoryEntry {
	id: number;
	command: Command;
	previousSelection: EditorSelectionSnapshot;
	selectionOverride?: EditorSelectionSnapshot;
}

export class CommandManager {
	public isRippleEnabled = false;
	private history: CommandHistoryEntry[] = [];
	private redoStack: CommandHistoryEntry[] = [];
	private reactors: Array<() => void> = [];
	private listeners = new Set<() => void>();
	private nextId = 1;
	private revision = 0;

	constructor(private editor: EditorCore) {}

	execute({ command }: { command: Command }): Command {
		const beforeTracks = this.isRippleEnabled
			? (this.editor.scenes.getActiveSceneOrNull()?.tracks ?? null)
			: null;
		const previousSelection = this.getSelectionSnapshot();
		const result = command.execute();
		this.applyRippleIfEnabled({ beforeTracks });
		const selectionOverride = this.applySelectionOverride(result);
		this.runReactors();
		this.history.push({
			id: this.nextId++,
			command,
			previousSelection,
			selectionOverride,
		});
		this.redoStack = [];
		this.trimHistory();
		this.notify();
		return command;
	}

	push({ command }: { command: Command }): void {
		this.history.push({
			id: this.nextId++,
			command,
			previousSelection: this.getSelectionSnapshot(),
		});
		this.redoStack = [];
		this.trimHistory();
		this.notify();
	}

	registerReactor(reactor: () => void): void {
		this.reactors.push(reactor);
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	undo(): void {
		if (this.history.length === 0) return;
		const entry = this.history.pop();
		if (!entry) {
			return;
		}

		entry.command.undo();
		// Only restore selection for commands that explicitly changed it.
		// Commands without selection intent leave selection untouched,
		// preserving any UI-driven selection changes (clicks, box select)
		// that happened between commands. Commands that remove editor-owned
		// selection targets must declare a selection override to clear stale refs.
		if (entry.selectionOverride !== undefined) {
			this.editor.selection.restoreSnapshot({
				snapshot: entry.previousSelection,
			});
		}
		this.redoStack.push(entry);
		this.runReactors();
		this.notify();
	}

	redo(): void {
		if (this.redoStack.length === 0) return;
		const entry = this.redoStack.pop();
		if (!entry) {
			return;
		}

		const beforeTracks = this.isRippleEnabled
			? (this.editor.scenes.getActiveSceneOrNull()?.tracks ?? null)
			: null;
		const previousSelection = this.getSelectionSnapshot();
		const result = entry.command.redo();
		this.applyRippleIfEnabled({ beforeTracks });
		const selectionOverride = this.applySelectionOverride(result);
		this.runReactors();

		this.history.push({
			id: entry.id,
			command: entry.command,
			previousSelection,
			selectionOverride,
		});
		this.notify();
	}

	canUndo(): boolean {
		return this.history.length > 0;
	}

	canRedo(): boolean {
		return this.redoStack.length > 0;
	}

	getRevision(): number {
		return this.revision;
	}

	getHistoryView(): CommandHistoryView {
		const undoEntries = this.history.map((entry) => ({
			id: entry.id,
			label: entry.command.label,
		}));
		const redoEntries = [...this.redoStack].reverse().map((entry) => ({
			id: entry.id,
			label: entry.command.label,
		}));
		return {
			currentIndex: undoEntries.length,
			entries: [...undoEntries, ...redoEntries],
		};
	}

	restoreTo({ index }: { index: number }): void {
		const target = Math.max(0, Math.min(index, this.history.length + this.redoStack.length));
		while (this.history.length > target) {
			this.undo();
		}
		while (this.history.length < target) {
			this.redo();
		}
	}

	clear(): void {
		this.history = [];
		this.redoStack = [];
		this.notify();
	}

	private trimHistory(): void {
		while (this.history.length > MAX_COMMAND_HISTORY) {
			this.history.shift();
		}
	}

	private notify(): void {
		this.revision += 1;
		for (const listener of this.listeners) {
			listener();
		}
	}

	private getSelectionSnapshot(): EditorSelectionSnapshot {
		return this.editor.selection.getSnapshot();
	}

	private applySelectionOverride(
		result: CommandResult | undefined,
	): EditorSelectionSnapshot | undefined {
		if (!result?.selection) {
			return undefined;
		}
		return this.editor.selection.applySelectionPatch({
			patch: result.selection,
		});
	}

	private runReactors(): void {
		for (const reactor of this.reactors) {
			reactor();
		}
	}

	private applyRippleIfEnabled({
		beforeTracks,
	}: {
		beforeTracks: SceneTracks | null;
	}): void {
		if (!this.isRippleEnabled || !beforeTracks) {
			return;
		}

		const afterTracks = this.editor.scenes.getActiveSceneOrNull()?.tracks;
		if (!afterTracks) {
			return;
		}
		const adjustments = computeRippleAdjustments({
			beforeTracks,
			afterTracks,
		});
		if (adjustments.length === 0) {
			return;
		}

		const tracksWithRipple = applyRippleAdjustments({
			tracks: afterTracks,
			adjustments,
		});
		this.editor.timeline.updateTracks(tracksWithRipple);
	}
}
