import CommandHandler from "../../handler";
import { isValidInteger } from "../../utils";
import {
    findActiveActor,
    onSuggestionActive as onSuggestion,
} from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {
    if (args.length < 3) {
        handler.log("Usage: /level [name] [value]");
        return;
    }

    const actor = findActiveActor(args[1]);
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    const value = parseInt(args[2]);
    if (isValidInteger(value)) {
        actor._level = value;
        handler.log(`Set ${actor._characterName}'s MP to ${value}`);
        return;
    }
    handler.log(`${value} is not a valid integer`, "red");
};

export default { onCommand, onSuggestion };
