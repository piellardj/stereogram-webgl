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
        "script/gl-matrix-2.5.1-min.js",
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
            title: "Tile",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Mode",
                    id: "tile-mode-tabs-id",
                    unique: true,
                    options: [
                        {
                            label: "Texture",
                            value: "texture",
                            checked: true,
                        },
                        {
                            label: "Noise",
                            value: "noise"
                        },
                    ]
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Resolution",
                    id: "tile-noise-resolution-range-id",
                    min: 8,
                    max: 64,
                    value: 16,
                    step: 1
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Colored",
                    id: "tile-noise-colored-checkbox-id",
                    checked: true,
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show UV",
                    id: "show-uv-checkbox-id",
                    checked: false,
                },
                {
                    type: Demopage.supportedControls.FileUpload,
                    id: "input-tile-upload-button",
                    accept: [".png", ".jpg", ".bmp", ".webp"],
                    defaultMessage: "Upload a pattern"
                },
            ]
        },
        {
            title: "Heightmap",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Mode",
                    id: "heightmap-mode-tabs-id",
                    unique: true,
                    options: [
                        {
                            label: "Still",
                            value: "still",
                            checked: true,
                        },
                        {
                            label: "Moving",
                            value: "moving",
                        },
                    ]
                },
                {
                    type: Demopage.supportedControls.Select,
                    title: "Preset",
                    id: "model-preset-select-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "cube",
                            label: "Cube",
                            checked: true,
                        },
                        {
                            value: "monkey",
                            label: "Monkey",
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Depth",
                    id: "depth-range-id",
                    min: 0,
                    max: 1,
                    value: 0.75,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Invert",
                    id: "invert-heightmap-checkbox-id",
                    checked: false,
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show heightmap",
                    id: "show-heightmap-checkbox-id",
                    checked: false,
                },
                {
                    type: Demopage.supportedControls.FileUpload,
                    id: "input-heightmap-upload-button",
                    accept: [".png", ".jpg", ".bmp", ".webp"],
                    defaultMessage: "Upload a heightmap"
                },
            ]
        },
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
