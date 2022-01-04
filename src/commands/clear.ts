import CommandHandler from "../handler";

const onCommand = (handler: CommandHandler): void => {
    while (handler.listElement.lastElementChild) {
        handler.listElement.removeChild(handler.listElement.lastElementChild);
    }
};

const onSuggestion = null;

export default { onCommand, onSuggestion };
