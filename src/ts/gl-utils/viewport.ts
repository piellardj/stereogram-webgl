class Viewport {
    public static setFullCanvas(gl: WebGLRenderingContext): void {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    public lower: number;
    public left: number;
    public width: number;
    public height: number;

    constructor(left: number, lower: number, width: number, height: number) {
        this.left = left;
        this.lower = lower;
        this.width = width;
        this.height = height;
    }

    public set(gl: WebGLRenderingContext): void {
        gl.viewport(this.lower, this.left, this.width, this.height);
    }
}

export { Viewport };
