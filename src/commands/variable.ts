import CommandHandler from "../handler";

let namedVariables: string[] | null = null;

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/variable [name] [value]");
        return;
    }
    const variable = $dataSystem.variables.indexOf(args[1]);
    if (variable === -1) {
        handler.log(`${args[1]} not found.`);
        return;
    }
    if (args.length === 2) {
        handler.log(`"${args[1]}" = ${$gameVariables.value(variable)}`);
        return;
    }
    $gameVariables.setValue(variable, args[2]);
    handler.log(
        `"${args[1]}" is set to ${$gameVariables.value(variable)}`,
    );
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        namedVariables =
            namedVariables ||
            $dataSystem.variables.filter((value) => value.length > 0);
        return namedVariables;
    }
    return [];
};

export default { onCommand, onSuggestion };
