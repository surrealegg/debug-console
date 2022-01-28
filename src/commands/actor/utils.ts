import { findFromVariable, mergeIDAndName } from "../../utils";

let actors: string[] | null = null;

const getActorsByName = (): string[] => {
    if (actors !== null) {
        return actors;
    }
    actors = [];
    for (let i = 1; i < $dataActors.length; ++i) {
        if ($dataActors[i].characterName.length > 0) {
            actors.push(
                mergeIDAndName(i, $dataActors[i].characterName),
            );
        }
    }
    return actors;
};

const findActiveActor = (name: string): Game_Actor | null => {
    return findFromVariable(
        $gameParty.allMembers(),
        name,
        "_characterName",
        "_actorId",
    );
};

const getActiveActorsByName = (): string[] => {
    const result: string[] = [];
    const activeMembers = $gameParty ? $gameParty.allMembers() : [];
    for (let i = 0; i < activeMembers.length; ++i) {
        result.push(
            mergeIDAndName(
                activeMembers[i]._actorId,
                activeMembers[i]._characterName,
            ),
        );
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

const getActiveSkillsByName = (name: string): string[] => {
    const result: string[] = [];
    const actor = findActiveActor(name);
    if (!actor) {
        return result;
    }

    for (let i = 0; i < actor._equippedSkills.length; ++i) {
        const id = actor._equippedSkills[i];
        if (id > 0) {
            result.push(
                mergeIDAndName(
                    id,
                    $dataSkills[id]
                        ? $dataSkills[id].name
                        : "Unknown",
                ),
            );
        }
    }
    return result;
};

export {
    onSuggestion,
    findActiveActor,
    onSuggestionValue,
    onSuggestionActive,
    getActiveSkillsByName,
};
