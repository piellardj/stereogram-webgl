import { Engine } from "./engine";

import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";

import { EHeightmapMode, ETileMode, Parameters } from "./parameters";

import "./page-interface-generated";
import { Heightmap } from "./heightmap";
import { Tile } from "./tile";


function main(): void {
    const webglFlags = {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
    };
    if (!GLCanvas.initGL(webglFlags)) {
        return;
    }
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);

    const canvas = Page.Canvas.getCanvas();

    const engine = new Engine();
    const heightmap = new Heightmap();
    const tile = new Tile();

    let needToDownload = false;
    Parameters.imageDownloadObservers.push(() => { needToDownload = true; });

    let needToRedraw = true;
    Parameters.redrawObservers.push(() => { needToRedraw = true; });

    let needToRecomputeNoiseTile = true;
    Parameters.recomputeNoiseTileObservers.push(() => { needToRecomputeNoiseTile = true; });

    function mainLoop(): void {
        if (needToDownload) {
            // redraw before resizing the canvas because the download pane might open, which changes the canvas size
            engine.draw(heightmap, tile); // redraw because preserveDrawingBuffer is false
            download(canvas);
            needToDownload = false;
        }

        if (Parameters.heightmapMode === EHeightmapMode.MOVING) {
            needToRecomputeNoiseTile = true;
            needToRedraw = true;
        }

        if (needToRecomputeNoiseTile && Parameters.tileMode === ETileMode.NOISE) {
            const resolution = Parameters.noiseTileResolution;
            needToRecomputeNoiseTile = !tile.randomize(resolution, resolution);
        }

        if (needToRedraw) {
            GLCanvas.adjustSize(false);
            needToRedraw = !engine.draw(heightmap, tile);
        }

        requestAnimationFrame(mainLoop);
    }
    mainLoop();
}

function download(canvas: HTMLCanvasElement): void {
    const name = "stereogram.png";

    if ((canvas as any).msToBlob) { // for IE
        const blob = (canvas as any).msToBlob();
        window.navigator.msSaveBlob(blob, name);
    } else {
        canvas.toBlob((blob: Blob) => {
            const link = document.createElement("a");
            link.download = name;
            link.href = URL.createObjectURL(blob);
            link.click();
        });
    }
}

main();
