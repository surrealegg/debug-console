#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require("esbuild");
const fs = require("fs");

if (!fs.existsSync("./console")) {
    fs.mkdirSync("./console");
}

esbuild.build({
    logLevel: "info",
    entryPoints: ["./src/main.ts"],
    bundle: true,
    target: "es6",
    external: ["fs", "path", "nw.gui"],
    outfile: "console/console.js",
});

fs.copyFile("./mod.json", "./console/mod.json", (err) => {
    if (err) throw err;
});
