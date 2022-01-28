import CommandHandler from "../handler";
import { addQuotes } from "../utils";

let namedVariables: string[] | null = null;

const getVariablesByName = (): string[] => {
    if (namedVariables !== null) {
        return namedVariables;
    }
    namedVariables = [];
    for (let i = 0; i < $dataSystem.variables.length; ++i) {
        if ($dataSystem.variables[i].length > 0) {
            namedVariables.push(addQuotes($dataSystem.variables[i]));
        }
    }
    return namedVariables;
};

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/variable [name] [value]");
        return;
    }
    const variable = $dataSystem.variables.indexOf(args[1]);
    if (variable === -1) {
        handler.log(`"${args[1]}" not found.`);
        return;
    }
    if (args.length === 2) {
        handler.log(
            `"${args[1]}" = ${$gameVariables.value(variable)}`,
        );
        return;
    }

    $gameVariables.setValue(variable, args[2]);
    handler.log(
        `"${args[1]}" is set to ${$gameVariables.value(variable)}`,
    );
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getVariablesByName();
    }
    return [];
};

export default { onCommand, onSuggestion };
