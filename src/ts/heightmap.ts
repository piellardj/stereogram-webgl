import { ImageTexture } from "./image-texture";
import { Parameters } from "./parameters";

class Heightmap {
    private readonly heightmapTexture: ImageTexture;

    public constructor() {
        this.heightmapTexture = new ImageTexture();
        this.heightmapTexture.loadFromUrl("resources/heightmap.png");

        Parameters.heightmapUploadObservers.push((image: HTMLImageElement) => {
            this.heightmapTexture.uploadToGPU(image);
        });
    }

    public get current(): ImageTexture {
        return this.heightmapTexture;
    }
}

export {
    Heightmap,
};
