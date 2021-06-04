import { gl } from "./gl-utils/gl-canvas";
import { ImageTexture } from "./texture/image-texture";
import { EHeightmapMode, Parameters } from "./parameters";
import { Scene } from "./scene";
import { ITexture } from "./texture/i-texture";

class Heightmap {
    private readonly heightmapTexture: ImageTexture;

    private readonly scene: Scene;

    public constructor() {
        this.heightmapTexture = new ImageTexture();

        this.scene = new Scene();

        Parameters.heightmapChangeObservers.push((image: HTMLImageElement) => {
            this.heightmapTexture.uploadToGPU(image);
        });
    }

    public get current(): ITexture {
        if (Parameters.heightmapMode === EHeightmapMode.MOVING) {
            this.scene.computeDepthMap(gl.canvas.width, gl.canvas.height);
            return this.scene.depthMap;
        } else {
            return this.heightmapTexture;
        }
    }
}

export {
    Heightmap,
};
