import CommandHandler from "../handler";

export default {
    onCommand: (handler: CommandHandler) => {
        if (!$gameParty.inBattle()) {
            handler.log("Player must be in battle.", "red");
            return;
        }
        handler.toggleConsole();
        BattleManager.endBattle(0);
    },
    onSuggestion: null,
};
