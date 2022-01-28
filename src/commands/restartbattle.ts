import CommandHandler from "../handler";

export default {
    onCommand: (handler: CommandHandler) => {
        BattleManager.processRetry();
        handler.setConsole(false);
    },
    onSuggestion: null,
};
