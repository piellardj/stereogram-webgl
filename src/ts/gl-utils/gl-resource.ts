abstract class GLResource {
    private _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    public gl(): WebGLRenderingContext {
        return this._gl;
    }

    public abstract freeGLResources(): void;
}

export { GLResource };
