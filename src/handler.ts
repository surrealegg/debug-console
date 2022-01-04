declare var KeyboardInput: any;

interface CommandHandlerOnCommand {
    (handler: CommandHandler, args: string[]): void;
}

interface CommandHandlerOnCommandArray {
    [name: string]: CommandHandlerOnCommand;
}

interface CommandHandlerOnSuggestion {
    (args: string[]): string[];
}

interface CommandHandlerOnSuggestionArray {
    [name: string]: CommandHandlerOnSuggestion;
}

export default class CommandHandler {
    private active = false;
    private commands: CommandHandlerOnCommandArray = {};
    private suggestions: CommandHandlerOnSuggestionArray = {};
    private history: string[] = [""];
    private historyIndex = 0;
    private currentSuggestions: string[] = [];
    private currentSuggestionsIndex = -1;

    public consoleElement = document.createElement("div");
    public listElement = document.createElement("ul");
    public actionElement = document.createElement("div");
    public scrollableElement = document.createElement("div");
    public actionInputPrefixElement = document.createElement("span");
    public actionSuggestionElement = document.createElement("p");
    public actionInputElement = document.createElement("input");

    constructor() {
        let self = this;

        // Overwrite preventDefaults, because it cancles out input events.
        // TODO: There must be a better way to do this.
        Input._shouldPreventDefault = () => false;
        if (KeyboardInput !== undefined) {
            KeyboardInput._shouldPreventDefault = () => false;
        }

        // Set attributes
        this.actionInputPrefixElement.innerText = "/";
        this.consoleElement.classList.add("console");
        this.actionElement.classList.add("action");
        this.scrollableElement.classList.add("scrollable");
        this.actionInputElement.setAttribute("type", "text");
        this.actionInputElement.setAttribute("id", "console_input");
        this.actionInputElement.setAttribute("autofocus", "true");

        // Add events
        this.actionInputElement.addEventListener(
            "keydown",
            (e: KeyboardEvent & { target: HTMLInputElement }) => {
                switch (e.code) {
                    case "Enter":
                        e.preventDefault();
                        if (e.target.value.length > 0) {
                            self.log(`/${e.target.value}`, "lightgray");
                            self.execute(e.target.value);
                            self.history.splice(
                                self.history.length - 1,
                                0,
                                e.target.value
                            );
                            self.historyIndex = self.history.length - 1;
                            e.target.value = "";
                        }
                        break;
                    case "ArrowUp":
                        e.preventDefault();
                        if (self.historyIndex > 0) {
                            self.historyIndex--;
                            e.target.value = self.history[self.historyIndex];
                            e.target.selectionStart = e.target.selectionEnd =
                                e.target.value.length;
                        }
                        break;
                    case "ArrowDown":
                        e.preventDefault();
                        if (self.historyIndex < self.history.length - 1) {
                            self.historyIndex++;
                            e.target.value = self.history[self.historyIndex];
                            e.target.selectionStart = e.target.selectionEnd =
                                e.target.value.length;
                        }
                        break;
                    case "Tab":
                        e.preventDefault();
                        if (self.currentSuggestions.length === 0) {
                            break;
                        }
                        self.currentSuggestionsIndex++;
                        if (
                            self.currentSuggestionsIndex >=
                            self.currentSuggestions.length
                        ) {
                            self.currentSuggestionsIndex = 0;
                        }
                        let temp = self.parseArguments(
                            self.actionInputElement.value
                        );
                        if (temp.length > 0) {
                            let tempValue =
                                self.currentSuggestions[
                                self.currentSuggestionsIndex
                                ];
                            temp[temp.length - 1] = tempValue;
                            for (let i = 0; i < temp.length; ++i) {
                                if (
                                    typeof temp[i] !== "undefined" &&
                                    temp[i].indexOf(" ") > -1
                                ) {
                                    temp[i] = `"${temp[i]}"`;
                                }
                            }
                            self.actionInputElement.value = temp.join(" ");
                        }
                        break;
                }
            }
        );

        this.actionInputElement.addEventListener(
            "input",
            (e: InputEvent & { target: HTMLInputElement }) =>
                self.onInputUpdate(e.target.value)
        );

        // Add Style
        let cachedFont = localStorage.getItem("font") || "GameFont";
        let cachedFontSize = localStorage.getItem("fontSize") || "1.5rem";
        let styleElement = document.createElement("style");
        styleElement.innerText = `
        .console,
        .console input {
          font-family: ${cachedFont};
          font-size: ${cachedFontSize};
        }

        .console {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 100;
          color: #fff;
          padding: 1rem;
          box-sizing: border-box;
          justify-content: flex-end;
          flex-direction: column;
          display: none;
        }

        .console .action {
          display: flex;
          padding: 0.25em 0.5em;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.2);
          align-items: center;
          min-height: 3rem;
        }

        .console ul {
          list-style-type: none;
          padding-left: 0;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .console .scrollable {
          overflow-y: auto;
          margin-bottom: 0.5rem;
        }

        .console li {
          margin-bottom: 0.25rem;
        }

        .console #console_input {
          width: 100%;
          border: none;
          color: #fff;
          outline: none;
          background-color: transparent;
        }

        .show {
          display: flex;
        }

        .console p {
          color: lightblue;
          margin: 0 0 12px 0;
        }
        `;
        document.head.appendChild(styleElement);

        // Add Toggle event.
        document.addEventListener("keydown", (e) => {
            if (
                (e.code === "Escape" && self.active === true) ||
                (e.code === "Slash" && self.active === false)
            ) {
                e.preventDefault();
                self.toggleConsole();
            }
        });

        // Add this to the body.
        this.scrollableElement.appendChild(this.listElement);
        this.scrollableElement.appendChild(this.actionSuggestionElement);
        this.actionElement.appendChild(this.actionInputPrefixElement);
        this.actionElement.appendChild(this.actionInputElement);
        this.consoleElement.appendChild(this.scrollableElement);
        this.consoleElement.appendChild(this.actionElement);
        document.body.appendChild(this.consoleElement);

        // Add welcome message
        this.log(`Welcome to ${document.title} console! Press ESC to close it`);
    }

    onInputUpdate(value: string): void {
        this.currentSuggestionsIndex = -1;
        this.actionSuggestionElement.innerText = "";
        this.currentSuggestions = [];
        let args = this.parseArguments(value);
        if (args.length > 1) {
            if (args[0] in this.suggestions) {
                this.currentSuggestions = this.filterSuggestions(
                    args[args.length - 1],
                    this.suggestions[args[0]](args)
                );
                this.actionSuggestionElement.innerText =
                    this.currentSuggestions.length > 0
                        ? `"${this.currentSuggestions.join('", "')}"`
                        : "";
                this.scrollableElement.scrollTo(
                    0,
                    this.scrollableElement.scrollHeight
                );
            }
            return;
        }
        let commandNames = Object.keys(this.commands).sort();
        this.currentSuggestions =
            args.length === 1
                ? this.filterSuggestions(args[0], commandNames)
                : commandNames;
        this.actionSuggestionElement.innerText =
            this.currentSuggestions.join(" ");
        this.scrollableElement.scrollTo(0, this.scrollableElement.scrollHeight);
    }

    updateConsole(): void {
        if (this.active === true) {
            SceneManager.stop();
            this.onInputUpdate(this.actionInputElement.value);
            this.consoleElement.classList.add("show");
            this.actionInputElement.focus();
            return;
        }
        this.consoleElement.classList.remove("show");
        SceneManager.resume();
    }

    toggleConsole(): void {
        this.active = !this.active;
        this.updateConsole();
    }

    setConsole(active: boolean): void {
        this.active = active;
        this.updateConsole();
    }

    log(value: string, color = "#fff"): void {
        let tempElement = document.createElement("li");
        tempElement.innerText = value;
        if (color !== "#fff") {
            tempElement.style.color = color;
        }
        this.listElement.appendChild(tempElement);
        this.scrollableElement.scrollTo(0, this.scrollableElement.scrollHeight);
    }

    add(
        name: string,
        callback: CommandHandlerOnCommand,
        suggestions: CommandHandlerOnSuggestion | null = null
    ): boolean {
        if (name in this.commands) {
            return false;
        }
        this.commands[name] = callback;
        if (suggestions !== null) {
            this.suggestions[name] = suggestions;
        }
        return true;
    }

    parseArguments(input: string): string[] {
        let args = input.match(/("(\\\\"|[^"]|$)*("|$)|[^ ]+)/g);
        if (args === null) {
            return [];
        }
        for (let i = 0; i < args.length; ++i) {
            if (args[i].charAt(0) === '"') {
                let endQuote =
                    args[i].charAt(args[i].length - 1) === '"' ? 1 : 0;
                args[i] = args[i].substring(1, args[i].length - endQuote);
            }
        }
        if (input.charAt(input.length - 1) === " ") {
            args.push("");
        }
        return args;
    }

    execute(command: string): void {
        let args = this.parseArguments(command);
        if (args.length === 0 || !(args[0] in this.commands)) {
            this.log("Command not found.", "red");
            return;
        }
        this.commands[args[0]](this, args);
        this.actionSuggestionElement.innerText = "";
        this.currentSuggestions = [];
        this.currentSuggestionsIndex = -1;
        this.onInputUpdate("");
    }

    filterSuggestions(query: string, values: string[]): string[] {
        let result = [];

        // Escape string
        query = query.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
        const regex = new RegExp(query, "i");
        for (let i = 0; i < values.length; ++i) {
            if (values[i].search(regex) > -1) {
                result.push(values[i]);
            }
        }
        return result.sort();
    }
}
