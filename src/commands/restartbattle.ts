import type CommandHandler from "../handler";

export default {
    onCommand: (handler: CommandHandler) => {
        if (!$gameParty.inBattle()) {
            handler.log("Player must be in battle.", "red");
            return;
        }
        BattleManager.processRetry();
        handler.setConsole(false);
    },
    onSuggestion: null,
};
