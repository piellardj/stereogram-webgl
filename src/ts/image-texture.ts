import { gl } from "./gl-utils/gl-canvas";
import * as Loader from "./loader";
import { createImageData } from "./utils";


const defaultImageData = createImageData(1, 1, new Uint8ClampedArray([0, 0, 0, 0]));

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
