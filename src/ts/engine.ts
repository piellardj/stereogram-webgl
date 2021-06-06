import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";

import { Heightmap } from "./heightmap";
import { EStripesMode, ETileMode, Parameters } from "./parameters";
import * as StereogramShader from "./stereogram-shader";
import { Tile } from "./tile";
import { asyncLoadShader, clamp } from "./utils";


class Engine {
    private static readonly MIN_STRIPES_COUNT: number = 8;
    private static readonly MAX_STRIPES_COUNT: number = 24;

    private readonly fullscreenVBO: VBO;

    private heightmapShader: Shader;

    public stripesCount: number;

    public constructor() {
        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        asyncLoadShader("heightmap", "fullscreen.vert", "heightmap.frag", (shader: Shader) => {
            this.heightmapShader = shader;
        });
    }

    public draw(heightmap: Heightmap, tile: Tile): boolean {
        const currentTile = tile.current;
        const heightmapTexture = heightmap.current;

        this.stripesCount = this.computeIdealStripeCount();
        const usefulStripesProportion = this.stripesCount / (this.stripesCount + 1);
        let heightmapHScaling = 1;

        let shader: Shader;
        if (Parameters.showHeightmap) {
            shader = this.heightmapShader;
            heightmapHScaling = usefulStripesProportion;
        } else {
            shader = StereogramShader.getShader(this.stripesCount);

            if (shader) {
                const tileUsefulWidth = currentTile.texture.width - 2 * currentTile.padding;
                const tileUsefulHeight = currentTile.texture.height - 2 * currentTile.padding;

                const tileWidthInPixel = gl.canvas.width / (this.stripesCount + 1);
                const tileHeightInPixel = tileWidthInPixel / (tileUsefulWidth / tileUsefulHeight);
                const tileHeight = tileHeightInPixel / gl.canvas.height;

                shader.u["uTileTexture"].value = currentTile.texture.id;
                shader.u["uTileColor"].value = (Parameters.tileMode === ETileMode.NOISE && !Parameters.noiseTileColored) ? 0 : 1;
                shader.u["uTileHeight"].value = tileHeight;
                shader.u["uTileScaling"].value = [tileUsefulWidth / currentTile.texture.width, tileUsefulHeight / currentTile.texture.height];
                shader.u["uShowUV"].value = Parameters.showUV ? 1 : 0;
            }
        }

        if (shader) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line:no-bitwise

            shader.a["aCorner"].VBO = this.fullscreenVBO;
            shader.u["uHeightmapTexture"].value = heightmapTexture.id;
            shader.u["uInvertHeightmap"].value = Parameters.invertHeightmap;
            shader.u["uDepthFactor"].value = Parameters.depth;

            const canvasAspectRatio = (gl.canvas.width * usefulStripesProportion) / gl.canvas.height;
            const heightmapAspectRatio = heightmapTexture.width / heightmapTexture.height;
            if (canvasAspectRatio > heightmapAspectRatio) {
                shader.u["uHeightmapScaling"].value = [canvasAspectRatio / heightmapAspectRatio / heightmapHScaling, 1];
            } else {
                shader.u["uHeightmapScaling"].value = [1 / heightmapHScaling, heightmapAspectRatio / canvasAspectRatio];
            }

            shader.use();
            shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            return true;
        }

        return false;
    }

    private computeIdealStripeCount(): number {
        if (Parameters.stripesMode === EStripesMode.ADAPTATIVE) {
            const idealCount = Math.round(gl.canvas.width / Parameters.stripesWidth);
            return clamp(Engine.MIN_STRIPES_COUNT, Engine.MAX_STRIPES_COUNT, idealCount);
        } else {
            return Parameters.stripesCount;
        }
    }
}

export {
    Engine,
};

