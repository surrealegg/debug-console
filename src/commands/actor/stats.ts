import CommandHandler from "../../handler";
import { isValidInteger } from "../../utils";
import { findActiveActor, onSuggestionActive } from "./utils";

type Property = {
    get: (actor: Game_Actor) => number;
    set: (actor: Game_Actor, value: number) => void;
};

type Properties = {
    [key: string]: Property;
};

const changeTypes = ["set", "add", "subtract"];

// @ts-expect-error: Intended to override Game_Actor
Game_Actor = class extends Game_Actor {
    setup(actorId: number): void {
        super.setup(actorId);
        this._extraTraits = [];
    }

    allTraits(): IDataTrait[] {
        if (this._extraTraits) {
            return [...super.allTraits(), ...this._extraTraits];
        }

        return super.allTraits();
    }

    setExtraTrait(code: number, dataId: number, value: number) {
        if (!this._extraTraits) {
            this._extraTraits = [];
        }

        for (const trait of this._extraTraits) {
            if (trait.code === code && trait.dataId === dataId) {
                trait.value = value;
                return;
            }
        }

        this._extraTraits.push({ code, dataId, value });
    }
};

const makeParamProperty = (param: number): Property => ({
    set: (actor, value) => (actor._paramPlus[param] = value),
    get: (actor) => actor.param(param),
});

const makeXParamProperty = (param: number): Property => ({
    set: (actor, value) => {
        actor.setExtraTrait(
            Game_BattlerBase.TRAIT_XPARAM,
            param,
            value,
        );
    },
    get: (actor) => actor.xparam(param),
});

const properties: Properties = {
    level: {
        set: (actor, value) => {
            const prev = actor._level;
            actor._level = value;
            if (value > prev) {
                actor.currentClass().learnings.forEach(function (
                    learning,
                ) {
                    if (learning.level === actor._level) {
                        actor.learnSkill(learning.skillId);
                    }
                }, actor);
            }
        },
        get: (actor) => actor._level,
    },
    heart: {
        set: (actor, value) => actor.setHp(value),
        get: (actor) => actor.hp,
    },
    juice: {
        set: (actor, value) => actor.setMp(value),
        get: (actor) => actor.mp,
    },
    tp: {
        set: (actor, value) => actor.setTp(value),
        get: (actor) => actor.tp,
    },
    max_heart: makeParamProperty(0),
    max_juice: makeParamProperty(1),
    attack: makeParamProperty(2),
    defence: makeParamProperty(3),
    max_attack: makeParamProperty(4),
    max_defence: makeParamProperty(5),
    speed: makeParamProperty(6),
    luck: makeParamProperty(7),
    hit_rate: makeXParamProperty(0),
};

const types = Object.keys(properties);

const onCommand = (handler: CommandHandler, args: string[]): void => {
    if (args.length < 3) {
        handler.log(
            "Usage: /stats [actor] [name] ['set'|'add'|'subtract'] [value]",
        );
        return;
    }

    const actor = findActiveActor(args[1]);
    if (actor === null) {
        handler.log(`Actor ${args[1]} not found`, "red");
        return;
    }

    const stat = args[2];
    if (!types.includes(stat)) {
        handler.log(`Invalid stat ${stat}`, "red");
        return;
    }

    const name = actor.name();
    const nameDirection = name.toLowerCase().endsWith("s")
        ? name + "'"
        : name + "'s";
    const currentPropery = properties[stat].get(actor);

    if (args.length === 3) {
        handler.log(`${nameDirection} ${stat}: ${currentPropery}`);
        return;
    }

    const changeType = args[3];
    if (!changeTypes.includes(changeType)) {
        handler.log(`Invalid type ${changeType}`, "red");
        return;
    }

    const value = parseInt(args[4]);
    if (!isValidInteger(value)) {
        handler.log("Expected a number", "red");
        return;
    }

    properties[stat].set(actor, value);
    handler.log(
        `Changed ${nameDirection} ${stat} from ${currentPropery} to ${value}`,
    );
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 3) {
        return types;
    }

    if (args.length === 4) {
        return changeTypes;
    }

    return onSuggestionActive(args);
};

export default { onCommand, onSuggestion };
