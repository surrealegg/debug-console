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
    Event,
    Switch,
    Variable,
    Item,
    BGM,
    AddSkill,
    RemoveSkill,
    HealAll,
    JS,
    RestartBattle,
    Save,
    Load,
    SFX,
    Noclip,
    Speed,
} from "./commands";

window.commands = window.commands || new CommandHandler();
window.commands.add(
    "addparty",
    AddParty.onCommand,
    AddParty.onSuggestion,
);
window.commands.add(
    "removeparty",
    RemoveParty.onCommand,
    RemoveParty.onSuggestion,
);
window.commands.add("heal", Heal.onCommand, Heal.onSuggestion);
window.commands.add("hp", Hp.onCommand, Hp.onSuggestion);
window.commands.add("mp", Mp.onCommand, Mp.onSuggestion);
window.commands.add("reload", Reload.onCommand, Reload.onSuggestion);
window.commands.add("clear", Clear.onCommand, Clear.onSuggestion);
window.commands.add("font", Font.onCommand, Font.onSuggestion);
window.commands.add("maptp", MapTP.onCommand, MapTP.onSuggestion);
window.commands.add("battle", Battle.onCommand, Battle.onSuggestion);
window.commands.add(
    "endbattle",
    EndBattle.onCommand,
    EndBattle.onSuggestion,
);
window.commands.add("event", Event.onCommand, Event.onSuggestion);
window.commands.add("switch", Switch.onCommand, Switch.onSuggestion);
window.commands.add(
    "variable",
    Variable.onCommand,
    Variable.onSuggestion,
);
window.commands.add("item", Item.onCommand, Item.onSuggestion);
window.commands.add("bgm", BGM.onCommand, BGM.onSuggestion);
window.commands.add(
    "addskill",
    AddSkill.onCommand,
    AddSkill.onSuggestion,
);
window.commands.add(
    "removeskill",
    RemoveSkill.onCommand,
    RemoveSkill.onSuggestion,
);
window.commands.add(
    "healall",
    HealAll.onCommand,
    HealAll.onSuggestion,
);
window.commands.add("js", JS.onCommand, JS.onSuggestion);
window.commands.add(
    "restartbattle",
    RestartBattle.onCommand,
    RestartBattle.onSuggestion,
);
window.commands.add("save", Save.onCommand, Save.onSuggestion);
window.commands.add("load", Load.onCommand, Load.onSuggestion);
window.commands.add("sfx", SFX.onCommand, SFX.onSuggestion);
window.commands.add("noclip", Noclip.onCommand, Noclip.onSuggestion);
window.commands.add("speed", Speed.onCommand, Speed.onSuggestion);

Graphics.printFullError = function (
    name: string,
    message: string,
    stack: string,
): void {
    window.commands.setConsole(true);
    window.commands.log(`${name} ${message}\n${stack}`, "red");
    window.commands.log("if the game can't recover run /reload");
};
