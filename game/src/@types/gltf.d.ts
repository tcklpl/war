declare module 'gltf' {
    type GLTFAccessorValidTypes = 'VEC2' | 'VEC3' | 'VEC4' | 'SCALAR';
    type GLTFCameraTypes = 'perspective' | 'orthographic';

    type GLTFAnimationSamplerInterpolation = 'STEP' | 'LINEAR' | 'CUBICSPLINE';
    type GLTFAnimationChannelTargetPath = 'translation' | 'rotation' | 'scale';

    type KHR_lights_punctual_Types = 'directional' | 'point' | 'spot';

    type GLBChunkJSONType = 0x4e4f534a;
    type GLBChunkBINType = 0x004e4942;

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
            };
        };

        scene: number; // default scene
        scenes: {
            name: string;
            nodes: number[];
        }[];

        nodes: {
            name: string;
            rotation?: number[]; // quaternion
            translation?: number[]; // vec3
            scale?: number[]; // vec3

            extensions?: {
                KHR_lights_punctual?: {
                    light: number;
                };
            };

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
            };
            extensions?: {
                KHR_materials_transmission?: {
                    transmissionFactor: number;
                };
                KHR_materials_specular?: {
                    specularColorFactor: number[]; //vec3
                };
                KHR_materials_ior?: {
                    ior: number;
                };
            };
        }[];

        animations?: {
            /**
             * The user-defined name of this object.
             */
            name?: string;

            /**
             * An array of animation channels.
             *
             * An animation channel combines an animation sampler with a target property being animated.
             * Different channels of the same animation MUST NOT have the same targets.
             */
            channels: {
                /**
                 * The index of a sampler in this animation used to compute the value for the target.
                 */
                sampler: number;

                /**
                 * The descriptor of the animated property.
                 */
                target: {
                    /**
                     * The index of the node to animate. When undefined, the animated object MAY be defined by an extension.
                     */
                    node: number;
                    /**
                     * The name of the node’s TRS property to animate, or the "weights" of the Morph Targets it instantiates.
                     *
                     * For the "translation" property, the values that are provided by the sampler are the translation along the X, Y, and Z axes.
                     *
                     * For the "rotation" property, the values are a quaternion in the order (x, y, z, w), where w is the scalar.
                     *
                     * For the "scale" property, the values are the scaling factors along the X, Y, and Z axes.
                     */
                    path: GLTFAnimationChannelTargetPath;
                };
            }[];

            /**
             * An array of animation samplers.
             *
             * An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.
             */
            samplers: {
                /**
                 * The index of an accessor containing keyframe timestamps.
                 */
                input: number;

                /**
                 * Interpolation algorithm.
                 *
                 * Defaults to LINEAR
                 */
                interpolation?: GLTFAnimationSamplerInterpolation;

                /**
                 * The index of an accessor, containing keyframe output values.
                 */
                output: number;
            }[];
        }[];

        cameras: {
            name: string;
            type: GLTFCameraTypes;
            perspective?: {
                aspectRatio: number;
                yfov: number;
                zfar: number;
                znear: number;
            };
            orthographic?: {
                xmag: number;
                ymag: number;
                zfar: number;
                znear: number;
            };
        }[];

        meshes: {
            name: string;
            primitives: {
                attributes: {
                    POSITION: number;
                    TEXCOORD_0: number;
                    NORMAL: number;
                    TANGENT: number; //vec4
                };
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
            target?: number;
        }[];

        buffers: {
            byteLength: number;
            uri?: string;
        }[];
    }

    interface GLBChunk {
        length: number;
        type: GLBChunkJSONType | GLBChunkBINType; // ASCII 'JSON' or 'BIN'
        data: ArrayBuffer;
    }
}
