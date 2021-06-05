import { Shader } from "./gl-utils/shader";

import { asyncLoadShader } from "./utils";


type IShaderCollection = { [stripesCount: number]: Shader | null };

const shadersCollection: IShaderCollection = {};

function getShader(stripesCount: number): Shader | null {
    if (shadersCollection[stripesCount]) {
        return shadersCollection[stripesCount];
    } else if (typeof shadersCollection[stripesCount] === "undefined") { // not loaded yet
        shadersCollection[stripesCount] = null; // register it as "loading"

        asyncLoadShader("stereomap", "fullscreen.vert", "stereogram.frag", (loadedShader: Shader) => {
            shadersCollection[stripesCount] = loadedShader;
        }, {
            STRIPES_COUNT: stripesCount.toFixed(1),
            LOOP_SIZE: Math.ceil(1.5 * stripesCount).toFixed(0),
        });
    }

    return null;
}

export {
    getShader,
};

