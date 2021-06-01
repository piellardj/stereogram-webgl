import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import { VBO } from "./gl-utils/vbo";

import { ImageTexture } from "./image-texture";
import * as Loader from "./loader";


class Engine {
    private readonly tileTexture: ImageTexture;
    private readonly heightmapTexture: ImageTexture;

    private readonly fullscreenVBO: VBO;

    private shader: Shader;

    public constructor() {
        this.tileTexture = new ImageTexture();
        this.tileTexture.loadFromUrl("resources/tile.png");

        this.heightmapTexture = new ImageTexture();
        this.heightmapTexture.loadFromUrl("resources/heightmap.png");

        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        {
            const id = `shader`;
            Loader.registerLoadingObject(id);

            ShaderManager.buildShader({
                fragmentFilename: "shader.frag",
                vertexFilename: "shader.vert",
                injected: {}
            }, (builtShader: Shader | null) => {
                Loader.registerLoadedObject(id);

                if (builtShader !== null) {
                    builtShader.a["aCorner"].VBO = this.fullscreenVBO;
                    builtShader.u["uTileTexture"].value = this.tileTexture.id;
                    builtShader.u["uHeightmapTexture"].value = this.heightmapTexture.id;
                    // builtShader.u["uStripesCount"].value = 8;
                    this.shader = builtShader;
                } else {
                    Page.Demopage.setErrorMessage(`shader-error`, `Failed to build shader.`);
                }
            });
        }
    }

    public draw(): void {
        if (this.shader) {
            this.shader.use();
            this.shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
}

export {
    Engine,
};
