import { gl } from "./gl-utils/gl-canvas";
import * as Loader from "./loader";

function buildDefaultImageData(): ImageData {
    const v = 0;

    try {
        return new ImageData(new Uint8ClampedArray([v, v, v, v]), 1, 1);
    } catch {
        console.log("Failed to create default ImageData from constructor, using Canvas2D instead...");

        const hiddenCanvas = document.createElement("canvas");
        const context = hiddenCanvas.getContext("2d");
        const result = context.createImageData(1, 1);
        for (let i = 0; i < result.data.length; i++) {
            result.data[i] = v;
        }
        return result;
    }
}

const defaultImageData = buildDefaultImageData();

class ImageTexture {
    public readonly id: WebGLTexture;
    private _width: number = -1;
    private _height: number = -1;

    public constructor(image?: ImageData) {
        this.id = gl.createTexture();

        this.uploadToGPU(image ?? defaultImageData);
    }

    public loadFromUrl(url: string): void {
        url = `${url}?v=${Page.version}`;

        Loader.registerLoadingObject(url);

        const rampImage = new Image();
        rampImage.addEventListener("load", () => {
            Loader.registerLoadedObject(url);
            this.uploadToGPU(rampImage);
        });

        rampImage.src = url;
    }

    public uploadToGPU(image: HTMLImageElement | ImageData): void {
        this._width = image.width;
        this._height = image.height;

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public get width(): number {
        return this._width;
    }
    public get height(): number {
        return this._height;
    }
}

export {
    ImageTexture,
};
