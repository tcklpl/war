import type { GLTFAccessor } from './gltf-accessor';
import type { GLTFMaterial } from './gltf-material';

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
