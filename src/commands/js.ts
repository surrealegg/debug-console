import type CommandHandler from "../handler";

export default {
    onCommand: (handler: CommandHandler, args: string[]) => {
        args.splice(0, 1);
        try {
            handler.log((0, eval)(args.join(" ")));
        } catch (e) {
            handler.log(e, "red");
        }
    },
    onSuggestion: null,
};
