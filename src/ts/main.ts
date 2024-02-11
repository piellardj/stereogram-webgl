import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";

import { Engine } from "./engine";
import { Heightmap } from "./heightmap";
import { EHeightmapMode, ETileMode, Parameters } from "./parameters";
import { Tile } from "./tile";

import "./page-interface-generated";


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

    let nbFramesSinceLastUpdate = 0;
    setInterval(() => {
        Page.Canvas.setIndicatorText("fps-indicator", Math.round(nbFramesSinceLastUpdate).toFixed(0));
        nbFramesSinceLastUpdate = 0;

        const currentTile = tile.current.texture;
        Page.Canvas.setIndicatorText("tilesize-indicator", `${currentTile.width}x${currentTile.height}`);

        Page.Canvas.setIndicatorText("stripes-count-indicator", engine.stripesCount.toFixed(0));
    }, 1000);

    let needToDownload = false;
    Parameters.imageDownloadObservers.push(() => { needToDownload = true; });

    let needToRedraw = true;
    Parameters.redrawObservers.push(() => { needToRedraw = true; });

    let needToRecomputeNoiseTile = true;
    Parameters.recomputeNoiseTileObservers.push(() => { needToRecomputeNoiseTile = true; });

    function mainLoop(): void {
        nbFramesSinceLastUpdate++;

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
            const width = Parameters.noiseTileResolution;
            const height = Parameters.noiseTileSquare ? width : 5 * width;
            needToRecomputeNoiseTile = !tile.randomize(width, height);
        }

        if (needToRedraw) {
            GLCanvas.adjustSize(true);
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
        (window.navigator as any).msSaveBlob(blob, name);
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
