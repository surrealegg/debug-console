import CommandHandler from "../handler";
import { findFromVariable } from "../utils";

let namedEvents: string[] | null = null;

const getEventsByName = (): string[] => {
    if (namedEvents !== null) {
        return namedEvents;
    }
    namedEvents = [];
    for (let i = 0; i < $dataCommonEvents.length; ++i) {
        if (
            $dataCommonEvents[i] !== null &&
            $dataCommonEvents[i].name.length > 0
        ) {
            namedEvents.push($dataCommonEvents[i].name);
        }
    }
    return namedEvents;
};

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/event [name]");
        return;
    }

    const event = findFromVariable(
        $dataCommonEvents,
        args[1],
        "name",
    ) as IDataCommonEvent | null;
    if (event === null) {
        handler.log(`Event "${args[1]}" not found.`);
        return;
    }

    if (
        !(
            SceneManager._scene instanceof Scene_Map ||
            SceneManager._scene instanceof Scene_Battle
        )
    ) {
        SceneManager.push(Scene_Map);
    }
    $gameTemp.reserveCommonEvent(event.id);
    handler.setConsole(false);
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getEventsByName();
    }
    return [];
};

export default { onCommand, onSuggestion };
