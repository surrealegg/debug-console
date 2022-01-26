/// <reference types="rpgmakermv_typescript_dts" />

import CommandHandler from "./handler";

export {};

declare global {
    const Imported: {
        [plugin: string]: boolean;
    };

    interface Window {
        commands: CommandHandler;
    }

    interface Game_Actor {
        _equippedSkills: number[];
    }

    interface Game_Enemy {
        setTroopId(id: number): void;
        setTroopMemberId(id: number): void;
    }

    interface Game_Troop {
        _newEnemies: Game_Enemy[];
        addTroopReinforcementsWithRelativePosition(
            troopId: number,
            x: number,
            y: number,
        ): void;
    }

    interface Game_Temp {
        _previousTeleportX: number;
        _previousTeleportY: number;
        _previousTeleportMap: number;
    }

    interface Game_Variables {
        setValue(name: string, value: string | number): void;
    }
}
