import { Vec3 } from "./vec3";

/* Column-first */
class Mat4 {
    private static _tmpMatrix = null; // helps for internal computing

    private static get tmpMatrix(): Mat4 {
        if (Mat4._tmpMatrix === null) {
            Mat4._tmpMatrix = new Mat4();
        }

        return Mat4._tmpMatrix;
    }

    private _val: Float32Array;

    constructor() {
        this._val = new Float32Array(16);
        this.identity();
    }

    public get val(): Float32Array {
        return this._val;
    }

    public identity(): void {
        for (let i = 0; i < 16; ++i) {
            this._val[i] = 0;
        }

        this._val[0] = 1;
        this._val[5] = 1;
        this._val[10] = 1;
        this._val[15] = 1;
    }

    public lookAt(eye: Vec3, center: Vec3, up: Vec3): void {
        if (eye.equals(center)) {
            this.identity();
            return;
        }

        const z = Vec3.substract(eye, center);
        z.normalize();

        const x = Vec3.crossProduct(up, z);
        x.normalize();

        const y = Vec3.crossProduct(z, x);
        y.normalize();

        this._val[0] = x.x;
        this._val[1] = y.x;
        this._val[2] = z.x;
        this._val[3] = 0;
        this._val[4] = x.y;
        this._val[5] = y.y;
        this._val[6] = z.y;
        this._val[7] = 0;
        this._val[8] = x.z;
        this._val[9] = y.z;
        this._val[10] = z.z;
        this._val[11] = 0;
        this._val[12] = -Vec3.dotProduct(x, eye);
        this._val[13] = -Vec3.dotProduct(y, eye);
        this._val[14] = -Vec3.dotProduct(z, eye);
        this._val[15] = 1;
    }

    public multiplyRight(m2: Mat4) {
        const tmp = Mat4.tmpMatrix._val;
        const myself = this._val;
        const other = m2._val;

        for (let iCol = 0; iCol < 4; ++iCol) {
            for (let iRow = 0; iRow < 4; ++iRow) {
                tmp[4 * iCol + iRow] = 0;

                for (let i = 0; i < 4; ++i) {
                    tmp[4 * iCol + iRow] += myself[4 * i + iRow] * other[4 * iCol + i];
                }
            }
        }

        this.swapWithTmpMatrix();
    }

    /* Returns false is the matrix cannot be inverted. */
    public invert(): boolean {
        // shortcuts
        const m = this._val;
        /* tslint:disable:one-variable-per-declaration */
        const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
        const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
        const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
        const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
        /* tslint:enable:one-variable-per-declaration */

        const b00 = m00 * m11 - m01 * m10;
        const b01 = m00 * m12 - m02 * m10;
        const b02 = m00 * m13 - m03 * m10;
        const b03 = m01 * m12 - m02 * m11;
        const b04 = m01 * m13 - m03 * m11;
        const b05 = m02 * m13 - m03 * m12;
        const b06 = m20 * m31 - m21 * m30;
        const b07 = m20 * m32 - m22 * m30;
        const b08 = m20 * m33 - m23 * m30;
        const b09 = m21 * m32 - m22 * m31;
        const b10 = m21 * m33 - m23 * m31;
        const b11 = m22 * m33 - m23 * m32;

        // Compute the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return false;
        }
        det = 1.0 / det;

        /* Compute the invert and store it on Mat4.tmp matrix */
        const tmpVals = Mat4.tmpMatrix._val;
        tmpVals[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det;
        tmpVals[1] = (m02 * b10 - m01 * b11 - m03 * b09) * det;
        tmpVals[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det;
        tmpVals[3] = (m22 * b04 - m21 * b05 - m23 * b03) * det;
        tmpVals[4] = (m12 * b08 - m10 * b11 - m13 * b07) * det;
        tmpVals[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det;
        tmpVals[6] = (m32 * b02 - m30 * b05 - m33 * b01) * det;
        tmpVals[7] = (m20 * b05 - m22 * b02 + m23 * b01) * det;
        tmpVals[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det;
        tmpVals[9] = (m01 * b08 - m00 * b10 - m03 * b06) * det;
        tmpVals[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
        tmpVals[11] = (m21 * b02 - m20 * b04 - m23 * b00) * det;
        tmpVals[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det;
        tmpVals[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det;
        tmpVals[14] = (m31 * b01 - m30 * b03 - m32 * b00) * det;
        tmpVals[15] = (m20 * b03 - m21 * b01 + m22 * b00) * det;

        this.swapWithTmpMatrix();

        return true;
    }

    public perspective(fovy: number, aspectRatio: number, nearPlane: number, farPlane: number): void {
        const f = 1 / Math.tan(fovy / 2);

        this._val[0] = f / aspectRatio;
        this._val[1] = 0;
        this._val[2] = 0;
        this._val[3] = 0;
        this._val[4] = 0;
        this._val[5] = f;
        this._val[6] = 0;
        this._val[7] = 0;
        this._val[8] = 0;
        this._val[9] = 0;
        this._val[11] = -1;
        this._val[12] = 0;
        this._val[13] = 0;
        this._val[15] = 0;

        if (farPlane === Infinity) {
            this._val[10] = -1;
            this._val[14] = -2 * nearPlane;
        } else {
            const tmp = 1 / (nearPlane - farPlane);
            this._val[10] = (farPlane + nearPlane) * tmp;
            this._val[14] = (2 * farPlane * nearPlane) * tmp;
        }
    }

    public perspectiveInverse(fovy: number, aspectRatio: number, nearPlane: number, farPlane: number): void {
        const f = Math.tan(fovy / 2);

        this._val[0] = aspectRatio * f;
        this._val[1] = 0;
        this._val[2] = 0;
        this._val[3] = 0;
        this._val[4] = 0;
        this._val[5] = f;
        this._val[6] = 0;
        this._val[7] = 0;
        this._val[8] = 0;
        this._val[9] = 0;
        this._val[10] = 0;
        this._val[12] = 0;
        this._val[13] = 0;
        this._val[14] = -1;

        if (farPlane === Infinity) {
            this._val[11] = -0.5;
            this._val[15] = 0.5 / nearPlane;
        } else {
            const tmp = 0.5 / (nearPlane * farPlane);
            this._val[11] = (nearPlane - farPlane) * tmp;
            this._val[15] = (nearPlane + farPlane) * tmp;
        }
    }

    private swapWithTmpMatrix(): void {
        const tmp = Mat4.tmpMatrix._val;
        Mat4.tmpMatrix._val = this._val;
        this._val = tmp;
    }
}

export { Mat4 };
