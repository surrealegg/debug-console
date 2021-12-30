
/**
 * @type {string[]|null}
 */
var namedMaps = null;

/**
 * @var {string[]|null}
 */
var namedTroops = null;

/**
 * @var {string[]}
 */
var supportedFonts = ["monospace", "sans-serif", "GameFont"];

CommandHandler.add("clear", (handler) => {
    while (handler.listElement.lastElementChild) {
        handler.listElement.removeChild(handler.listElement.lastElementChild);
    }
});

CommandHandler.add("reload", () => {
    location.reload();
});

/**
 * Checks if map exists.
 *
 * @param {Array<{name: string, id: number}} dest
 * @param {string} value
 * @returns {{name: string, id: number}|null}
 */
function findFromVariable(dest, value) {
    let parsedValue = parseInt(value);
    let numeric = !isNaN(parsedValue) && isFinite(parsedValue);
    for (let i = 0; i < dest.length; ++i) {
        if (dest[i] !== null && ((numeric && parsedValue === dest[i].id) || dest[i].name === value)) {
            return dest[i];
        }
    }
    return null;
}

/**
 * Returns all map names.
 *
 * @returns {string[]}
 */
function getMapsbyName() {
    /**
     * @type {string[]}
     */
    let result = [];
    for (let i = 0; i < $dataMapInfos.length; ++i) {
        if ($dataMapInfos[i] !== null) {
            result.push($dataMapInfos[i].name);
        }
    }
    return result;
}

/**
 * Returns all Troops' names.
 *
 * @returns {string[]}
 */
function getTroopsByName() {
    /**
     * @type {string[]}
     */
    let result = [];
    for (let i = 0; i < $dataTroops.length; ++i) {
        if ($dataTroops[i] !== null && $dataTroops[i].members.length > 0) {
            result.push($dataTroops[i].name);
        }
    }
    return result;
}

CommandHandler.add("battle", (handler, args) => {

    // Check if argument passed
    if (args.length < 2) {
        handler.log("Usage: /battle [id | name]");
        return;
    }

    // Check if the player is in map
    if (!SceneManager._scene._mapLoaded) {
        handler.log("Player must be in map", "red");
        return;
    }

    // Check if battle exists
    let battle = findFromVariable($dataTroops, args[1]);
    if (battle === null) {
        handler.log(`Battle "${args[1]}" not found`, "red");
        return;
    }

    handler.log(`Starting a battle with "${battle.name}"`);

    // Closes console.
    handler.setConsole(false);

    // TODO: Give an option to set canEscape and canLose
    SoundManager.playBattleStart();
    BattleManager.setup(battle.id, true, true);
    BattleManager.setEventCallback(() => {
        // There's a bug where when you select Run
        // You will see a black screen. This fixes the issue.
        $gameScreen.clear();
    });
    $gamePlayer.makeEncounterCount();
    SceneManager.push(Scene_Battle);

}, args => {
    if (args.length === 2) {
        if (namedTroops === null) {
            namedTroops = getTroopsByName();
        }
        return namedTroops;
    }
    return [];
});

CommandHandler.add("joinbattle", (handler, args) => {
    if (!$gameParty.inBattle()) {
        handler.log("Player must be in battle.", "red");
        return;
    }

    // Check if battle exists
    let battle = findFromVariable($dataTroops, args[1]);
    if (battle === null) {
        handler.log(`Battle "${args[1]}" not found`, "red");
        return;
    }

    handler.log(`${battle.name} joined the battle!`);
    $gameTroop.addTroopReinforcements(battle.id);

}, args => {
    if (args.length === 2) {
        if (namedTroops === null) {
            namedTroops = getTroopsByName();
        }
        return namedTroops;
    }
    return [];
});

CommandHandler.add("font", (handler, args) => {

    // Check if argument passed
    if (args.length < 2) {
        handler.log("Usage: /font [font]");
        return;
    }

    if (!supportedFonts.includes(args[1])) {
        handler.log(`Unknown font ${args[1]}`, "red");
        return;
    }

    handler.consoleElement.style.fontFamily = args[1];
    handler.actionInputElement.style.fontFamily = args[1];

    let fontSize = args[1] !== "GameFont" ? "1.125rem" : "1.5rem";
    handler.consoleElement.style.fontSize = fontSize;
    handler.actionInputElement.style.fontSize = fontSize;

    localStorage.setItem("font", args[1]);
    localStorage.setItem("fontSize", fontSize);

}, args => {
    if (args.length === 2) {
        return supportedFonts;
    }
    return [];
});

CommandHandler.add("endbattle", handler => {
    if (!$gameParty.inBattle()) {
        handler.log("Player must be in battle.", "red");
        return;
    }
    handler.toggleConsole();
    BattleManager.endBattle();
});

CommandHandler.add("maptp", (handler, args) => {

    // Check if argument passed
    if (args.length < 2) {
        handler.log("Usage: /maptp [id | name]");
        return;
    }

    // Check if the player is in map
    if (!SceneManager._scene._mapLoaded) {
        handler.log("Player must be in map", "red");
        return;
    }

    // Check if map exists
    let map = findFromVariable($dataMapInfos, args[1]);
    if (map === null) {
        handler.log(`Map "${args[1]}" not found`, "red");
        return;
    }

    // Check if map exists as file.
    const fs = require("fs");
    if (!fs.existsSync(`./maps/Map${map.id}.json`)) {
        handler.log(`Could not teleport to "${map.name}", because ./maps/Map${map.id}.json is missing.`, "red");
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
    handler.setConsole(false);

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

}, args => {
    if (args.length === 2) {
        if (namedMaps === null) {
            namedMaps = getMapsbyName();
        }
        return namedMaps;
    }
    return [];
});
