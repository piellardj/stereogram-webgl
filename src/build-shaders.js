const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "shaders");
const DST_DIR = path.resolve(__dirname, "..", "docs", "shaders");

const MAX_INCLUDE_DEPTH = 10;

/**
 * Resolves every #include "XXX" directive in shader source files.
 * Every path is resolved from the SRC_DIR directory.
 * Cyclic includes are not supported.
 * @param {string} filepath 
 * @return {string}
 */
function resolveIncludes(filepath) {
    let includeDepth = 0;

    let processedStr = fs.readFileSync(filepath).toString();
    let includesLeft;
    do {
        includesLeft = 0;

        processedStr = processedStr.replace(/^\s*#include\s*\"(.*)\"\s*$/mg,
            (match, p1) => {
                includesLeft++;
                const fullpath = path.join(SRC_DIR, p1);
                return fs.readFileSync(fullpath).toString();
            });

        includeDepth++;
        if (includeDepth === MAX_INCLUDE_DEPTH) {
            console.error("Error while preprocessing '" + filepath + "': too much #include depth.");
        }
    } while (includesLeft > 0 && includeDepth < MAX_INCLUDE_DEPTH);

    return processedStr;
}




function scanDirectory(directory /* string */) /* void */ {
    fse.ensureDirSync(path.join(DST_DIR, directory));
    
    const fullDirectory = path.join(SRC_DIR, directory);
    fs.readdirSync(fullDirectory).forEach(file => {
        const srcFilepath = path.join(fullDirectory, file);

        if (fs.statSync(srcFilepath).isDirectory()) {
            scanDirectory(path.join(directory, file));
        } else {
            if (!file.startsWith("_")) {
                const dstFilepath = path.join(DST_DIR, directory, file);

                const resolvedStr = resolveIncludes(srcFilepath);
                fs.writeFileSync(dstFilepath, resolvedStr);
            }
        }
    });
}

scanDirectory(".");
