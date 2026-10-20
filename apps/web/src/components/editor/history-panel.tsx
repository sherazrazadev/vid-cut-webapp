"use client";

import { invokeAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useEditor } from "@/editor/use-editor";
import { useEditorChromeStore } from "@/editor/chrome-store";
import { cn } from "@/utils/ui";
import { LeftToRightListBulletIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function HistoryPanel() {
	const historyOpen = useEditorChromeStore((s) => s.historyOpen);
	const setHistoryOpen = useEditorChromeStore((s) => s.setHistoryOpen);
	const editor = useEditor();
	const revision = useEditor((e) => e.command.getRevision());
	const view = editor.command.getHistoryView();

	return (
		<Popover
			open={historyOpen}
			onOpenChange={(open) => setHistoryOpen({ open })}
		>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Action history"
					title="Action history"
				>
					<HugeiconsIcon icon={LeftToRightListBulletIcon} />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-72 p-2" key={revision}>
				<div className="text-muted-foreground px-2 py-1 text-xs font-medium tracking-wide uppercase">
					History
				</div>
				<div className="scrollbar-thin max-h-72 overflow-y-auto">
					<button
						type="button"
						className={cn(
							"hover:bg-accent flex w-full rounded-sm px-2 py-1.5 text-left text-sm",
							view.currentIndex === 0 && "bg-accent",
						)}
						onClick={() => editor.command.restoreTo({ index: 0 })}
					>
						Start
					</button>
					{view.entries.map((entry, index) => {
						const entryIndex = index + 1;
						const isFuture = entryIndex > view.currentIndex;
						const isCurrent = entryIndex === view.currentIndex;
						return (
							<button
								key={entry.id}
								type="button"
								className={cn(
									"hover:bg-accent flex w-full rounded-sm px-2 py-1.5 text-left text-sm",
									isCurrent && "bg-accent",
									isFuture && "text-muted-foreground",
								)}
								onClick={() => editor.command.restoreTo({ index: entryIndex })}
							>
								{entry.label}
							</button>
						);
					})}
				</div>
				<div className="text-muted-foreground flex justify-end gap-1 px-1 pt-1">
					<Button
						variant="ghost"
						size="sm"
						disabled={!editor.command.canUndo()}
						onClick={() => invokeAction("undo")}
					>
						Undo
					</Button>
					<Button
						variant="ghost"
						size="sm"
						disabled={!editor.command.canRedo()}
						onClick={() => invokeAction("redo")}
					>
						Redo
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
