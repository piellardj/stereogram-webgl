import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import { VBO } from "./gl-utils/vbo";
import { Heightmap } from "./heightmap";

import * as Loader from "./loader";
import { Parameters } from "./parameters";
import { Tile } from "./tile";


class Engine {
    private readonly fullscreenVBO: VBO;

    private stereogramShader: Shader;
    private heightmapShader: Shader;

    public constructor() {
        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        this.asyncLoadShader("stereomap", "fullscreen.vert", "stereogram.frag", (shader: Shader) => {
            this.stereogramShader = shader;
        });

        this.asyncLoadShader("heightmap", "fullscreen.vert", "heightmap.frag", (shader: Shader) => {
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
                shader = this.stereogramShader;
            }
        }

        if (shader) {
            shader.u["uHeightmapTexture"].value = heightmap.id;
            shader.use();
            shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }

    private asyncLoadShader(name: string, vertexFilename: string, fragmentFilename: string, callback: (shader: Shader) => unknown, injected: any = {}): void {
        const id = `shader-${name}`;
        Loader.registerLoadingObject(id);

        ShaderManager.buildShader({
            fragmentFilename,
            vertexFilename,
            injected,
        }, (builtShader: Shader | null) => {
            Loader.registerLoadedObject(id);

            if (builtShader !== null) {
                builtShader.a["aCorner"].VBO = this.fullscreenVBO;
                callback(builtShader);
            } else {
                Page.Demopage.setErrorMessage(`${name}-shader-error`, `Failed to build '${name}' shader.`);
            }
        });
    }
}

export {
    Engine,
};
