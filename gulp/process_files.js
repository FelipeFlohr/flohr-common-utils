// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const gulp = require("gulp");

function processPackageFiles() {
    return gulp.src([
        "./package.json",
        "./.npmrc",
        "./README.md",
        "./LICENSE"
    ], { allowEmpty: true })
        .pipe(gulp.dest("./dist"));
}

// eslint-disable-next-line no-undef
module.exports = {
    processPackageFiles
};
