import { Shader } from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";

import * as Loader from "./loader";


function asyncLoadShader(name: string, vertexFilename: string, fragmentFilename: string, callback: (shader: Shader) => unknown, injected: any = {}): void {
    const id = `shader-${name}`;
    Loader.registerLoadingObject(id);

    ShaderManager.buildShader({
        fragmentFilename,
        vertexFilename,
        injected,
    }, (builtShader: Shader | null) => {
        Loader.registerLoadedObject(id);

        if (builtShader !== null) {
            callback(builtShader);
        } else {
            Page.Demopage.setErrorMessage(`${name}-shader-error`, `Failed to build '${name}' shader.`);
        }
    });
}

let hiddenCanvas: HTMLCanvasElement;
let hiddenCanvasContext: CanvasRenderingContext2D;

function createImageData(width: number, height: number, data: Uint8ClampedArray): ImageData {
    if (data.length !== width * height * 4) {
        throw new Error(`Incoherent image data: width=${width} height=${height} data.length=${data.length}`);
    }

    try {
        return new ImageData(data, width, height);
    } catch {
        console.log("Failed to create default ImageData from constructor, using Canvas2D instead...");

        if (!hiddenCanvas) {
            hiddenCanvas = document.createElement("canvas");
            hiddenCanvasContext = hiddenCanvas.getContext("2d");
        }

        const result = hiddenCanvasContext.createImageData(width, height);
        for (let i = 0; i < result.data.length; i++) {
            result.data[i] = data[i];
        }
        return result;
    }
}

function clamp(min: number, max: number, x: number): number {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    }
    return x;
}

export {
    asyncLoadShader,
    clamp,
    createImageData,
};

