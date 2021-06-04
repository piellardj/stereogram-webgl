import { gl } from "../gl-utils/gl-canvas";
import { ITexture } from "./i-texture";


class RenderToTexture implements ITexture {
    public readonly texture: WebGLTexture;
    public readonly framebuffer: WebGLFramebuffer;

    private _width: number;
    private _height: number;

    public constructor() {
        this.texture = gl.createTexture();
        this.framebuffer = gl.createFramebuffer();
        this._width = -1;
        this._height = -1;
    }

    public reserveSpace(wantedWidth: number, wantedHeight: number): void {
        wantedWidth = Math.ceil(wantedWidth);
        wantedHeight = Math.ceil(wantedHeight);

        if (this.width !== wantedWidth || this.height !== wantedHeight) {
            this._width = wantedWidth;
            this._height = wantedHeight;
            this.reserveSpaceInternal();
        }
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get id(): WebGLTexture {
        return this.texture;
    }

    protected reserveSpaceInternal(): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        const format = gl.RGBA;
        gl.texImage2D(gl.TEXTURE_2D, 0, format, this._width, this._height, 0, format, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export {
    RenderToTexture,
};
