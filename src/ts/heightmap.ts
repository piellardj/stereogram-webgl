import { gl } from "./gl-utils/gl-canvas";
import { ImageTexture } from "./texture/image-texture";
import { EHeightmapMode, Parameters } from "./parameters";
import { Scene } from "./scene";
import { IAsyncTexture } from "./texture/i-texture";

class Heightmap {
    private readonly heightmapTexture: ImageTexture;
    private readonly scene: Scene;

    public constructor() {
        this.heightmapTexture = new ImageTexture();
        this.heightmapTexture.loadFromUrl("resources/heightmap.png");

        this.scene = new Scene();

        Parameters.heightmapUploadObservers.push((image: HTMLImageElement) => {
            this.heightmapTexture.uploadToGPU(image);
        });
    }

    public get current(): IAsyncTexture {
        if (Parameters.heightmapMode === EHeightmapMode.MOVING) {
            this.scene.computeDepthMap(gl.canvas.width, gl.canvas.height);
            this.scene.depthMap.loaded = true;
            return this.scene.depthMap;
        } else {
            return this.heightmapTexture;
        }
    }
}

export {
    Heightmap,
};
