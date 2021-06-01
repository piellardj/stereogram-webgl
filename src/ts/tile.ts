import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";
import { ETileMode, Parameters } from "./parameters";
import { ImageTexture } from "./image-texture";
import { RenderToTexture } from "./texture/render-to-texture";
import { asyncLoadShader } from "./utils";

class Tile {
    private readonly fullscreenVBO: VBO;

    private readonly tileTexture: ImageTexture;

    private readonly randomTexture: RenderToTexture;

    private randomShader: Shader;

    public constructor() {
        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        this.tileTexture = new ImageTexture();
        this.tileTexture.loadFromUrl("resources/tile.png");

        this.randomTexture = new RenderToTexture();

        asyncLoadShader("random-shader", "fullscreen.vert", "random.frag", (shader: Shader) => {
            shader.a["aCorner"].VBO = this.fullscreenVBO;
            this.randomShader = shader;
        });
    }

    public get id(): WebGLTexture {
        if (Parameters.tileMode === ETileMode.TEXTURE) {
            return this.tileTexture.id;
        } else {
            return this.randomTexture.texture;
        }
    }

    public randomize(width: number, height: number): boolean {
        if (this.randomShader) {
            this.randomTexture.reserveSpace(width, height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.randomTexture.framebuffer);
            gl.viewport(0, 0, this.randomTexture.width, this.randomTexture.height);
            this.randomShader.u["uSeed"].value = [Math.random(), Math.random()];
            this.randomShader.u["uColored"].value = Parameters.noiseTileColored ? 1 : 0;
            this.randomShader.use();
            this.randomShader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            return true;
        }
        return false;
    }
}

export {
    Tile,
};
