import { ETileMode, Parameters } from "./parameters";
import { ImageTexture } from "./texture/image-texture";
import { createImageData } from "./utils";

class Tile {
    private readonly tileTexture: ImageTexture;

    private readonly randomTexture: ImageTexture;

    public constructor() {
        this.tileTexture = new ImageTexture();
        this.tileTexture.loadFromUrl("resources/tile.png");

        Parameters.tileUploadObservers.push((image: HTMLImageElement) => {
            this.tileTexture.uploadToGPU(image);
        });

        this.randomTexture = new ImageTexture();
    }

    public get current(): ImageTexture {
        if (Parameters.tileMode === ETileMode.TEXTURE) {
            return this.tileTexture;
        } else {
            return this.randomTexture;
        }
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
