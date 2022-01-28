import CommandHandler from "../../handler";
import { findFromVariable } from "../../utils";
import {
    findActiveActor,
    onSuggestionActive,
    getActiveSkillsByName,
} from "./utils";

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 3) {
        handler.log("Usage: /removeskill [actor] [name]");
        return;
    }

    const actor = findActiveActor(args[1]);
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
        handler.log(`Skill "${args[2]}" not found`, "red");
        return;
    }

    const index = actor._equippedSkills.indexOf(skill.id);
    if (index > -1) {
        actor._equippedSkills.splice(index, 1);
        handler.log(
            `Removed Skill ${skill.name} from ${actor._characterName}`,
        );
    }
};

const onSuggestion = (args: string[]) => {
    if (args.length === 2) {
        return onSuggestionActive(args);
    }
    if (args.length === 3) {
        return getActiveSkillsByName(args[1]);
    }

    return [];
};

export default { onCommand, onSuggestion };
