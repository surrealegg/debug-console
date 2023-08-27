import type CommandHandler from "../handler";
import fs = require("fs");
import path = require("path");
import { addQuotes, isValidNumber } from "../utils";

let namedBGM: string[] | null = null;
const base = path.dirname(
    process.mainModule ? process.mainModule.filename : ".",
);

const getBGMByName = (): string[] => {
    if (namedBGM !== null) {
        return namedBGM;
    }
    namedBGM = [];
    fs.readdirSync(`${base}/audio/bgm`).forEach((file) => {
        namedBGM?.push(
            addQuotes(file.substring(0, file.indexOf("."))),
        );
    });
    return namedBGM;
};

const onCommand = (handler: CommandHandler, args: string[]): void => {
    // Check if argument passed
    if (args.length < 2) {
        handler.log(
            "Usage: /bgm [name] [volume = 100] [pitch = 100]",
        );
        return;
    }

    let volume = parseInt(args[2]);
    let pitch = parseInt(args[3]);
    if (!isValidNumber(volume)) {
        volume = 100;
    }
    if (!isValidNumber(pitch)) {
        pitch = 100;
    }

    const bgmExension = Utils.isOptionValid("test")
        ? "ogg"
        : "rpgmvo";
    if (
        !fs.existsSync(`${base}/audio/bgm/${args[1]}.${bgmExension}`)
    ) {
        handler.log(`BGM ${args[1]} not found.`, "red");
        return;
    }

    handler.log(
        `Playing "${args[1]}" with volume ${volume} and pitch ${pitch}`,
    );
    AudioManager.stopAll();
    AudioManager.playBgm(
        {
            name: args[1],
            volume,
            pitch,
            pan: 0,
            pos: 0,
        },
        0,
    );
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getBGMByName();
    }
    if (args.length === 3 || args.length === 4) {
        return ["100"];
    }
    return [];
};

export default { onCommand, onSuggestion };
