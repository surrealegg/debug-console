let actors: string[] | null = null;

const getActorsByName = (): string[] => {
    if (actors !== null) {
        return actors;
    }
    actors = [];
    for (let i = 1; i < $dataActors.length; ++i) {
        if ($dataActors[i].characterName.length > 0) {
            actors.push($dataActors[i].characterName);
        }
    }
    return actors;
};

const getActiveActorsByName = (): string[] => {
    const result: string[] = [];
    const activeMembers = $gameParty.allMembers();
    for (let i = 0; i < activeMembers.length; ++i) {
        result.push(activeMembers[i]._characterName);
    }
    return result;
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getActorsByName();
    }
    return [];
};

const onSuggestionActive = (args: string[]): string[] => {
    if (args.length === 2) {
        return getActiveActorsByName();
    }
    return [];
};

const onSuggestionValue = (args: string[]): string[] => {
    if (args.length === 3) {
        return ["max"];
    }
    return onSuggestionActive(args);
};

export { onSuggestion, onSuggestionValue, onSuggestionActive };
