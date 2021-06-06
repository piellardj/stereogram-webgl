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
    githubProjectName: "stereogram-webgl",
    additionalLinks: [],
    styleFiles: [],
    scriptFiles: [
        "script/gl-matrix-2.5.1-min.js",
        "script/main.min.js"
    ],
    indicators: [
        {
            id: "fps-indicator",
            label: "FPS"
        },
        {
            id: "stripes-count-indicator",
            label: "Stripes count"
        },
        {
            id: "tilesize-indicator",
            label: "Tile size"
        },
    ],
    canvas: {
        width: 512,
        height: 512,
        enableFullscreen: true
    },
    controlsSections: [
        {
            title: "Depth map",
            controls: [
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show greyscale",
                    id: "show-heightmap-checkbox-id",
                    checked: false,
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
                    id: "heightmap-preset-select-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "planet.png",
                            label: "Planet",
                            checked: true,
                        },
                        {
                            value: "bumps.png",
                            label: "Bumps",
                        },
                        {
                            value: "smile.png",
                            label: "Smile",
                        },
                        {
                            value: "hand.png",
                            label: "Hand",
                        },
                        {
                            value: "ripple.png",
                            label: "Ripple",
                        },
                        {
                            value: "head.png",
                            label: "Head",
                        },
                        {
                            value: "atomium.png",
                            label: "Atomium",
                        },
                        {
                            value: "car.png",
                            label: "Car",
                        },
                        {
                            value: "dolphin.png",
                            label: "Dolphin",
                        },
                        {
                            value: "tree.png",
                            label: "Tree",
                        },
                        {
                            value: "ship.png",
                            label: "Ship",
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Select,
                    title: "Preset",
                    id: "model-preset-select-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "primitives",
                            label: "Primitives",
                            checked: true,
                        },
                        {
                            value: "cube",
                            label: "Cube",
                        },
                        {
                            value: "monkey",
                            label: "Monkey",
                        },
                        {
                            value: "bunny",
                            label: "Bunny",
                        },
                        {
                            value: "atomium",
                            label: "Atomium",
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.FileUpload,
                    title: "Custom",
                    id: "input-heightmap-upload-button",
                    accept: [".png", ".jpg", ".bmp", ".webp"],
                    defaultMessage: "Upload a depth map"
                },
            ]
        },
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
                    type: Demopage.supportedControls.Select,
                    title: "Preset",
                    id: "tile-preset-select-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "wallpaper.png",
                            label: "Wallpaper",
                        },
                        
                        {
                            value: "space.png",
                            label: "Space",
                            checked: true,
                        },
                        {
                            value: "foliage.png",
                            label: "Foliage",
                        },
                        {
                            value: "giraffe.png",
                            label: "Giraffe",
                        },
                        {
                            value: "stones.png",
                            label: "Stones",
                        },
                        {
                            value: "leaves.png",
                            label: "Leaves",
                        }
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
                    title: "Square",
                    id: "tile-noise-square-checkbox-id",
                    checked: true,
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Colored",
                    id: "tile-noise-colored-checkbox-id",
                    checked: true,
                },
                {
                    type: Demopage.supportedControls.FileUpload,
                    title: "Custom",
                    id: "input-tile-upload-button",
                    accept: [".png", ".jpg", ".bmp", ".webp"],
                    defaultMessage: "Upload a pattern"
                },
            ]
        },
        {
            title: "Stripes",
            controls: [
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show UV",
                    id: "show-uv-checkbox-id",
                    checked: false,
                },
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Mode",
                    id: "stripes-mode-tabs-id",
                    unique: true,
                    options: [
                        {
                            value: "adaptative",
                            label: "Adaptative",
                            checked: true,
                        },
                        {
                            value: "fixed",
                            label: "Fixed",
                        },
                    ]
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Stripes width",
                    id: "stripes-width-range-id",
                    min: 20,
                    max: 200,
                    value: 80,
                    step: 1
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Stripes count",
                    id: "stripes-count-range-id",
                    min: 8,
                    max: 24,
                    value: 16,
                    step: 1
                },
            ]
        },
        {
            title: "Output",
            controls: [
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show indicators",
                    id: "show-indicators-checkbox-id",
                    checked: false,
                },
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
