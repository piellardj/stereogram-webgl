import { ImageTexture } from "./image-texture";

class Heightmap {
    private readonly heightmapTexture: ImageTexture;

    public constructor() {
        this.heightmapTexture = new ImageTexture();
        this.heightmapTexture.loadFromUrl("resources/heightmap.png");
    }

    public get id(): WebGLTexture {
        return this.heightmapTexture.id;
    }

    public get loaded(): boolean {
        return this.heightmapTexture.loaded;
    }
}

export {
    Heightmap,
};
