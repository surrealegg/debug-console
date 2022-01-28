import CommandHandler from "../../handler";
import { isValidInteger } from "../../utils";
import {
    findActiveActor,
    onSuggestionValue as onSuggestion,
} from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {
    if (args.length < 3) {
        handler.log("Usage: /mp [name] [value]");
        return;
    }

    const actor = findActiveActor(args[1]);
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    const value = args[2] === "max" ? actor.mmp : parseInt(args[2]);
    if (isValidInteger(value)) {
        actor.setMp(value);
        handler.log(`Set ${actor._characterName}'s MP to ${value}`);
        return;
    }
    handler.log(`${value} is not a valid integer`, "red");
};

export default { onCommand, onSuggestion };
