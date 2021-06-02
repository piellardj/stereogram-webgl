import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";
import { Heightmap } from "./heightmap";

import { ETileMode, Parameters } from "./parameters";
import { Tile } from "./tile";

import { asyncLoadShader } from "./utils";

class Engine {
    private readonly fullscreenVBO: VBO;

    private stereogramShader: Shader;
    private heightmapShader: Shader;

    private stripesCount: number = 16;

    public constructor() {
        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        asyncLoadShader("stereomap", "fullscreen.vert", "stereogram.frag", (shader: Shader) => {
            shader.a["aCorner"].VBO = this.fullscreenVBO;
            this.stereogramShader = shader;
        }, {
            STRIPES_COUNT: this.stripesCount.toFixed(1),
            LOOP_SIZE: Math.ceil(1.5 * this.stripesCount).toFixed(0),
        });

        asyncLoadShader("heightmap", "fullscreen.vert", "heightmap.frag", (shader: Shader) => {
            shader.a["aCorner"].VBO = this.fullscreenVBO;
            this.heightmapShader = shader;
        });
    }

    public draw(heightmap: Heightmap, tile: Tile): boolean {
        let shader: Shader;
        if (Parameters.showHeightmap) {
            shader = this.heightmapShader;
        } else {
            if (this.stereogramShader) {
                this.stereogramShader.u["uTileTexture"].value = tile.id;
                this.stereogramShader.u["uDepthFactor"].value = Parameters.depth;
                this.stereogramShader.u["uTileColor"].value = (Parameters.tileMode === ETileMode.NOISE && !Parameters.noiseTileColored) ? 0 : 1;
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

            return heightmap.loaded && tile.loaded;
        }

        return false;
    }
}

export {
    Engine,
};
