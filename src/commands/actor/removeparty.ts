import CommandHandler from "../../handler";
import { findFromVariable } from "../../utils";
import { onSuggestionActive as onSuggestion } from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {
    if (args.length < 2) {
        handler.log("Usage: /removeparty [name]");
        return;
    }

    const actor = findFromVariable(
        $dataActors,
        args[1],
        "characterName",
        "id",
    );
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    if ($gameParty.allMembers().length < 2) {
        handler.log("Could not remove the last party member.", "red");
        return;
    }

    $gameParty.removeActor(actor.id);
    handler.log(`${actor.characterName} removed from the party!`);
};

export default { onCommand, onSuggestion };
