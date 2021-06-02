import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";
import { RenderToTextureWithDepth } from "./texture/render-to-texture-with-depth";
import { asyncLoadShader } from "./utils";

const UNIT_CUBE = new Float32Array([
    -.5, -.5, -.5,
    +.5, -.5, -.5,
    -.5, -.5, +.5,
    +.5, -.5, -.5,
    +.5, -.5, +.5,
    -.5, -.5, +.5,

    +.5, -.5, -.5,
    +.5, +.5, -.5,
    +.5, -.5, +.5,
    +.5, +.5, -.5,
    +.5, +.5, +.5,
    +.5, -.5, +.5,

    -.5, -.5, +.5,
    +.5, -.5, +.5,
    -.5, +.5, +.5,
    +.5, -.5, +.5,
    +.5, +.5, +.5,
    -.5, +.5, +.5,

    -.5, +.5, -.5,
    -.5, +.5, +.5,
    +.5, +.5, -.5,
    +.5, +.5, -.5,
    -.5, +.5, +.5,
    +.5, +.5, +.5,

    -.5, -.5, -.5,
    -.5, -.5, +.5,
    -.5, +.5, -.5,
    -.5, +.5, -.5,
    -.5, -.5, +.5,
    -.5, +.5, +.5,

    -.5, -.5, -.5,
    -.5, +.5, -.5,
    +.5, -.5, -.5,
    +.5, -.5, -.5,
    -.5, +.5, -.5,
    +.5, +.5, -.5,
]);

declare const mat4: any;

class Scene {
    protected readonly _depthMap: RenderToTextureWithDepth;

    protected readonly VBO: VBO;

    protected readonly modelMatrix: any;
    protected readonly viewMatrix: any;
    protected readonly projectionMatrix: any;
    protected readonly mvMatrix: any;
    protected readonly mvpMatrix: any;

    protected shader: Shader;

    public constructor() {
        this._depthMap = new RenderToTextureWithDepth();

        this.VBO = new VBO(gl, UNIT_CUBE, 3, gl.FLOAT, true);

        this.viewMatrix = mat4.create();
        const cameraPosition = [-2, 0, -1];
        const focusPoint = [0, 0, 0];
        const vertical = [0, 0, 1];
        mat4.lookAt(this.viewMatrix, cameraPosition, focusPoint, vertical);

        this.modelMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.mvMatrix = mat4.create();
        this.mvpMatrix = mat4.create();

        asyncLoadShader("scene", "scene.vert", "scene.frag", (shader: Shader) => {
            shader.a["aVertice"].VBO = this.VBO;
            shader.u["uMVPMatrix"].value = this.mvpMatrix;
            this.shader = shader;
        });
    }

    public computeDepthMap(width: number, height: number): void {
        if (this.shader) {
            mat4.fromRotation(this.modelMatrix, 0.0005 * performance.now(), [0, 0, 1]);
            mat4.multiply(this.mvMatrix, this.viewMatrix, this.modelMatrix);

            const near = 1.3;
            const far = 3;
            mat4.perspective(this.projectionMatrix, 45, width / height, near, far);
            mat4.multiply(this.mvpMatrix, this.projectionMatrix, this.mvMatrix);

            this._depthMap.reserveSpace(width, height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._depthMap.framebuffer);
            gl.viewport(0, 0, this._depthMap.width, this._depthMap.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line:no-bitwise

            this.shader.use();
            this.shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLES, 0, 3 * 2 * 6);
        }
    }

    public get depthMap(): RenderToTextureWithDepth {
        return this._depthMap;
    }
}

export {
    Scene,
};
