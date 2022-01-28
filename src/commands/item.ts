import CommandHandler from "../handler";
import {
    addQuotes,
    findFromVariable,
    isValidInteger,
} from "../utils";

let namedItems: string[] | null = null;

const getItemsByName = (): string[] => {
    if (namedItems !== null) {
        return namedItems;
    }
    namedItems = [];
    for (let i = 1; i < $dataItems.length; ++i) {
        if ($dataItems[i].name.length > 0) {
            // FIXME: Parser does not recognize escaped strings.
            const temp = $dataItems[i].name.replace('"', "'");
            namedItems.push(addQuotes(temp));
        }
    }
    return namedItems;
};

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/item [name] [quantity | max]");
        return;
    }

    const item = findFromVariable(
        $dataItems,
        args[1],
    ) as IDataItem | null;
    if (item === null) {
        handler.log(`Item ${args[1]} not found.`);
        return;
    }

    const value =
        args[2] === "max"
            ? $gameParty.maxItems(item)
            : parseInt(args[2]);
    if (isValidInteger(value)) {
        $gameParty.gainItem(item, value, false);
        handler.log(`Quantity of ${args[1]} is set to ${value}`);
        return;
    }
    handler.log(`Value ${value} is not valid`);
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getItemsByName();
    }
    if (args.length === 3) {
        return ["max"];
    }
    return [];
};

export default { onCommand, onSuggestion };
