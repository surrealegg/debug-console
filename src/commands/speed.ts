import CommandHandler from "../handler";
import { isValidNumber } from "../utils";

export default {
    onCommand: (handler: CommandHandler, args: string[]) => {
        let speed = 4;
        if (args.length > 1) {
            const value = parseInt(args[1]);
            if (isValidNumber(value)) speed = value;
        }
        $gamePlayer._moveSpeed = speed;
        handler.log(`Setting player's speed to ${speed}`);
    },
    onSuggestion: null,
};
