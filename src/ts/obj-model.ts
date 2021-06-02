import { gl } from "./gl-utils/gl-canvas";
import { VBO } from "./gl-utils/vbo";
import * as Loader from "./loader";

interface IPoint {
    x: number;
    y: number;
    z: number;
}

class ObjModel {
    public readonly trianglesCount: number;
    public readonly data: Float32Array;
    public readonly VBO: VBO;

    public static parse(input: string): ObjModel {
        const lines = input.split("\n");

        const vertices: IPoint[] = [];
        const geometry: number[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineItems = line.split(/\s+/);
            const command = lineItems[0];

            if (command === "v") { // declare vertex
                if (lineItems.length >= 4) {
                    vertices.push({
                        x: parseFloat(lineItems[1]),
                        y: parseFloat(lineItems[2]),
                        z: parseFloat(lineItems[3]),
                    });
                } else {
                    console.log(`Ignoring line ${i} because it does not have enough items: '${line}'.`);
                    continue;
                }
            } else if (command === "f") { // declare face
                if (lineItems.length >= 4) {
                    // faces with more that 3 vertices are interpreted as TRIANGLE_FAN
                    for (let iV = 3; iV < lineItems.length; iV++) {
                        const indices: number[] = [
                            +(lineItems[1].split("/")[0]),
                            +(lineItems[iV - 1].split("/")[0]),
                            +(lineItems[iV].split("/")[0]),
                        ];

                        for (const indice of indices) {
                            if (indice < 1 || indice > vertices.length) {
                                console.log(`Ignoring line ${i} because vertex index ${indice} is out of range: '${line}'.`);
                                continue;
                            }
                        }

                        geometry.push(vertices[indices[0] - 1].x);
                        geometry.push(vertices[indices[0] - 1].y);
                        geometry.push(vertices[indices[0] - 1].z);
                        geometry.push(vertices[indices[1] - 1].x);
                        geometry.push(vertices[indices[1] - 1].y);
                        geometry.push(vertices[indices[1] - 1].z);
                        geometry.push(vertices[indices[2] - 1].x);
                        geometry.push(vertices[indices[2] - 1].y);
                        geometry.push(vertices[indices[2] - 1].z);
                    }
                } else {
                    console.log(`Ignoring line ${i} because only triangular faces are supported: '${line}'.`);
                    continue;
                }
            } else {
                console.log(`Ignoring line ${i}: '${line}'.`);
                continue;
            }
        }

        return new ObjModel(new Float32Array(geometry));
    }

    public constructor(data: Float32Array) {
        if (data.length % 9 !== 0) {
            throw new Error(`Invalid data: ${data.length}`);
        }

        this.data = data;
        this.trianglesCount = data.length / 9;

        this.VBO = new VBO(gl, this.data, 3, gl.FLOAT, true);
    }
}

const modelsCache: { [name: string]: ObjModel } = {};

function asyncLoadObjModel(name: string, callback: (model: ObjModel) => unknown): void {
    if (typeof modelsCache[name] !== "undefined") {
        callback(modelsCache[name]);
    } else {
        const id = `model-${name}`;
        Loader.registerLoadingObject(id);

        const request = new XMLHttpRequest();
        request.addEventListener("load", () => {
            Loader.registerLoadedObject(id);

            if (request.status === 200) {
                if (typeof modelsCache[name] === "undefined") { // maybe it was loaded in the meantime
                    modelsCache[name] = ObjModel.parse(request.responseText);
                }
            }

            callback(modelsCache[name] ?? null);
        });
        request.open("GET", `resources/models/${name}?v=${Page.version}`);
        request.send();
    }
}

export {
    asyncLoadObjModel,
    ObjModel,
};
