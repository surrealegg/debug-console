/**!
 * @author surrealegg
 * @plugdesc A command handler
 *
 * @help
 *
 */

class CommandHandlerClass {
  constructor() {
    let self = this;

    /**
     * @var {Array<(handler: CommandHandlerClass, arguments: string[]) => void>}
     */
    this.commands = {};

    /**
     * @var {Array<(arguments: string[]) => string[]>}
     */
    this.suggestions = {};

    /**
     * @var {string[]}
     */
    this.history = [""];
    this.history_index = 0;

    /**
     * @var {string[]}
     */
    this.currentSuggestions = [];
    this.currentSuggestionsIndex = -1;

    // DOM Elements
    this.consoleElement = document.createElement("div");
    this.listElement = document.createElement("ul");
    this.actionElement = document.createElement("div");
    this.actionInputPrefixElement = document.createElement("span");
    this.actionSuggestionElement = document.createElement("p");
    this.actionInputElement = document.createElement("input");

    // Overwrite preventDefaults, because it cancles out input events.
    // TODO: There must be a better way to do this.
    Input._shouldPreventDefault = () => { return false; };
    KeyboardInput._shouldPreventDefault = () => { return false; };

    // Set attributes
    this.actionInputPrefixElement.innerText = "/";
    this.consoleElement.classList.add("surrealegg_console");
    this.actionElement.classList.add("action");
    this.actionInputElement.setAttribute("type", "text");
    this.actionInputElement.setAttribute("id", "console_input");
    this.actionInputElement.addEventListener("keydown", e => {
      switch (e.code) {
        case "Enter":
          if (e.target.value.length > 0) {
            self.log(`/${e.target.value}`, "lightgray");
            self.execute(e.target.value);
            self.history.splice(self.history.length - 1, 0, e.target.value);
            self.history_index++;
            e.target.value = "";
          }
          break;
        case "ArrowUp":
          if (self.history_index > 0) {
            self.history_index--;
            e.target.value = self.history[self.history_index];
          }
          break;
        case "ArrowDown":
          if (self.history_index < self.history.length - 1) {
            self.history_index++;
            e.target.value = self.history[self.history_index];
          }
          break;
        case "Tab":
          e.preventDefault();
          if (self.currentSuggestions.length === 0) {
            break;
          }
          self.currentSuggestionsIndex++;
          if (self.currentSuggestionsIndex >= self.currentSuggestions.length) {
            self.currentSuggestionsIndex = 0;
          }
          let temp = self.parseArguments(self.actionInputElement.value);
          if (temp.length > 1) {
            temp[temp.length - 1] = `"${self.currentSuggestions[self.currentSuggestionsIndex]}"`;
            self.actionInputElement.value = temp.join(" ");
          }
          break;
      }
    });
    this.actionInputElement.addEventListener("input", e => {
      self.currentSuggestionsIndex = -1;
      let args = self.parseArguments(e.target.value);
      if (args.length > 1) {
        if (args[0] in self.suggestions) {
          self.currentSuggestions = self.suggestions[args[0]](args);
          self.actionSuggestionElement.innerText = self.currentSuggestions.join(" ");
        }
        return;
      }
      self.actionSuggestionElement.innerText = "";
      // TODO: Command suggestion.
    });

    // Add Style
    let styleElement = document.createElement("style");
    styleElement.innerText = `
        .surrealegg_console,
        .surrealegg_console input {
          font-family: GameFont;
          font-size: 1.5rem;
          line-height: 1;
        }

        .surrealegg_console {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 10;
          color: #fff;
          padding: 1rem;
          box-sizing: border-box;
          justify-content: flex-end;
          flex-direction: column;
          display: none;
        }

        .surrealegg_console .action {
          display: flex;
          padding: 0.25em 0.5em;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.2);
          align-items: center;
          min-height: 3rem;
        }

        .surrealegg_console ul {
          list-style-type: none;
          padding-left: 0;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          overflow-y: auto;
        }

        .surrealegg_console #console_input {
          width: 100%;
          border: none;
          color: #fff;
          outline: none;
          background-color: transparent;
        }

        .show {
          display: flex;
        }

        .surrealegg_console p {
          color: lightblue;
          margin: 0;
        }
        `;
    document.head.appendChild(styleElement);

    // Add Toggle event.
    document.addEventListener("keydown", e => {
      if (e.code === "Slash" || e.code === "Escape") {
        e.preventDefault();
        self.toggleConsole();
      }
    });

    // Add this to the body.
    this.consoleElement.appendChild(this.listElement);
    this.actionElement.appendChild(this.actionInputPrefixElement);
    this.actionElement.appendChild(this.actionInputElement);
    this.consoleElement.appendChild(this.actionSuggestionElement);
    this.consoleElement.appendChild(this.actionElement);
    document.body.appendChild(this.consoleElement);

    // Add welcome message
    this.log("Welcome to OMORI console.");
  }

  /**
   * Toggles the console.
   */
  toggleConsole() {
    // TODO: Pause the game if console is shown.
    this.consoleElement.classList.toggle("show");
    if (this.consoleElement.classList.contains("show")) {
      this.actionInputElement.focus();
      return;
    }
  }

  /**
   * Logs into the console.
   *
   * @param {string} value
   * @param {string} color
   */
  log(value, color = "#fff") {
    let tempElement = document.createElement("li");
    tempElement.innerText = value;
    if (color !== "#fff") {
      tempElement.style.color = color;
    }
    this.listElement.appendChild(tempElement);
    this.listElement.scrollTo(0, this.listElement.scrollHeight);
  }

  /**
   * Adds a command. Returns true if the command is added otherwise it will
   * return false.
   *
   * @param {string} name
   * @param {(handler: CommandHandlerClass, arguments: string[]) => void} callback
   * @param {((handler: CommandHandlerClass, arguments: string[]) => string[])|null} suggestion
   *
   * @returns {boolean}
   */
  add(name, callback, suggestion = null) {
    if (name in this.commands) {
      return false;
    }
    this.commands[name] = callback;
    if (suggestion !== null) {
      this.suggestions[name] = suggestion;
    }
    return true;
  }

  /**
   * Parses a string into array of string.
   *
   * @param {string} input
   * @returns {string[]}
   */
  parseArguments(input) {
    let args = input.match(/([\w-]+|"(\\"|[^"]|$)*("|$))/g);
    if (args === null) {
      return [];
    }
    for (let i = 0; i < args.length; ++i) {
      if (args[i].charAt(0) === '"') {
        let endQuote = args[i].charAt(args[i].length - 1) === '"' ? 1 : 0;
        args[i] = args[i].substring(1, args[i].length - endQuote);
      }
    }
    return args;
  }

  /**
   * Parses and executes a command.
   *
   * @param {string} command
   * @returns
   */
  execute(command) {
    let args = this.parseArguments(command);
    if (args.length === 0 || !(args[0] in this.commands)) {
      this.log("Command not found.", "red");
      return;
    }
    this.commands[args[0]](this, args);
    this.actionSuggestionElement.innerText = "";
    this.currentSuggestions = {};
    this.currentSuggestionsIndex = -1;
  }
};

/**
 * @var {CommandHandlerClass}
 */
window.CommandHandler = window.CommandHandler || new CommandHandlerClass;
