function resizeCanvas(gl: WebGLRenderingContext, hidpi: boolean = false): void {
    const cssPixel: number = (hidpi) ? window.devicePixelRatio : 1;

    const width: number = Math.floor(gl.canvas.clientWidth * cssPixel);
    const height: number = Math.floor(gl.canvas.clientHeight * cssPixel);
    if (gl.canvas.width != width || gl.canvas.height != height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
}

export { resizeCanvas };