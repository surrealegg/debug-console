import CommandHandler from "../../handler";
import { findFromVariable } from "../../utils";
import { onSuggestionActive as onSuggestion } from "./utils";

const onCommand = (handler: CommandHandler, args: string[]): void => {

    if (args.length < 2) {
        handler.log("Usage: /heal [name]");
        return;
    }

    const actor = findFromVariable(
        $gameParty.allMembers(),
        args[1],
        "_characterName"
    ) as Game_Actor | null;
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    actor.setHp(actor.mhp);
    actor.setMp(actor.mmp);
    handler.log(`${actor._characterName} has been healed!`);
};

export default { onCommand, onSuggestion };
