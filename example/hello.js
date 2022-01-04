if (typeof window.commands !== "undefined") {
    /**
     * Runs on Execute.
     *
     * @param {CommandHandler} handler
     * @param {string[]} args
     *
     * @returns {void}
     */
    const helloOnCommand = (handler, args) => {
        // args = ["hello", ...arguments]
        if (args.length < 2) {
            handler.log("Usage: hello [name]");
            return;
        }

        handler.log(`Hello ${args[1]}!`, "lime");
    };

    /**
     * Shows a list of avaliable options.
     * You don't have to worry about filtering options,
     * the command handler will do it for you!
     *
     * @param {string[]} args
     *
     * @returns {string[]}
     */
    const helloOnSuggestion = (args) => {
        // args = ["hello", ...arguments]
        if (args.length === 2) {
            // TODO: Show options for first argument.
            return ["Example", "First", "Argument", "Options"];
        }
        if (args.length === 3) {
            // TODO: Show options for second argument.
            return ["Example", "Second", "Argument", "Options"];
        }

        // Return nothing on default.
        return [];
    };

    // Add hello command without suggestion callback
    // window.commands.add("hello", helloOnExecute);

    // Add hello command
    window.commands.add("hello", helloOnCommand, helloOnSuggestion);
}
