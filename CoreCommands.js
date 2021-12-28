CommandHandler.add("help", (handler) => {
    handler.log(`Commands: ${Object.keys(handler.commands).join(" ")}`, "lime");
});

CommandHandler.add("clear", (handler) => {
    handler.listElement.innerHTML = "";
});

/**
 * Checks if map exists.
 *
 * @param {string} value
 * @returns {{name: string, id: number}|null}
 */
function findMap(value) {
    let parsedValue = parseInt(value);
    let numeric = !isNaN(parsedValue) && isFinite(parsedValue);
    for (let i = 0; i < $dataMapInfos.length; ++i) {
        if ($dataMapInfos[i] === null) {
            continue;
        }
        if ((numeric && parsedValue === $dataMapInfos[i].id) || $dataMapInfos[i].name === value) {
            return $dataMapInfos[i];
        }
    }
    return null;
}

/**
 * Get list of maps that match the query.
 *
 * @param {string} value
 * @returns {Array<{name: string, id: number}>}
 */
function findMatches(value) {
    let parsedValue = parseInt(value);
    let numeric = !isNaN(parsedValue) && isFinite(parsedValue);
    let result = [];

    // Escape string
    value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    value = new RegExp(value, "i");
    for (let i = 0; i < $dataMapInfos.length; ++i) {
        if ($dataMapInfos[i] === null) {
            continue;
        }
        if (numeric && parsedValue === $dataMapInfos[i].id) {
            return [$dataMapInfos[i].name];
        }
        if ($dataMapInfos[i].name.search(value) > -1) {
            result.push($dataMapInfos[i].name);
        }
    }
    return result;
}

CommandHandler.add("maptp", (handler, args) => {

    // Check if argument passed
    if (args.length < 2) {
        handler.log("Usage /maptp [id | name]");
        return;
    }

    // Check if the player is in map
    if (!SceneManager._scene._mapLoaded) {
        handler.log("Player must be in map", "red");
        return;
    }

    // Check if map exists
    let map = findMap(args[1]);
    if (map === null) {
        handler.log(`Map "${args[1]}" not found`, "red");
        return;
    }

    // Check if map exists as file.
    const fs = require("fs");
    if (!fs.existsSync(`./maps/Map${map.id}.json`)) {
        handler.log(`Could not teleport to "${map.name}".`, "red");
        return;
    }

    // Teleports to id
    handler.log(`Teleporting to "${map.name}"`);
    $gameTemp._preDebugTeleportX = $gamePlayer.x;
    $gameTemp._preDebugTeleportY = $gamePlayer.y;
    $gameTemp._preDebugTeleportMap = $gameMap.mapId();
    SceneManager.push(Scene_MapTeleport);
    $gamePlayer.reserveTransfer(map.id, 0, 0, 2, 0);
    $gamePlayer.requestMapReload();

    // Closes console.
    handler.toggleConsole();

    // Clears Effects.
    $gameScreen.clear();

    // Stops music.
    AudioManager.stopAll();

    // Clears Event.
    $gameMap._interpreter.clear();

    // Unlocks the Player.
    $gamePlayer.processRouteEnd();

    // Closes a Message, if it's open.
    SceneManager._scene._messageWindow.terminateMessage();

}, (args) => {
    return args.length > 1 ? findMatches(args[1]) : [];
});
