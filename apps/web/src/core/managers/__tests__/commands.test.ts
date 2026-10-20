import { describe, expect, it } from "bun:test";
import { Command } from "@/commands/base-command";
import type { EditorCore } from "@/core";
import type { EditorSelectionSnapshot } from "@/selection/editor-selection";
import {
	CommandManager,
	MAX_COMMAND_HISTORY,
} from "@/core/managers/commands";

const EMPTY_SELECTION: EditorSelectionSnapshot = {
	selectedElements: [],
	selectedKeyframes: [],
	keyframeSelectionAnchor: null,
	selectedMaskPoints: null,
};

class FakeCommand extends Command {
	executed = 0;
	undone = 0;

	constructor(label?: string) {
		super(label ? { label } : undefined);
	}

	execute() {
		this.executed += 1;
		return undefined;
	}

	undo() {
		this.undone += 1;
	}

	redo() {
		this.executed += 1;
		return undefined;
	}
}

function createManager() {
	const editor = {
		scenes: {
			getActiveSceneOrNull: () => null,
		},
		selection: {
			getSnapshot: () => EMPTY_SELECTION,
			restoreSnapshot: () => {},
			applySelectionPatch: () => undefined,
		},
		timeline: {
			updateTracks: () => {},
		},
	} as unknown as EditorCore;

	return new CommandManager(editor);
}

describe("CommandManager history", () => {
	it("undoes and redoes in order", () => {
		const manager = createManager();
		const first = new FakeCommand("First");
		const second = new FakeCommand("Second");

		manager.execute({ command: first });
		manager.execute({ command: second });

		expect(manager.canUndo()).toBe(true);
		manager.undo();
		expect(second.undone).toBe(1);
		expect(manager.canRedo()).toBe(true);

		manager.redo();
		expect(second.executed).toBe(2);
		expect(manager.canRedo()).toBe(false);
	});

	it("caps the undo stack", () => {
		const manager = createManager();
		for (let i = 0; i < MAX_COMMAND_HISTORY + 5; i++) {
			manager.execute({ command: new FakeCommand(`Edit ${i}`) });
		}

		const view = manager.getHistoryView();
		expect(view.entries.length).toBe(MAX_COMMAND_HISTORY);
		expect(view.currentIndex).toBe(MAX_COMMAND_HISTORY);
		expect(view.entries[0]?.label).toBe("Edit 5");
	});

	it("restores to a history index", () => {
		const manager = createManager();
		manager.execute({ command: new FakeCommand("A") });
		manager.execute({ command: new FakeCommand("B") });
		manager.execute({ command: new FakeCommand("C") });

		manager.restoreTo({ index: 1 });
		expect(manager.getHistoryView().currentIndex).toBe(1);
		expect(manager.getHistoryView().entries.map((entry) => entry.label)).toEqual([
			"A",
			"B",
			"C",
		]);

		manager.restoreTo({ index: 3 });
		expect(manager.getHistoryView().currentIndex).toBe(3);
		expect(manager.canRedo()).toBe(false);
	});

	it("runs reactors on undo", () => {
		const manager = createManager();
		let reactorCount = 0;
		manager.registerReactor(() => {
			reactorCount += 1;
		});

		manager.execute({ command: new FakeCommand("A") });
		expect(reactorCount).toBe(1);
		manager.undo();
		expect(reactorCount).toBe(2);
	});

	it("notifies subscribers", () => {
		const manager = createManager();
		let ticks = 0;
		const unsubscribe = manager.subscribe(() => {
			ticks += 1;
		});

		manager.execute({ command: new FakeCommand("A") });
		manager.undo();
		unsubscribe();
		manager.redo();
		expect(ticks).toBe(2);
		expect(manager.getRevision()).toBe(3);
	});
});
