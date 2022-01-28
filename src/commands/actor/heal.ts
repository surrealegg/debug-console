import CommandHandler from "../../handler";
import {
    findActiveActor,
    onSuggestionActive as onSuggestion,
} from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {
    if (args.length < 2) {
        handler.log("Usage: /heal [name]");
        return;
    }

    const actor = findActiveActor(args[1]);
    if (actor === null) {
        handler.log(`Actor "${args[1]}" not found`, "red");
        return;
    }

    actor.setHp(actor.mhp);
    actor.setMp(actor.mmp);
    handler.log(`${actor._characterName} has been healed!`);
};

export default { onCommand, onSuggestion };
