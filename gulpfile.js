/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { parallel } = require("gulp");
const { processPackageFiles } = require("./gulp/process_files");

module.exports.default = parallel(processPackageFiles);