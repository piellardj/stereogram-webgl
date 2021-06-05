import { gl } from "../gl-utils/gl-canvas";

import { createImageData } from "../utils";
import { ITexture } from "./i-texture";


const defaultImageData = createImageData(1, 1, new Uint8ClampedArray([0, 0, 0, 0]));

class ImageTexture implements ITexture {
    public readonly id: WebGLTexture;

    private _width: number = -1;
    private _height: number = -1;

    public constructor() {
        this.id = gl.createTexture();

        this.uploadToGPU(defaultImageData);
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

