import type CommandHandler from "../handler";
import { addQuotes } from "../utils";

let namedSwitches: string[] | null = null;

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/switch [name] [on | off]");
        return;
    }
    const id = $dataSystem.switches.indexOf(args[1]);
    if (id === -1) {
        handler.log(`Switch "${args[2]}" not found`, "red");
        return;
    }
    if (args.length === 2) {
        handler.log(
            `"${args[1]}" = ${
                $gameSwitches._data[id] === true ? "on" : "off"
            }`,
        );
        return;
    }
    if (!["on", "off"].contains(args[2])) {
        handler.log(`Expected on or off got ${args[2]}`, "red");
        return;
    }
    $gameSwitches.setValue(id, args[2] === "on");
    handler.log(`"${args[1]}" is set to ${args[2]}`);
};

const getSwitchesByName = (): string[] => {
    if (namedSwitches !== null) {
        return namedSwitches;
    }
    namedSwitches = [];
    for (let i = 0; i < $dataSystem.switches.length; ++i) {
        if ($dataSystem.switches[i].length > 0) {
            namedSwitches.push(addQuotes($dataSystem.switches[i]));
        }
    }
    return namedSwitches;
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getSwitchesByName();
    }
    if (args.length === 3) {
        return ["on", "off"];
    }
    return [];
};

export default { onCommand, onSuggestion };
