/// <reference types="rpgmakermv_typescript_dts" />

import CommandHandler, {
    CommandHandlerOnCommand,
    CommandHandlerOnSuggestion,
} from "./handler";

export {};

declare global {
    interface Window {
        commands: CommandHandler;
        __DEBUG_CONSOLE_PRELOADED_COMMANDS__?: {
            name: string;
            onCommand: CommandHandlerOnCommand;
            onSuggestion: CommandHandlerOnSuggestion | null;
        }[];
        Galv: {
            ASPLASH: { splashed: boolean };
        };
        Imported: {
            [plugin: string]: boolean;
        };
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
