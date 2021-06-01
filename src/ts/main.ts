import { Engine } from "./engine";

import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";

// import { Parameters } from "./parameters";

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
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);

    const canvas = Page.Canvas.getCanvas();

    const engine = new Engine();

    let needToRedraw = true;
    Page.Canvas.Observers.canvasResize.push(() => { needToRedraw = true; });

    function mainLoop(): void {
        if (needToRedraw) {
            GLCanvas.adjustSize(false);
            gl.viewport(0, 0, canvas.width, canvas.height);
            engine.draw();
            needToRedraw = false;
        }

        requestAnimationFrame(mainLoop);
    }
    mainLoop();
}

main();
