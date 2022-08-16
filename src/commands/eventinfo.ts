import CommandHandler from "../handler";
import { isValidInteger, mergeIDAndName } from "../utils";

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/eventinfo [id | name]");
        return;
    }

    const parsedValue = parseInt(args[1]);
    if (!isValidInteger(parsedValue)) {
        handler.log("Expected an integer", "red");
        return;
    }

    const event = $gameMap._events[parsedValue] as
        | Game_Event
        | undefined;
    if (event === undefined) {
        handler.log(`Event ${args[1]} not found.`, "red");
        return;
    }

    const inner = event.event();
    handler.log(`Event: ${inner.name}`);
    handler.log(`Note: ${inner.note}`);
    handler.log(`X: ${event.x}`);
    handler.log(`Y: ${event.y}`);
    handler.log(`Erased: ${event._erased}`);
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        const values = [];
        for (let i = 1; i < $gameMap._events.length; ++i)
            if ($gameMap._events[i])
                values.push(
                    mergeIDAndName(
                        i,
                        $gameMap._events[i].characterName(),
                    ),
                );

        return values;
    }

    return [];
};

export default { onCommand, onSuggestion };
