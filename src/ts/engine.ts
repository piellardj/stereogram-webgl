import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import { VBO } from "./gl-utils/vbo";
import { Heightmap } from "./heightmap";

import { ImageTexture } from "./image-texture";
import * as Loader from "./loader";
import { Parameters } from "./parameters";


class Engine {
    private readonly tileTexture: ImageTexture;

    private readonly fullscreenVBO: VBO;

    private stereogramShader: Shader;
    private heightmapShader: Shader;

    public constructor() {
        this.tileTexture = new ImageTexture();
        this.tileTexture.loadFromUrl("resources/tile.png");

        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        this.asyncLoadShader("stereomap", "fullscreen.vert", "stereogram.frag", (shader: Shader) => {
            this.stereogramShader = shader;
            this.stereogramShader.u["uTileTexture"].value = this.tileTexture.id;
        });

        this.asyncLoadShader("heightmap", "fullscreen.vert", "heightmap.frag", (shader: Shader) => {
            this.heightmapShader = shader;
        });
    }

    public draw(heightmap: Heightmap): void {
        let shader: Shader;
        if (Parameters.showHeightmap) {
            shader = this.heightmapShader;
        } else {
            if (this.stereogramShader) {
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
