import type CommandHandler from "../handler";

export default {
    onCommand: (handler: CommandHandler, args: string[]) => {
        $gamePlayer._through =
            args.length > 1
                ? args[1] === "on"
                : !$gamePlayer._through;
        handler.log(
            `Noclip is set to ${$gamePlayer._through ? "on" : "off"}`,
        );
    },
    onSuggestion: (args: string[]) => {
        if (args.length === 2) {
            return ["on", "off"];
        }
        return [];
    },
};
