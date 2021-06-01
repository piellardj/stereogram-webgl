import { GLResource } from "./gl-resource";

enum Usage {
    DYNAMIC,
    STATIC,
}

class VBO extends GLResource {
    public static createQuad(gl: WebGLRenderingContext, minX: number, minY: number, maxX: number, maxY: number): VBO {
        const vert = [
            minX, minY,
            maxX, minY,
            minX, maxY,
            maxX, maxY,
        ];

        return new VBO(gl, new Float32Array(vert), 2, gl.FLOAT, true);
    }

    private id: WebGLBuffer;
    private size: number;
    private type: GLenum;
    private normalize: GLboolean;
    private stride: GLsizei;
    private offset: GLintptr;
    private usage: Usage;

    constructor(gl: WebGLRenderingContext, array: any, size: number, type: GLenum, staticUsage: boolean = true) {
        super(gl);

        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        if (staticUsage) {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.size = size;
        this.type = type;
        this.normalize = false;
        this.stride = 0;
        this.offset = 0;
        this.usage = (staticUsage) ? Usage.STATIC : Usage.DYNAMIC;
    }

    public freeGLResources(): void {
        this.gl().deleteBuffer(this.id);
        this.id = null;
    }

    public bind(location: GLuint): void {
        const gl = super.gl();
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.vertexAttribPointer(location, this.size, this.type, this.normalize, this.stride, this.offset);
    }

    public setData(array: any): void {
        const gl = super.gl();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        if (this.usage === Usage.STATIC) {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

export { VBO };
