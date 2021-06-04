import { ETileMode, Parameters } from "./parameters";
import { ImageTexture } from "./texture/image-texture";
import { createImageData } from "./utils";

interface ITileTexture {
    texture: ImageTexture;
    padding: number;
}

class Tile {
    private readonly tileTexture: ImageTexture;
    private currentTilePreset: string;

    private readonly randomTexture: ImageTexture;

    public constructor() {
        this.tileTexture = new ImageTexture();

        Parameters.tileUploadObservers.push((image: HTMLImageElement) => {
            this.tileTexture.uploadToGPU(image);
        });

        this.randomTexture = new ImageTexture();
    }

    public get current(): ITileTexture {
        if (Parameters.tileMode === ETileMode.TEXTURE) {
            if (this.currentTilePreset !== Parameters.tilePreset) {
                this.currentTilePreset = Parameters.tilePreset;
                this.tileTexture.loadFromUrl(`resources/tiles/${Parameters.tilePreset}`);
            }

            return {
                texture: this.tileTexture,
                padding: 0,
            };
        } else {
            return {
                texture: this.randomTexture,
                padding: 1,
            };
        }
    }

    public randomize(width: number, height: number): boolean {
        const usefulWidth = width;
        const usefulHeight = height;
        width += 2; // add padding for seamless linear interpolation
        height += 2;

        const data = new Uint8ClampedArray(width * height * 4);

        function computePaddingTexel(x: number, y: number): void {
            const originalX = (((x - 1) + usefulWidth) % usefulWidth) + 1;
            const originalY = (((y - 1) + usefulHeight) % usefulHeight) + 1;
            const targetTexelStart = 4 * (x + width * y);
            const originalTexelStart = 4 * (originalX + width * originalY);
            for (let i = 0; i < 4; i++) {
                data[targetTexelStart + i] = data[originalTexelStart + i];
            }
        }

        // compute actual texture
        for (let iY = 1; iY < height - 1; iY++) {
            for (let iX = 1; iX < width - 1; iX++) {
                const texelStart = 4 * (iX + width * iY);
                data[texelStart + 0] = Math.floor(255.9 * Math.random());
                data[texelStart + 1] = Math.floor(255.9 * Math.random());
                data[texelStart + 2] = Math.floor(255.9 * Math.random());
                data[texelStart + 3] = 255;
            }
        }

        // add padding
        for (let iX = 0; iX < width; iX++) {
            computePaddingTexel(iX, 0);
            computePaddingTexel(iX, height - 1);
        }

        for (let iY = 0; iY < height; iY++) {
            computePaddingTexel(0, iY);
            computePaddingTexel(width - 1, iY);
        }

        const imageData = createImageData(width, height, data);
        this.randomTexture.uploadToGPU(imageData);
        return true;
    }
}

export {
    Tile,
};
