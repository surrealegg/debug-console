import CommandHandler from "../handler";

const onCommand = (handler: CommandHandler, args: string[]) => {
    const id =
        args.length < 2
            ? DataManager._lastAccessedId
            : parseInt(args[1]);

    if (isNaN(id)) {
        handler.log("Expected number", "red");
        return;
    }

    if (!DataManager.saveGame(id)) {
        handler.log(`Failed to Save on id ${id}`);
        return;
    }

    SoundManager.playSave();
    handler.log(`Saved on id ${id}`);
};

const onSuggestion = null;

export default { onCommand, onSuggestion };
