import CommandHandler from "../../handler";
import { findFromVariable, isValidInteger } from "../../utils";
import { onSuggestionValue as onSuggestion } from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {

    if (args.length < 3) {
        handler.log("Usage: /hp [name] [value]");
        return;
    }

    const actor = findFromVariable(
        $gameParty.allMembers(),
        args[1],
        "_characterName"
    );
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    const value = args[2] === "max" ? actor.mhp : parseInt(args[2]);
    if (isValidInteger(value)) {
        actor.setHp(value);
        handler.log(`Set ${actor._characterName}'s HP to ${value}`);
        return;
    }
    handler.log(`${value} is not a valid integer`, "red");
};

export default { onCommand, onSuggestion };
