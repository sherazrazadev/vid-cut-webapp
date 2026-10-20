import { getPersistedKeybindingsState } from "../persisted-state";

const NEW_DEFAULTS: Record<string, string> = {
	"ctrl+x": "cut-selected",
	"ctrl+/": "open-shortcuts",
	"?": "open-shortcuts",
	"shift+/": "open-shortcuts",
	"ctrl+shift+h": "toggle-history",
};

export function v7ToV8({ state }: { state: unknown }): unknown {
	const v7 = getPersistedKeybindingsState({ state });
	if (!v7) return state;
	const keybindings = { ...v7.keybindings };

	for (const [key, action] of Object.entries(NEW_DEFAULTS)) {
		if (keybindings[key] === undefined) {
			keybindings[key] = action;
		}
	}

	return { ...v7, keybindings };
}
