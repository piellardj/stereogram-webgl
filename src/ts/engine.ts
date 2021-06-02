import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";
import { Heightmap } from "./heightmap";

import { Parameters } from "./parameters";
import { Tile } from "./tile";

import { asyncLoadShader } from "./utils";

class Engine {
    private readonly fullscreenVBO: VBO;

    private stereogramShader: Shader;
    private heightmapShader: Shader;

    public constructor() {
        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        asyncLoadShader("stereomap", "fullscreen.vert", "stereogram.frag", (shader: Shader) => {
            shader.a["aCorner"].VBO = this.fullscreenVBO;
            this.stereogramShader = shader;
        });

        asyncLoadShader("heightmap", "fullscreen.vert", "heightmap.frag", (shader: Shader) => {
            shader.a["aCorner"].VBO = this.fullscreenVBO;
            this.heightmapShader = shader;
        });
    }

    public draw(heightmap: Heightmap, tile: Tile): void {
        let shader: Shader;
        if (Parameters.showHeightmap) {
            shader = this.heightmapShader;
        } else {
            if (this.stereogramShader) {
                this.stereogramShader.u["uTileTexture"].value = tile.id;
                this.stereogramShader.u["uDepthFactor"].value = Parameters.depth;
                this.stereogramShader.u["uShowUV"].value = Parameters.showUV ? 1 : 0;

                shader = this.stereogramShader;
            }
        }

        if (shader) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            shader.u["uHeightmapTexture"].value = heightmap.id;
            shader.use();
            shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
}

export {
    Engine,
};
