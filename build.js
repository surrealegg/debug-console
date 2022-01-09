#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require("esbuild");
const fs = require("fs");

esbuild.build({
    logLevel: "info",
    entryPoints: ["./src/main.ts"],
    bundle: true,
    target: "es6",
    external: ["fs", "path", "nw.gui"],
    outfile: "dist/console.js",
});

fs.copyFile("./mod.json", "./dist/mod.json", (err) => {
    if (err) throw err;
});
