import { I3DObject } from "../data_formats/3d_object";
import { Vec2 } from "../data_formats/vec/vec2";
import { Vec3 } from "../data_formats/vec/vec3";

export class OBJLoader {

    static loadWavefrontObj(source: string): I3DObject[] {

        const meshes: I3DObject[] = [];

        const lines: string[] = source.split('\n');

        let objName: string = "";
        let objVertices: Vec3[] = [];
        let objUV: Vec2[] = [];
        let objNormals: Vec3[] = [];
        let objIndices: Vec3[] = [];

        for (let i in lines) {
            let line = lines[i];

            // Ignore comment lines
            if (line.startsWith('#')) continue;

            // Object indentifiers
            //TODO: load only needed vertices
            if (line.startsWith('o ')) {
                if (objName) {
                    meshes.push(new I3DObject(objName, objVertices, objUV, objNormals, objIndices));
                    // objVertices = [];
                    // objUV = [];
                    // objNormals = [];
                    objIndices = [];
                }
                objName = line.replace('o ', '');
                console.log(`Reading obj ${objName}`);
                continue;
            }

            // Vertices
            if (line.startsWith('v ')) {
                let [x, y, z] = line.replace('v ', '').split(' ').map(t => parseFloat(t));
                objVertices.push(new Vec3(x, y, z));
                continue;
            }

            // UVs
            if (line.startsWith('vt ')) {
                let [x, y] = line.replace('vt ', '').split(' ').map(t => parseFloat(t));
                objUV.push(new Vec2(x, y));
                continue;
            }

            // Normals
            if (line.startsWith('vn ')) {
                let [x, y, z] = line.replace('vn ', '').split(' ').map(t => parseFloat(t));
                objNormals.push(new Vec3(x, y, z));
                continue;
            }

            // Faces
            if (line.startsWith('f ')) {
                let faceVertices = line.replace('f ', '').split(' ');

                if (faceVertices.length != 3) throw "Trying to load object without triangulated faces!";

                /*
                    Each fv is a vec3 of integers, being:
                    
                    x : vertice index
                    y : UV index
                    z : normal index
                */
               faceVertices.forEach(fv => {
                    let [x, y, z] = fv.split('/').map(v => parseInt(v));
                    objIndices.push(new Vec3(x, y, z));
                });
                continue;
            }

            // 's' can separate face groups, but it will not be used here
        }
        
        meshes.push(new I3DObject(objName, objVertices, objUV, objNormals, objIndices));

        return meshes;

    }

}