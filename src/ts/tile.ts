import { ETileMode, Parameters } from "./parameters";
import { ImageTexture } from "./image-texture";
import { createImageData } from "./utils";

class Tile {
    private readonly tileTexture: ImageTexture;

    private readonly randomTexture: ImageTexture;

    public constructor() {
        this.tileTexture = new ImageTexture();
        this.tileTexture.loadFromUrl("resources/tile.png");

        this.randomTexture = new ImageTexture();
    }

    public get id(): WebGLTexture {
        if (Parameters.tileMode === ETileMode.TEXTURE) {
            return this.tileTexture.id;
        } else {
            return this.randomTexture.id;
        }
    }

    public get loaded(): boolean {
        return this.tileTexture.loaded;
    }

    public randomize(width: number, height: number): boolean {
        const data = new Uint8ClampedArray(width * height * 4);

        let i = 0;
        while (i < data.length) {
            data[i++] = Math.floor(255.9 * Math.random());
            data[i++] = Math.floor(255.9 * Math.random());
            data[i++] = Math.floor(255.9 * Math.random());
            data[i++] = 255;
        }

        const imageData = createImageData(width, height, data);
        this.randomTexture.uploadToGPU(imageData);
        return true;
    }
}

export {
    Tile,
};
