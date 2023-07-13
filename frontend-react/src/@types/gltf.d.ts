
declare module 'gltf' {

    type GLTFAccessorValidTypes = 'VEC2' | 'VEC3' | 'VEC4' | 'SCALAR';
    type GLTFCameraTypes = 'perspective' | 'orthographic';

    type KHR_lights_punctual_Types = 'directional' | 'point' | 'spot';

    interface GLTFFileFormat {

        asset: {
            generator: string;
            version: string;
        };

        extensionsUsed?: string[];
        extensionsRequired?: string[];

        extensions?: {
            KHR_lights_punctual: {
                lights: {
                    name: string;
                    type: KHR_lights_punctual_Types;

                    /**
                     * RGB value for light's color in linear space.
                     * 
                     * Not required, defaults to [1, 1, 1].
                     */
                    color?: number[];

                    /**
                     * Brightness of light in. The units that this is defined in depend on the type of light. 
                     * point and spot lights use luminous intensity in candela (lm/sr) while directional lights use illuminance in lux (lm/m2)
                     * 
                     * Not required, defaults to 1.
                     */
                    intensity?: number;

                    /**
                     * Hint defining a distance cutoff at which the light's intensity may be considered to have reached zero. 
                     * Supported only for point and spot lights. Must be > 0. When undefined, range is assumed to be infinite.
                     */
                    range?: number;
                }[];
            }
        }

        scene: number; // default scene
        scenes: {
            name: string;
            nodes: number[];
        }[];

        nodes: {
            name: string;
            rotation: number[]; // quaternion
            translation?: number[]; // vec3
            
            extensions?: {
                KHR_lights_punctual?: {
                    light: number;
                }
            }
            
            mesh?: number;
            camera?: number;
        }[];

        materials: {
            name: string;
            doubleSided: boolean;
            pbrMetallicRoughness: {
                baseColorFactor: number[]; // rgba
                metallicFactor: number;
                roughnessFactor: number;
            }
            extensions?: {
                KHR_materials_transmission?: {
                    transmissionFactor: number;
                }
                KHR_materials_specular?: {
                    specularColorFactor: number[]; //vec3
                }
                KHR_materials_ior?: {
                    ior: number;
                }
            }
        }[];

        cameras: {
            name: string;
            type: GLTFCameraTypes;
            perspective?: {
                aspectRatio: number;
                yfov: number;
                zfar: number;
                znear: number;
            }
            orthographic?: {
                xmag: number;
                ymag: number;
                zfar: number;
                znear: number;
            }
        }[];

        meshes: {
            name: string;
            primitives: {
                attributes: {
                    POSITION: number;
                    TEXCOORD_0: number;
                    NORMAL: number;
                    TANGENT: number; //vec4
                }
                indices: number;
                material: number;
            }[];
        }[];

        accessors: {
            bufferView: number;
            componentType: number;
            count: number;
            type: GLTFAccessorValidTypes;
            min?: number | number[];
            max?: number | number[];
        }[];

        bufferViews: {
            buffer: number;
            byteLength: number;
            byteOffset: number;
            target: number;
        }[];

        buffers: {
            byteLength: number;
            uri: string;
        }[];

    }
}