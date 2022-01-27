import CommandHandler from "../../handler";
import { findFromVariable } from "../../utils";
import { onSuggestionActive } from "./utils";

let namedSkills: string[] | null = null;

const getSkillsByName = (): string[] => {
    if (namedSkills !== null) {
        return namedSkills;
    }
    namedSkills = [];
    for (let i = 1; i < $dataSkills.length; ++i) {
        namedSkills.push($dataSkills[i].name);
    }
    return namedSkills;
};

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 3) {
        handler.log("Usage: /skill [actor] [name]");
        return;
    }

    const actor = findFromVariable(
        $gameParty.allMembers(),
        args[1],
        "_characterName",
    ) as Game_Actor | null;
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    const skill = findFromVariable(
        $dataSkills,
        args[2],
        "name",
    ) as IDataSkill | null;
    if (skill === null) {
        handler.log(`Skill ${args[2]} not found`, "red");
        return;
    }

    if (!actor._skills.includes(skill.id)) {
        actor._equippedSkills.push(skill.id);
        handler.log(
            `Added Skill ${skill.name} for ${actor._characterName}`,
        );
    }
};

const onSuggestion = (args: string[]) => {
    if (args.length === 2) {
        return onSuggestionActive(args);
    }
    if (args.length === 3) {
        return getSkillsByName();
    }
    return [];
};

export default { onCommand, onSuggestion };