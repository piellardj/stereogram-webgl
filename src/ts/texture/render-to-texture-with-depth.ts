import { gl } from "../gl-utils/gl-canvas";

import { RenderToTexture } from "./render-to-texture";

import "../page-interface-generated";


class RenderToTextureWithDepth extends RenderToTexture {
    private readonly depthTexture: WebGLTexture;

    public constructor() {
        super();

        const extension = gl.getExtension("WEBGL_depth_texture");
        if (extension) {
            this.depthTexture = gl.createTexture();
        } else {
            Page.Demopage.setErrorMessage("WEBGL_depth_texture-unavailable", "WebGL extension 'WEBGL_depth_texture' is not available.");
        }
    }

    protected reserveSpaceInternal(): void {
        super.reserveSpaceInternal();

        if (this.depthTexture) {
            gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
}

export {
    RenderToTextureWithDepth,
};

