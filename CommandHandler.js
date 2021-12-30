/**!
 * @author surrealegg
 * @plugdesc OMORI Console
 *
 * @help
 *
 */

/**
 * @global
 */
class CommandHandlerClass {
  constructor() {
    let self = this;

    /**
     * @type {Array<(handler: CommandHandlerClass, arguments: string[]) => void>}
     */
    this.commands = {};

    /**
     * @type {Array<(arguments: string[]) => string[]>}
     */
    this.suggestions = {};

    /**
     * @type {string[]}
     */
    this.history = [""];

    /**
     * @type {number}
     */
    this.history_index = 0;

    /**
     * @type {string[]}
     */
    this.currentSuggestions = [];
    this.currentSuggestionsIndex = -1;

    /**
     * @type {HTMLDivElement}
     */
    this.consoleElement = document.createElement("div");

    /**
     * @type {HTMLUListElement}
     */
    this.listElement = document.createElement("ul");

    /**
     * @type {HTMLDivElement}
     */
    this.actionElement = document.createElement("div");

    /**
     * @type {HTMLDivElement}
     */
    this.scrollableElement = document.createElement("div");

    /**
     * @type {HTMLSpanElement}
     */
    this.actionInputPrefixElement = document.createElement("span");

    /**
     * @type {HTMLParagraphElement}
     */
    this.actionSuggestionElement = document.createElement("p");

    /**
     * @type {HTMLInputElement}
     */
    this.actionInputElement = document.createElement("input");

    // Overwrite preventDefaults, because it cancles out input events.
    // TODO: There must be a better way to do this.
    Input._shouldPreventDefault = () => { return false; };
    KeyboardInput._shouldPreventDefault = () => { return false; };

    // Set attributes
    this.actionInputPrefixElement.innerText = "/";
    this.consoleElement.classList.add("console");
    this.actionElement.classList.add("action");
    this.scrollableElement.classList.add("scrollable");
    this.actionInputElement.setAttribute("type", "text");
    this.actionInputElement.setAttribute("id", "console_input");

    // Add events
    this.actionInputElement.addEventListener("keydown", e => {
      switch (e.code) {
        case "Enter":
          e.preventDefault();
          if (e.target.value.length > 0) {
            self.log(`/${e.target.value}`, "lightgray");
            self.execute(e.target.value);
            self.history.splice(self.history.length - 1, 0, e.target.value);
            self.history_index = self.history.length - 1;
            e.target.value = "";
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (self.history_index > 0) {
            self.history_index--;
            e.target.value = self.history[self.history_index];
            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (self.history_index < self.history.length - 1) {
            self.history_index++;
            e.target.value = self.history[self.history_index];
            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
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
          if (temp.length > 0) {
            let tempValue = self.currentSuggestions[self.currentSuggestionsIndex];
            temp[temp.length - 1] = tempValue;
            for (let i = 0; i < temp.length; ++i) {
              if (typeof temp[i] !== "undefined" && (temp[i].indexOf(" ") > -1 || temp[i].indexOf("/") > -1)) {
                temp[i] = `"${temp[i]}"`;
              }
            }
            self.actionInputElement.value = temp.join(" ");
          }
          break;
      }
    });

    this.actionInputElement.addEventListener("input", e => self.onInputUpdate(e.target.value));

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

        .console ul::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.2);
        }

        .console ul::-webkit-scrollbar {
          width: 1em;
        }

        .console ul::-webkit-scrollbar-thumb {
          background-color: darkgrey;
          outline: 1px solid slategrey;
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
    document.addEventListener("keydown", e => {
      if (e.code === "Escape" || (e.code === "Slash" && !self.consoleElement.classList.contains("show"))) {
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
    this.log("Welcome to OMORI console! Press ESC to close it");
  }

  /**
   * Handles on Input event. This is used to show suggestions if possible.
   *
   * @param {string} value
   * @returns {void}
   */
  onInputUpdate(value) {
    this.currentSuggestionsIndex = -1;
    this.actionSuggestionElement.innerText = "";
    this.currentSuggestions = [];
    let args = this.parseArguments(value);
    if (args.length > 1) {
      if (args[0] in this.suggestions) {
        this.currentSuggestions = this.filterSuggestions(args[args.length - 1], this.suggestions[args[0]](args));
        this.actionSuggestionElement.innerText = this.currentSuggestions.length > 0 ?
          `"${this.currentSuggestions.join("\", \"")}"` : "";
        this.scrollableElement.scrollTo(0, this.scrollableElement.scrollHeight);
      }
      return;
    }
    let commandNames = Object.keys(this.commands);
    this.currentSuggestions = args.length === 1 ? this.filterSuggestions(args[0], commandNames) : commandNames;
    this.actionSuggestionElement.innerText = this.currentSuggestions.join(" ");
    this.scrollableElement.scrollTo(0, this.scrollableElement.scrollHeight);
  }

  /**
   * Updates the console status
   *
   * @returns {void}
   */
  updateConsole() {
    if (this.consoleElement.classList.contains("show")) {
      SceneManager.stop();
      this.actionInputElement.focus();
      this.onInputUpdate(this.actionInputElement.value);
      return;
    }
    SceneManager.resume();
  }

  /**
   * Toggles the console.
   *
   * @returns {void}
   */
  toggleConsole() {
    this.consoleElement.classList.toggle("show");
    this.updateConsole();
  }

  /**
   * Sets the console to specified state.
   *
   * @param {boolean} value
   */
  setConsole(value) {
    if (value === true) {
      this.consoleElement.classList.add("show");
    }
    else {
      this.consoleElement.classList.remove("show");
    }
    this.updateConsole();
  }

  /**
   * Logs into the console.
   *
   * @param {string} value
   * @param {string} color
   *
   * @returns {void}
   */
  log(value, color = "#fff") {
    let tempElement = document.createElement("li");
    tempElement.innerText = value;
    if (color !== "#fff") {
      tempElement.style.color = color;
    }
    this.listElement.appendChild(tempElement);
    this.scrollableElement.scrollTo(0, this.scrollableElement.scrollHeight);
  }

  /**
   * Adds a command. Returns true if the command is added otherwise it will
   * return false.
   *
   * @param {string} name
   * @param {(handler: CommandHandlerClass, arguments: string[]) => void} callback
   * @param {((arguments: string[]) => string[])|null} suggestions
   *
   * @returns {boolean}
   */
  add(name, callback, suggestions = null) {
    if (name in this.commands) {
      return false;
    }
    this.commands[name] = callback;
    if (suggestions !== null) {
      this.suggestions[name] = suggestions;
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
    if (input.charAt(input.length - 1) === " ") {
      args.push("");
    }
    return args;
  }

  /**
   * Parses and executes a command.
   *
   * @param {string} command
   * @returns {void}
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
    this.onInputUpdate("");
  }

  /**
   * Filters the results by query.
   *
   * @param {string} query
   * @param {string[]} values
   * @returns {string[]}
   */
  filterSuggestions(query, values) {
    let result = [];

    // Escape string
    query = query.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
    query = new RegExp(query, "i");
    for (let i = 0; i < values.length; ++i) {
      if (values[i].search(query) > -1) {
        result.push(values[i]);
      }
    }
    return result;
  }
};

/**
 * @type {CommandHandlerClass}
 */
this.CommandHandler = this.CommandHandler || new CommandHandlerClass;
