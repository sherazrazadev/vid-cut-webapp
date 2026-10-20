import { create } from "zustand";

interface EditorChromeState {
	shortcutsOpen: boolean;
	historyOpen: boolean;
	setShortcutsOpen: ({ open }: { open: boolean }) => void;
	setHistoryOpen: ({ open }: { open: boolean }) => void;
}

export const useEditorChromeStore = create<EditorChromeState>((set) => ({
	shortcutsOpen: false,
	historyOpen: false,
	setShortcutsOpen: ({ open }) => set({ shortcutsOpen: open }),
	setHistoryOpen: ({ open }) => set({ historyOpen: open }),
}));
