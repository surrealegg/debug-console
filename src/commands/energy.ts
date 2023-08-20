import CommandHandler from "../handler";
import { isValidInteger } from "../utils";

export default {
    onCommand: (handler: CommandHandler, args: string[]) => {
        // Check if argument passed
        if (args.length < 2) {
            handler.log(
                "Energy count: " + $gameParty._stressEnergyCount,
            );
            return;
        }

        const rawValue = parseInt(args[1]);
        if (!isValidInteger(rawValue)) {
            handler.log("Expected a number between 0 to 10", "red");
            return;
        }

        const value = rawValue.clamp(0, 10);
        $gameParty._stressEnergyCount = value;
        handler.log("Energy count has been set to " + value);
    },
    onSuggestion: null,
};
