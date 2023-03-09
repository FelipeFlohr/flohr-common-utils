/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");

function processJson() {
    return gulp
        .src("lib/**/*.json", { allowEmpty: true })
        .pipe(gulp.dest("dist"));
}

function processPackageFiles() {
    return gulp
        .src(["package.json", "LICENSE", "README.md"], { allowEmpty: true })
        .pipe(gulp.dest("dist"));
}

module.exports = {
    processJson,
    processPackageFiles,
};
