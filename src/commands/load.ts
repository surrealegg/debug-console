import CommandHandler from "../handler";

const onCommand = (handler: CommandHandler, args: string[]) => {
    if (args.length < 2) {
        handler.log("/load [saveid]");
        return;
    }

    const id = parseInt(args[1]);

    if (isNaN(id)) {
        handler.log("Expected a number", "red");
        return;
    }

    if (DataManager.loadGame(id)) {
        handler.setConsole(false);
        SoundManager.playLoad();
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer(
                $gameMap.mapId(),
                $gamePlayer.x,
                $gamePlayer.y,
                0,
                0,
            );
            $gamePlayer.requestMapReload();
        }
        SceneManager.goto(Scene_Map);
        handler.log(`Loaded gamefile ${id}`);
        return;
    }
    handler.log(`Failed to load gamefile ${id}`, "red");
};

const onSuggestion = null;

export default { onCommand, onSuggestion };
