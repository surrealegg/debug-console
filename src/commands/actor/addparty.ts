import CommandHandler from "../../handler";
import { findFromVariable } from "../../utils";
import {
    onSuggestion as onSuggestionDefault,
    onSuggestionActive,
} from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {
    if (args.length < 2) {
        handler.log("Usage: /addparty [name]");
        return;
    }

    const actor = findFromVariable(
        $dataActors,
        args[1],
        "characterName",
    ) as IDataActor | null;
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    if ($gameParty.allMembers().length >= 4) {
        handler.log(
            "Could not have more than 4 party members.",
            "red",
        );
        return;
    }

    $gameParty.addActor(actor.id);
    handler.log(`${actor.characterName} joined the party!`);
};

const onSuggestion = (args: string[]): string[] => {
    const array1 = onSuggestionDefault(args);
    const array2 = onSuggestionActive(args);
    const unique1 = array1.filter(
        (value) => array2.indexOf(value) === -1,
    );
    const unique2 = array2.filter(
        (value) => array1.indexOf(value) === -1,
    );
    return unique1.concat(unique2);
};

export default { onCommand, onSuggestion };
