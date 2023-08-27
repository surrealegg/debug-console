import type CommandHandler from "../handler";
import { isValidNumber } from "../utils";

declare let Galv: {
    ASPLASH: { splashed: boolean };
};

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/load [saveid]");
        return;
    }

    const id = parseInt(args[1]);

    if (!isValidNumber(id)) {
        handler.log("Expected a number", "red");
        return;
    }

    // Check whenever splash screen is played, because
    // It will go back to the splash screen if it's not finished.
    if (!Galv.ASPLASH.splashed) {
        handler.log(
            "Can not load a save file during splash screen.",
            "red",
        );
        return;
    }

    // FIXME: This solution seems pretty hacky and it would be
    // nice to find a better solution.
    // The issue is that if the player is teleporting from Scene_Map
    // it crashes because this.event() on YEP_SaveEventLocations is undefined.
    // So the soultion is to move to an empty scene wait for a bit and teleport to
    // a new scene.
    if (DataManager.loadGame(id)) {
        handler.setConsole(false);
        SceneManager.goto(Scene_Base);
        SoundManager.playLoad();
        handler.log(`Loaded save file ${id}`);
        setTimeout(() => {
            if (DataManager.loadGame(id)) {
                ConfigManager.save();
                if (
                    $gameSystem.versionId() !== $dataSystem.versionId
                ) {
                    $gamePlayer.reserveTransfer(
                        $gameMap.mapId(),
                        $gamePlayer.x,
                        $gamePlayer.y,
                        0,
                        0,
                    );
                    $gamePlayer.requestMapReload();
                }

                try {
                    $gameSystem.onAfterLoad();
                } catch (e) {
                    handler.log(
                        `Warning: $gameSystem.onAfterLoad throwed an error:\n${e.stack}`,
                        "yellow",
                    );
                }

                SceneManager.push(Scene_Map);
            }
        }, 100);
        return;
    }
    handler.log(`Failed to load gamefile ${id}`, "red");
};

const onSuggestion = null;

export default { onCommand, onSuggestion };
