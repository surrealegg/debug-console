import CommandHandler from "../handler";

const onCommand = (handler: CommandHandler, args: string[]) => {
    const id =
        args.length < 2
            ? DataManager._lastAccessedId
            : parseInt(args[1]);

    if (isNaN(id)) {
        handler.log("Expected a number", "red");
        return;
    }

    if (id < 1 || id > 6) {
        handler.log("Invalid Save ID", "red");
        return;
    }

    if (!DataManager.saveGame(id)) {
        handler.log(`Failed to Save on id ${id}`, "red");
        return;
    }

    SoundManager.playSave();
    handler.log(`Saved on id ${id}`);
};

const onSuggestion = null;

export default { onCommand, onSuggestion };
