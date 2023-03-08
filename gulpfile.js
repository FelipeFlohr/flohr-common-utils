/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { parallel } = require("gulp");
const { processTypescript } = require("./gulp/process_scripts");
const { processJson, processPackageFiles } = require("./gulp/process_files");

module.exports.default = parallel(
    processTypescript,
    processJson,
    processPackageFiles
);
