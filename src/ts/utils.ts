import { Shader } from "./gl-utils/shader";
import * as Loader from "./loader";
import * as ShaderManager from "./gl-utils/shader-manager";

function asyncLoadShader(name: string, vertexFilename: string, fragmentFilename: string, callback: (shader: Shader) => unknown, injected: any = {}): void {
    const id = `shader-${name}`;
    Loader.registerLoadingObject(id);

    ShaderManager.buildShader({
        fragmentFilename,
        vertexFilename,
        injected,
    }, (builtShader: Shader | null) => {
        Loader.registerLoadedObject(id);

        if (builtShader !== null) {
            callback(builtShader);
        } else {
            Page.Demopage.setErrorMessage(`${name}-shader-error`, `Failed to build '${name}' shader.`);
        }
    });
}

export {
    asyncLoadShader,
};
