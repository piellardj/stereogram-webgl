import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";
import { Viewport } from "./gl-utils/viewport";

import { Heightmap } from "./heightmap";
import { EMainStripe, EStripesMode, ETileMode, Parameters } from "./parameters";
import * as StereogramShader from "./stereogram-shader";
import { ImageTexture } from "./texture/image-texture";
import { Tile } from "./tile";
import { asyncLoadShader, clamp } from "./utils";


class Engine {
    private static readonly MIN_STRIPES_COUNT: number = 8;
    private static readonly MAX_STRIPES_COUNT: number = 24;

    private readonly fullscreenVBO: VBO;

    private heightmapShader: Shader;
    private readonly watermarkTexture: ImageTexture = new ImageTexture();
    private watermarkShader: Shader;

    public stripesCount: number;

    public constructor() {
        this.fullscreenVBO = VBO.createQuad(gl, -1, -1, 1, 1);

        asyncLoadShader("heightmap", "fullscreen.vert", "heightmap.frag", (shader: Shader) => {
            this.heightmapShader = shader;
        });
        asyncLoadShader("creds", "fullscreen.vert", "copy-texture.frag", (shader: Shader) => {
            this.watermarkShader = shader;
        });

        const credImage = new Image();
        const uploadCred = () => {
            this.watermarkTexture.uploadToGPU(credImage);
        };
        credImage.addEventListener("load", uploadCred);
        credImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAUCAMAAAAA/fAzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURQAAAP///wAAAHPGg3EAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKFSURBVFhH7VSLjhsxCEzy/x999jwA492k2Yvaq3SjGJgBbJarenv84o/xu6w38POXdbv9mBm3Qdpsg4Lb71DmLL/oqjUaBbo0a45v/jwOnlqko2TRQAe336EM7Q7pTIJkVaNAl8BTKeHnsT4FrBIDaiN2sLhE13sBLpsQP8FpmxPyFO4kBa6Le6J+9YGNC6Ide7/KYSrabHdx+x3KTIsrByAIS1+7xVRt6KsVm/Ap5HMLDj4SEsuxLKpncP/5zCWjS3ec3GJ62tc7Wv+ncXD9lDielzX2x63etdzh1Yhi+dBRz2BEqfNO60OhjDQDqEqRQnej6PQMyruzni7ywzhYdKj+ZX7SYWcBwTJkWEbmBKJxMF0sCwnkaNOw2CwML6phFE60EluKSPKgZp4JNoM1kyFp4RTMq+fdUFLHCqgBqFnywUsrdxX/Z6nIdi66FssrEUzFCO2AoldLXw5kmAlsK6Wa9DiFLnOIu8beec/tHyjz2J35lMDlZbGq82UhBBymPo3UFMMBRa+WvhzIMIGUpqm5wkNuHH4YeyeKzp/hZQWlsbfFrq4sa/mLzlNis6KnbQd/SfO4RcxG6sLHkRyBObzyeXfy+Bl9WTMQ10S067Lwr5Celad+nKDmCGntMMRaKFkRcmLgdBTsIKaMqAhyGRQ+mydNDsJEQCxz45AjQb0sC8lpvoftig/difmu4On7/PqnqP0sZ4v2eRnaf2ITnkJTHw9fvunF1xW8eh8f/2RbrV/VtSPCV17YHqPQ1SjMxFqiGXKUmsaUEcrDBQ77Cno9biLE4M7hYphFeh/qbyMMiF7G1Sv4+vX31d77yY8y7wD99YJN+Mv47vvH/f/wg/43PB5frhkVzqJiDtMAAAAASUVORK5CYII=";
        uploadCred();
    }

    public draw(heightmap: Heightmap, tile: Tile): boolean {
        const currentTile = tile.current;
        const heightmapTexture = heightmap.current;

        this.stripesCount = this.computeIdealStripeCount();
        const usefulStripesProportion = this.stripesCount / (this.stripesCount + 1);
        let heightmapHScaling = 1;

        let shader: Shader;
        if (Parameters.showHeightmap) {
            shader = this.heightmapShader;
            heightmapHScaling = usefulStripesProportion;
        } else {
            shader = StereogramShader.getShader(this.stripesCount);

            if (shader) {
                const tileUsefulWidth = currentTile.texture.width - 2 * currentTile.padding;
                const tileUsefulHeight = currentTile.texture.height - 2 * currentTile.padding;

                const tileWidthInPixel = this.canvasWidth / (this.stripesCount + 1);
                const tileHeightInPixel = tileWidthInPixel / (tileUsefulWidth / tileUsefulHeight);
                const tileHeight = tileHeightInPixel / this.canvasHeight;

                shader.u["uTileTexture"].value = currentTile.texture.id;
                shader.u["uTileColor"].value = (Parameters.tileMode === ETileMode.NOISE && !Parameters.noiseTileColored) ? 0 : 1;
                shader.u["uTileHeight"].value = tileHeight;
                shader.u["uTileScaling"].value = [tileUsefulWidth / currentTile.texture.width, -tileUsefulHeight / currentTile.texture.height];
                shader.u["uShowUV"].value = Parameters.showUV ? 1 : 0;
                shader.u["uMainStripe"].value = (Parameters.mainStripe === EMainStripe.LEFT) ? 0 : Math.floor(this.stripesCount / 2);
            }
        }

        let drewStereogram = false;
        if (shader) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            Viewport.setFullCanvas(gl);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line:no-bitwise

            shader.a["aCorner"].VBO = this.fullscreenVBO;
            shader.u["uHeightmapTexture"].value = heightmapTexture.id;
            shader.u["uInvertHeightmap"].value = Parameters.invertHeightmap;
            shader.u["uDepthFactor"].value = Parameters.depth;

            const canvasAspectRatio = this.canvasWidth / this.canvasHeight * usefulStripesProportion;
            const heightmapAspectRatio = heightmapTexture.width / heightmapTexture.height;
            if (canvasAspectRatio > heightmapAspectRatio) {
                shader.u["uHeightmapScaling"].value = [canvasAspectRatio / heightmapAspectRatio / heightmapHScaling, -1];
            } else {
                shader.u["uHeightmapScaling"].value = [1 / heightmapHScaling, -heightmapAspectRatio / canvasAspectRatio];
            }

            shader.use();
            shader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            drewStereogram = true;
        }

        let drewWatermark = false;
        if (this.watermarkShader && this.watermarkTexture.width > 0) {
            const watermarkWidth = this.watermarkTexture.width * window.devicePixelRatio;
            const watermarkHeight = this.watermarkTexture.height * window.devicePixelRatio;
            const left = Math.max(0, (gl.canvas.width - watermarkWidth) / 2);
            gl.viewport(left, gl.canvas.height - watermarkHeight, watermarkWidth, watermarkHeight);
            this.watermarkShader.a["aCorner"].VBO = this.fullscreenVBO;
            this.watermarkShader.u["uTexture"].value = this.watermarkTexture.id;
            this.watermarkShader.use();
            this.watermarkShader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            drewWatermark = true;
        }

        return drewStereogram && drewWatermark;
    }

    private computeIdealStripeCount(): number {
        if (Parameters.stripesMode === EStripesMode.ADAPTATIVE) {
            const idealCount = Math.round(this.canvasWidth / Parameters.stripesWidth);
            return clamp(Engine.MIN_STRIPES_COUNT, Engine.MAX_STRIPES_COUNT, idealCount);
        } else {
            return Parameters.stripesCount;
        }
    }

    private get canvasWidth(): number {
        return gl.canvas.width / window.devicePixelRatio;
    }

    private get canvasHeight(): number {
        return gl.canvas.height / window.devicePixelRatio;
    }
}

export {
    Engine
};

