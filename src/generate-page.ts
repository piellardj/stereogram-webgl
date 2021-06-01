import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Stereogram",
    description: "DESCRPITION",
    introduction: [
        "INTRODUCTION",
    ],
    githubProjectName: "stereogram",
    additionalLinks: [],
    styleFiles: [],
    scriptFiles: [
        "script/main.min.js"
    ],
    indicators: [],
    canvas: {
        width: 512,
        height: 512,
        enableFullscreen: true
    },
    controlsSections: [
        {
            title: "Output",
            controls: [
                {
                    type: Demopage.supportedControls.FileDownload,
                    id: "image-download-id",
                    label: "Download image"
                }
            ]
        }
    ]
};

const SRC_DIR = path.resolve(__dirname);
const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = true;

const buildResult = Demopage.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.join(SRC_DIR, "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);

fse.copySync(path.join(SRC_DIR, "static"), DEST_DIR);
