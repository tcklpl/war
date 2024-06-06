import { GLTFAccessor } from './gltf_accessor';
import { GLTFMaterial } from './gltf_material';

export interface GLTFMeshPrimitive {
    attributes: {
        POSITION: GLTFAccessor;
        TEXCOORD_0: GLTFAccessor;
        NORMAL: GLTFAccessor;
        TANGENT: GLTFAccessor;
    };

    indices: GLTFAccessor;
    material: GLTFMaterial;
}
