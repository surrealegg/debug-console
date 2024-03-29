import CommandHandler from "./handler";
import AddParty from "./commands/actor/addparty";
import RemoveParty from "./commands/actor/removeparty";
import Heal from "./commands/actor/heal";
import Hp from "./commands/actor/hp";
import Mp from "./commands/actor/mp";
import AddSkill from "./commands/actor/addskill";
import RemoveSkill from "./commands/actor/removeskill";
import HealAll from "./commands/actor/healall";
import Stats from "./commands/actor/stats";
import Reload from "./commands/reload";
import Clear from "./commands/clear";
import Font from "./commands/font";
import Battle from "./commands/battle";
import EndBattle from "./commands/endbattle";
import Event from "./commands/event";
import Switch from "./commands/switch";
import Variable from "./commands/variable";
import Item from "./commands/item";
import BGM from "./commands/bgm";
import JS from "./commands/js";
import RestartBattle from "./commands/restartbattle";
import Save from "./commands/save";
import Load from "./commands/load";
import SFX from "./commands/sfx";
import Noclip from "./commands/noclip";
import Speed from "./commands/speed";
import EventInfo from "./commands/eventinfo";
import Map from "./commands/map";
import Energy from "./commands/energy";

if (!(window.commands && window.commands.isLoaded)) {
    window.commands = new CommandHandler();

    Graphics.printFullError = function (
        name: string,
        message: string,
        stack: string,
    ): void {
        window.commands.setConsole(true);
        window.commands.log(`${name} ${message}\n${stack}`, "red");
        window.commands.log("if the game can't recover run /reload");
    };
}

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
window.commands.add(
    "eventinfo",
    EventInfo.onCommand,
    EventInfo.onSuggestion,
);

// Alias
window.commands.add("maptp", Map.onCommand, Map.onSuggestion);

window.commands.add("map", Map.onCommand, Map.onSuggestion);

window.commands.add("stats", Stats.onCommand, Stats.onSuggestion);

window.commands.add("energy", Energy.onCommand, Energy.onSuggestion);
