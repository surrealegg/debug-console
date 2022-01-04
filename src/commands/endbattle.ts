import CommandHandler from "../handler";

const onCommand = (handler: CommandHandler) => {
    if (!$gameParty.inBattle()) {
        handler.log("Player must be in battle.", "red");
        return;
    }
    handler.toggleConsole();
    BattleManager.endBattle(0);
};

const onSuggestion = null;

export default { onCommand, onSuggestion };
