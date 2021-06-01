const EPSILON = 0.0001;

class Vec3 {
    public static dotProduct(v1: Vec3, v2: Vec3): number {
        return v1._val[0] * v2._val[0] +
            v1._val[1] * v2._val[1] +
            v1._val[2] * v2._val[2];
    }

    public static crossProduct(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3(
            v1._val[1] * v2._val[2] - v1._val[2] * v2._val[1],
            v1._val[2] * v2._val[0] - v1._val[0] * v2._val[2],
            v1._val[0] * v2._val[1] - v1._val[1] * v2._val[0]);
    }

    public static substract(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3(
            v1._val[0] - v2._val[0],
            v1._val[1] - v2._val[1],
            v1._val[2] - v2._val[2]);
    }

    private _val: Float32Array;

    constructor(x: number, y: number, z: number) {
        this._val = new Float32Array(3);
        this._val[0] = x;
        this._val[1] = y;
        this._val[2] = z;
    }

    public get x(): number {
        return this._val[0];
    }

    public get y(): number {
        return this._val[1];
    }

    public get z(): number {
        return this._val[2];
    }

    public equals(other: Vec3): boolean {
        return Math.abs(this._val[0] - other._val[0]) < EPSILON &&
            Math.abs(this._val[1] - other._val[1]) < EPSILON &&
            Math.abs(this._val[2] - other._val[2]) < EPSILON;
    }

    public divideByScalar(scalar: number): void {
        this._val[0] /= scalar;
        this._val[1] /= scalar;
        this._val[2] /= scalar;
    }

    public substract(other: Vec3): void {
        this._val[0] -= other._val[0];
        this._val[1] -= other._val[1];
        this._val[2] -= other._val[2];
    }

    public get length(): number {
        const norm = this._val[0] * this._val[0] +
            this._val[1] * this._val[1] +
            this._val[2] * this._val[2];
        return Math.sqrt(norm);
    }

    /* Return false if vector cannot be normalized because it's null. */
    public normalize(): boolean {
        if (Math.abs(this._val[0]) < EPSILON &&
            Math.abs(this._val[1]) < EPSILON &&
            Math.abs(this._val[2]) < EPSILON) {
            this._val[0] = 0;
            this._val[1] = 0;
            this._val[2] = 0;
            return false;
        }

        this.divideByScalar(this.length);

        return true;
    }
}

export { Vec3 };
