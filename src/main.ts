import CommandHandler from "./handler";
import {
    AddParty,
    RemoveParty,
    Heal,
    Hp,
    Mp,
    Reload,
    Clear,
    Font,
    MapTP,
    Battle,
    EndBattle,
} from "./commands";

declare global {
    interface Window {
        commands: CommandHandler;
    }
}

window.commands = window.commands || new CommandHandler();
window.commands.add("addparty", AddParty.onCommand, AddParty.onSuggestion);
window.commands.add("removeparty", RemoveParty.onCommand, RemoveParty.onSuggestion);
window.commands.add("heal", Heal.onCommand, Heal.onSuggestion);
window.commands.add("hp", Hp.onCommand, Hp.onSuggestion);
window.commands.add("mp", Mp.onCommand, Mp.onSuggestion);
window.commands.add("reload", Reload.onCommand, Reload.onSuggestion);
window.commands.add("clear", Clear.onCommand, Clear.onSuggestion);
window.commands.add("font", Font.onCommand, Font.onSuggestion);
window.commands.add("maptp", MapTP.onCommand, MapTP.onSuggestion);
window.commands.add("battle", Battle.onCommand, Battle.onSuggestion);
window.commands.add("endbattle", EndBattle.onCommand, EndBattle.onSuggestion);
