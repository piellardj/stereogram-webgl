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

    public stripesCount: number = 16;

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
        const currentTile = tile.current;
        const heightmapTexture = heightmap.current;

        let shader: Shader;
        if (Parameters.showHeightmap) {
            shader = this.heightmapShader;
        } else {
            if (this.stereogramShader) {
                const tileUsefulWidth = currentTile.texture.width - 2 * currentTile.padding;
                const tileUsefulHeight = currentTile.texture.height - 2 * currentTile.padding;

                const tileWidthInPixel = gl.canvas.width / (this.stripesCount + 1);
                const tileHeightInPixel = tileWidthInPixel / (tileUsefulWidth / tileUsefulHeight);
                const tileHeight = tileHeightInPixel / gl.canvas.height;

                this.stereogramShader.u["uTileTexture"].value = currentTile.texture.id;
                this.stereogramShader.u["uTileColor"].value = (Parameters.tileMode === ETileMode.NOISE && !Parameters.noiseTileColored) ? 0 : 1;
                this.stereogramShader.u["uTileHeight"].value = tileHeight;
                this.stereogramShader.u["uTileScaling"].value = [tileUsefulWidth / currentTile.texture.width, tileUsefulHeight / currentTile.texture.height];
                this.stereogramShader.u["uShowUV"].value = Parameters.showUV ? 1 : 0;

                shader = this.stereogramShader;
            }
        }

        if (shader) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line:no-bitwise

            shader.u["uHeightmapTexture"].value = heightmapTexture.id;
            shader.u["uInvertHeightmap"].value = Parameters.invertHeightmap;
            shader.u["uDepthFactor"].value = Parameters.depth;

            const canvasAspectRatio = gl.canvas.width / gl.canvas.height;
            const heightmapAspectRatio = heightmapTexture.width / heightmapTexture.height;
            if (canvasAspectRatio > heightmapAspectRatio) {
                shader.u["uHeightmapScaling"].value = [canvasAspectRatio / heightmapAspectRatio, 1];
            } else {
                shader.u["uHeightmapScaling"].value = [1, heightmapAspectRatio / canvasAspectRatio];
            }

            shader.use();
            shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            return heightmapTexture.loaded && currentTile.texture.loaded;
        }

        return false;
    }
}

export {
    Engine,
};
