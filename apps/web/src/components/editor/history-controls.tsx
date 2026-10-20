"use client";

import { invokeAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { HistoryPanel } from "@/components/editor/history-panel";
import { useEditor } from "@/editor/use-editor";
import { Redo02Icon, Undo02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function HistoryControls() {
	const canUndo = useEditor((e) => e.command.canUndo());
	const canRedo = useEditor((e) => e.command.canRedo());

	return (
		<div className="flex items-center gap-0.5">
			<Button
				variant="ghost"
				size="icon"
				disabled={!canUndo}
				aria-label="Undo"
				title="Undo"
				onClick={() => invokeAction("undo")}
			>
				<HugeiconsIcon icon={Undo02Icon} />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				disabled={!canRedo}
				aria-label="Redo"
				title="Redo"
				onClick={() => invokeAction("redo")}
			>
				<HugeiconsIcon icon={Redo02Icon} />
			</Button>
			<HistoryPanel />
		</div>
	);
}
