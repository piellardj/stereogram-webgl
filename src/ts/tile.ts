import { ImageTexture } from "./image-texture";

class Tile {
    private readonly tileTexture: ImageTexture;

    public constructor() {
        this.tileTexture = new ImageTexture();
        this.tileTexture.loadFromUrl("resources/tile.png");
    }

    public get id(): WebGLTexture {
        return this.tileTexture.id;
    }
}

export {
    Tile,
};
