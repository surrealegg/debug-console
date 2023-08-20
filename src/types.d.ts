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

    interface Game_Map {
        clearMapFogs(): void;
    }

    interface Game_BattlerBase {
        _extraTraits: IDataTrait[];

        setExtraTrait(
            code: number,
            dataId: number,
            value: number,
        ): void;
    }

    interface Game_Party {
        _stressEnergyCount: number;
    }
}
