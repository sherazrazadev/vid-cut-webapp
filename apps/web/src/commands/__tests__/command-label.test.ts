import { describe, expect, it } from "bun:test";
import { Command, commandLabelFromName } from "@/commands/base-command";
import { BatchCommand } from "@/commands/batch-command";

class DeleteElementsCommand extends Command {
	execute() {
		return undefined;
	}
}

describe("commandLabelFromName", () => {
	it("splits PascalCase and drops Command suffix", () => {
		expect(
			commandLabelFromName({ name: "DeleteElementsCommand" }),
		).toBe("Delete Elements");
		expect(commandLabelFromName({ name: "SplitElementsCommand" })).toBe(
			"Split Elements",
		);
	});
});

describe("Command labels", () => {
	it("defaults label from class name", () => {
		expect(new DeleteElementsCommand().label).toBe("Delete Elements");
	});

	it("uses Multiple edits for batch commands", () => {
		const batch = new BatchCommand([
			new DeleteElementsCommand(),
			new DeleteElementsCommand(),
		]);
		expect(batch.label).toBe("Multiple edits");
	});
});
