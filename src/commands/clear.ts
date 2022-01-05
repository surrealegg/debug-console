import CommandHandler from "../handler";

export default {
    onCommand: (handler: CommandHandler): void => {
        while (handler.listElement.lastElementChild) {
            handler.listElement.removeChild(
                handler.listElement.lastElementChild,
            );
        }
    },
    onSuggestion: null,
};
