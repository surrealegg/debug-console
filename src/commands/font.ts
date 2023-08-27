import type CommandHandler from "../handler";

const supportedFonts = ["monospace", "sans-serif", "GameFont"];

const onCommand = (handler: CommandHandler, args: string[]): void => {
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

    const fontSize = args[1] !== "GameFont" ? "1.125rem" : "1.5rem";
    handler.consoleElement.style.fontSize = fontSize;
    handler.actionInputElement.style.fontSize = fontSize;

    localStorage.setItem("font", args[1]);
    localStorage.setItem("fontSize", fontSize);
};

const onSuggestion = (args: string[]): string[] => {
    if (args.length === 2) {
        return supportedFonts;
    }
    return [];
};

export default { onCommand, onSuggestion };
