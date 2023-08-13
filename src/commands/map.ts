import path = require("path");
import fs = require("fs");
import CommandHandler from "../handler";

let namedMaps: string[] | null = null;

import { addQuotes, findFromVariable } from "../utils";

const tempSceneBaseInitialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function () {
    tempSceneBaseInitialize.call(this);
    this._isTeleporting = false;
};

const tempSceneMapUpdateMain = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function () {
    if (this._isTeleporting) {
        $gameScreen.update();
        return;
    }
    tempSceneMapUpdateMain.call(this);
};

function getMapsbyName(): string[] {
    if (namedMaps !== null) {
        return namedMaps;
    }
    namedMaps = [];
    for (let i = 1; i < $dataMapInfos.length; ++i) {
        if ($dataMapInfos[i] !== null) {
            namedMaps.push(addQuotes($dataMapInfos[i].name));
        }
    }
    return namedMaps;
}

class TeleportScene extends Scene_Map {
    createDisplayObjects(): void {
        super.createDisplayObjects();

        this._isTeleporting = true;
        $gamePlayer.locate(
            Math.floor($dataMap.width / 2),
            Math.floor($dataMap.height / 2),
        );
    }

    update(): void {
        super.update();
        if (Input.isRepeated("up")) {
            this.movePlayer(0, -1);
            return;
        }
        if (Input.isRepeated("down")) {
            this.movePlayer(0, 1);
            return;
        }
        if (Input.isRepeated("left")) {
            this.movePlayer(-1, 0);
            return;
        }
        if (Input.isRepeated("right")) {
            this.movePlayer(1, 0);
            return;
        }
        if (Input.isTriggered("ok")) {
            SoundManager.playOk();
            SceneManager.push(Scene_Map);
            this._isTeleporting = false;
            return;
        }
        if (Input.isTriggered("cancel")) {
            SoundManager.playCancel();
            const x = $gameTemp._previousTeleportX;
            const y = $gameTemp._previousTeleportY;
            const mapId = $gameTemp._previousTeleportMap;
            $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
            SceneManager.push(Scene_Map);
            this._isTeleporting = false;
        }
    }

    movePlayer(x: number, y: number): void {
        SoundManager.playCursor();
        const dx = ($gamePlayer.x + x).clamp(0, $dataMap.width - 1);
        const dy = ($gamePlayer.y + y).clamp(0, $dataMap.height - 1);
        $gamePlayer.locate(dx, dy);
    }
}

const onCommand = (handler: CommandHandler, args: string[]): void => {
    // Check if argument passed
    if (args.length < 2) {
        const currentMap = $dataMapInfos[$gameMap._mapId];
        if (!currentMap) {
            handler.log("Unknown map", "red");
            return;
        }

        handler.log(`Id: ${currentMap.id} Name: ${currentMap.name}`);
        return;
    }

    // Check if the player is in map
    if (!SceneManager._scene._mapLoaded) {
        handler.log("Player must be in map", "red");
        return;
    }

    // Check if map exists
    const map = findFromVariable($dataMapInfos, args[1]);
    if (map === null) {
        handler.log(`Map "${args[1]}" not found`, "red");
        return;
    }

    // Check if map exists as file.
    if (!Utils.isOptionValid("test")) {
        if (process.mainModule) {
            const base = path.dirname(process.mainModule.filename);
            if (!fs.existsSync(`${base}/maps/map${map.id}.AUBREY`)) {
                handler.log(
                    `Could not teleport to "${map.name}", because ${base}/maps/map${map.id}.AUBREY is missing.`,
                    "red",
                );
                return;
            }
        }
    } else if (!fs.existsSync(`./maps/Map${map.id}.json`)) {
        handler.log(
            `Could not teleport to "${map.name}", because ./maps/Map${map.id}.json is missing.`,
            "red",
        );
        return;
    }

    // Teleports to id
    handler.log(`Teleporting to "${map.name}"`);
    $gameTemp._previousTeleportX = $gamePlayer.x;
    $gameTemp._previousTeleportY = $gamePlayer.y;
    $gameTemp._previousTeleportMap = $gameMap.mapId();
    SceneManager.push(TeleportScene);
    $gamePlayer.reserveTransfer(map.id, 0, 0, 2, 0);
    $gamePlayer.requestMapReload();

    // Closes console.
    handler.setConsole(false);

    // Clears Effects.
    $gameScreen.clear();

    // Stops music.
    AudioManager.stopAll();

    // Clears Event.
    $gameMap._interpreter.clear();

    // Unlocks the Player.
    try {
        $gamePlayer.processRouteEnd();
    } catch {}

    // Clear fogs
    $gameMap.clearMapFogs();

    // Closes a Message, if it's open.
    SceneManager._scene._messageWindow.terminateMessage();
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return getMapsbyName();
    }
    return [];
};

export default { onCommand, onSuggestion };
