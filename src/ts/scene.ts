import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { asyncLoadObjModel, ObjModel } from "./obj-model";
import { Parameters } from "./parameters";
import { RenderToTextureWithDepth } from "./texture/render-to-texture-with-depth";
import { asyncLoadShader } from "./utils";

interface IScenePreset {
    modelName: string;
    cameraPosition: [number, number, number];
    nearPlane: number;
    farPlane: number;
    model?: ObjModel;
}

const presets: { [id: string]: IScenePreset } = {
    "primitives": {
        modelName: "primitives.obj",
        cameraPosition: [-1.3, 0, -0.5],
        nearPlane: 0.6,
        farPlane: 2.2,
    },
    "cube": {
        modelName: "cube.obj",
        cameraPosition: [-2, 0, -1],
        nearPlane: 1.3,
        farPlane: 3,
    },
    "monkey": {
        modelName: "monkey.obj",
        cameraPosition: [-1.3, 0, -0.5],
        nearPlane: 0.7,
        farPlane: 2,
    },
    "bunny": {
        modelName: "bunny.obj",
        cameraPosition: [-1.7, 0, -0.8],
        nearPlane: 0.9,
        farPlane: 2.3,
    }
};

declare const mat4: any;

class Scene {
    private readonly _depthMap: RenderToTextureWithDepth;

    private readonly modelMatrix: any;
    private readonly viewMatrix: any;
    private readonly projectionMatrix: any;
    private readonly mvMatrix: any;
    private readonly mvpMatrix: any;

    private shader: Shader;

    public constructor() {
        this._depthMap = new RenderToTextureWithDepth();

        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.mvMatrix = mat4.create();
        this.mvpMatrix = mat4.create();

        asyncLoadShader("scene", "scene.vert", "scene.frag", (shader: Shader) => {
            shader.u["uMVPMatrix"].value = this.mvpMatrix;
            this.shader = shader;
        });
    }

    public computeDepthMap(width: number, height: number): void {
        if (this.shader) {
            const smallestDimension = Math.min(width, height);
            width = smallestDimension;
            height = smallestDimension;

            const modelPreset = presets[Parameters.modelId];

            mat4.lookAt(this.viewMatrix, modelPreset.cameraPosition, [0, 0, 0], [0, 0, 1]);

            mat4.fromRotation(this.modelMatrix, 0.0005 * performance.now(), [0, 0, 1]);
            mat4.multiply(this.mvMatrix, this.viewMatrix, this.modelMatrix);

            mat4.perspective(this.projectionMatrix, 45, width / height, modelPreset.nearPlane, modelPreset.farPlane);
            mat4.multiply(this.mvpMatrix, this.projectionMatrix, this.mvMatrix);

            this._depthMap.reserveSpace(width, height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._depthMap.framebuffer);
            gl.viewport(0, 0, this._depthMap.width, this._depthMap.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line:no-bitwise

            if (typeof modelPreset.model === "undefined") {
                modelPreset.model = null;
                asyncLoadObjModel(modelPreset.modelName, (model: ObjModel) => {
                    modelPreset.model = model;
                });
            }

            if (modelPreset.model) {
                const model = modelPreset.model;

                this.shader.a["aVertice"].VBO = model.VBO;
                this.shader.use();
                this.shader.bindUniformsAndAttributes();

                gl.drawArrays(gl.TRIANGLES, 0, 3 * model.trianglesCount);
            }
        }
    }

    public get depthMap(): RenderToTextureWithDepth {
        return this._depthMap;
    }
}

export {
    Scene,
};
