import CommandHandler from "../../handler";

export default {
    onCommand: (handler: CommandHandler): void => {
        const actors = $gameParty.allMembers();
        for (let i = 0; i < actors.length; ++i) {
            actors[i].setHp(actors[i].mhp);
            actors[i].setMp(actors[i].mmp);
        }
        handler.log(`Everyone has been healed!`);
    },
    onSuggestion: null,
};
