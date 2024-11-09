import { GLBChunk, GLTFFileFormat } from 'gltf';
import { BadGLTFFileError } from '../../../errors/engine/gltf/bad_gltf_file';
import { UnsupportedGLTFFeatureError } from '../../../errors/engine/gltf/unsupported_gltf_feature';
import { FetchUtils } from '../../../utils/fetch_utils';
import { GLTFAccessor } from '../../data/gltf/gltf_accessor';
import { GLTFAnimation } from '../../data/gltf/gltf_animation';
import { GLTFAnimationChannel } from '../../data/gltf/gltf_animation_channel';
import { GLTFAnimationChannelTarget } from '../../data/gltf/gltf_animation_channel_target';
import { GLTFAnimationSampler } from '../../data/gltf/gltf_animation_sampler';
import { GLTFBuffer } from '../../data/gltf/gltf_buffer';
import { GLTFBufferView } from '../../data/gltf/gltf_buffer_view';
import { GLTFCamera } from '../../data/gltf/gltf_camera';
import { GLTFFile } from '../../data/gltf/gltf_file';
import { GLTFLight } from '../../data/gltf/gltf_light';
import { GLTFMaterial } from '../../data/gltf/gltf_material';
import { GLTFMesh } from '../../data/gltf/gltf_mesh';
import { GLTFMeshPrimitive } from '../../data/gltf/gltf_mesh_primitive';
import { GLTFNode, GLTFNodeCamera, GLTFNodeLight, GLTFNodeMesh } from '../../data/gltf/gltf_node';
import { GLTFScene } from '../../data/gltf/gltf_scene';

/**
 * GLTF Loader
 *
 * I will update this loader and add more support to stuff as it is needed.
 * Current support:
 *  [X] Scenes
 *  [X] Meshes
 *  [X] Materials
 *  [X] Lights
 *  [X] Cameras
 *  [ ] Images
 *  [X] Animations
 *  [ ] Skins
 *
 *  [X] .gltf Support
 *  [X] .glb  Support
 */
export class GLTFLoader {
    private readonly _supportedGLTFExtensions = [
        'KHR_materials_transmission',
        'KHR_materials_specular',
        'KHR_materials_ior',
        'KHR_lights_punctual',
    ];

    async constructGLTFAsset(gltfSave: GLTFFileFormat, binaryBuffers?: ArrayBuffer[]) {
        this.validateHeaders(gltfSave);
        const buffers = await this.constructBuffers(gltfSave, binaryBuffers);
        const bufferViews = this.constructBufferViews(gltfSave, buffers);
        const accessors = this.constructAccessors(gltfSave, bufferViews);
        const materials = this.constructMaterials(gltfSave);
        const meshes = this.constructMeshes(gltfSave, accessors, materials);
        const cameras = this.constructCameras(gltfSave);
        const lights = this.constructLights(gltfSave);
        const nodes = this.constructNodes(gltfSave, meshes, cameras, lights);
        // TODO: Transform animations into engine ones
        //const animations = this.constructAnimations(gltfSave, accessors, nodes);
        const scenes = this.constructScenes(gltfSave, nodes);

        return new GLTFFile(
            {
                generator: gltfSave.asset.generator,
                version: gltfSave.asset.version,
            },
            scenes,
            gltfSave.scene,
        );
    }

    private validateHeaders(gltfSave: GLTFFileFormat) {
        // validate header
        if (gltfSave.asset.version !== '2.0')
            throw new BadGLTFFileError(`Unsupported GLTF File version '${gltfSave.asset.version}', should be '2.0'`);

        // validate extensions
        const extensions = new Set((gltfSave.extensionsRequired ?? []).concat(gltfSave.extensionsUsed ?? []));
        extensions.forEach(reqExt => {
            if (!this._supportedGLTFExtensions.includes(reqExt))
                throw new UnsupportedGLTFFeatureError(`Unsupported extension: ${reqExt}`);
        });
    }

    private async constructBuffers(gltfSave: GLTFFileFormat, binaryBuffers?: ArrayBuffer[]) {
        // buffers
        const buffers: GLTFBuffer[] = [];
        for (let i = 0; i < gltfSave.buffers.length; i++) {
            const buf = gltfSave.buffers[i];

            let data: ArrayBuffer;
            // JSON files will have an base64 buffer
            if (buf.uri) {
                data = await FetchUtils.fetchByteBuffer(buf.uri);
            }
            // GLB Files will supply the buffer by the second function argument
            else {
                if (!binaryBuffers || i >= binaryBuffers.length)
                    throw new BadGLTFFileError(
                        `Buffer of index '${i}' cannot be found on supplied list of length '${binaryBuffers?.length}'`,
                    );
                data = binaryBuffers[i];
            }

            buffers.push(new GLTFBuffer(data));
        }
        return buffers;
    }

    private constructBufferViews(gltfSave: GLTFFileFormat, buffers: GLTFBuffer[]) {
        // buffer views
        const bufferViews: GLTFBufferView[] = [];
        for (const bv of gltfSave.bufferViews) {
            if (bv.buffer < 0 || bv.buffer >= buffers.length)
                throw new BadGLTFFileError(
                    `Invalid bufferView buffer index '${bv.buffer}' for buffer[] of length '${buffers.length}'`,
                );
            bufferViews.push(new GLTFBufferView(buffers[bv.buffer], bv.byteLength, bv.byteOffset, bv.target));
        }
        return bufferViews;
    }

    private constructAccessors(gltfSave: GLTFFileFormat, bufferViews: GLTFBufferView[]) {
        // accessors
        const accessors: GLTFAccessor[] = [];
        for (const acc of gltfSave.accessors) {
            if (acc.bufferView < 0 || acc.bufferView >= bufferViews.length)
                throw new BadGLTFFileError(
                    `Invalid accessor bufferView index '${acc.bufferView}' for bufferView[] of length '${bufferViews.length}'`,
                );
            accessors.push(
                new GLTFAccessor(bufferViews[acc.bufferView], acc.componentType, acc.count, acc.type, acc.min, acc.max),
            );
        }
        return accessors;
    }

    private constructMaterials(gltfSave: GLTFFileFormat) {
        // materials
        const materials: GLTFMaterial[] = [];
        for (const mat of gltfSave.materials) {
            materials.push(
                new GLTFMaterial(mat.name, {
                    doubleSided: mat.doubleSided,
                    baseColor: mat.pbrMetallicRoughness.baseColorFactor,
                    metallic: mat.pbrMetallicRoughness.metallicFactor,
                    roughness: mat.pbrMetallicRoughness.roughnessFactor,

                    // extensions
                    ior: mat.extensions?.KHR_materials_ior?.ior,
                    specular: mat.extensions?.KHR_materials_specular?.specularColorFactor,
                    transmission: mat.extensions?.KHR_materials_transmission?.transmissionFactor,
                }),
            );
        }
        return materials;
    }

    private constructMeshes(gltfSave: GLTFFileFormat, accessors: GLTFAccessor[], materials: GLTFMaterial[]) {
        // meshes
        const meshes: GLTFMesh[] = [];
        for (const mesh of gltfSave.meshes) {
            const primitives: GLTFMeshPrimitive[] = [];
            mesh.primitives.forEach(p => {
                // validate attributes
                Object.keys(p.attributes).forEach(attrKey => {
                    const index = (p.attributes as any)[attrKey] as number;
                    if (index < 0 || index >= accessors.length)
                        throw new BadGLTFFileError(
                            `Invalid mesh accessor '${attrKey}' index '${index}' for accessors[] of length '${accessors.length}'`,
                        );
                });

                if (p.indices < 0 || p.indices >= accessors.length)
                    throw new BadGLTFFileError(
                        `Invalid mesh accessor 'indices' index '${p.indices}' for accessors[] of length '${accessors.length}'`,
                    );

                if (p.material < 0 || p.material >= materials.length)
                    throw new BadGLTFFileError(
                        `Invalid mesh material index '${p.material}' for materials[] of length '${materials.length}'`,
                    );

                primitives.push({
                    attributes: {
                        POSITION: accessors[p.attributes.POSITION],
                        TEXCOORD_0: accessors[p.attributes.TEXCOORD_0],
                        NORMAL: accessors[p.attributes.NORMAL],
                        TANGENT: accessors[p.attributes.TANGENT],
                    },
                    indices: accessors[p.indices],
                    material: materials[p.material],
                });
            });
            meshes.push(new GLTFMesh(mesh.name, primitives));
        }
        return meshes;
    }

    private constructCameras(gltfSave: GLTFFileFormat) {
        // cameras
        const cameras: GLTFCamera[] = [];
        if (gltfSave.cameras) {
            for (const camera of gltfSave.cameras) {
                const znear = camera.perspective?.znear ?? camera.orthographic?.znear;
                const zfar = camera.perspective?.zfar ?? camera.orthographic?.zfar;
                if (!znear || !zfar)
                    throw new BadGLTFFileError('Camera missing either znear or zfar properties (or both)');

                cameras.push(
                    new GLTFCamera(camera.name, camera.type, znear, zfar, {
                        aspectRatio: camera.perspective?.aspectRatio,
                        yfov: camera.perspective?.yfov,

                        xmag: camera.orthographic?.xmag,
                        ymag: camera.orthographic?.ymag,
                    }),
                );
            }
        }
        return cameras;
    }

    private constructLights(gltfSave: GLTFFileFormat) {
        // lights
        const lights: GLTFLight[] = [];
        if (gltfSave.extensions?.KHR_lights_punctual) {
            for (const light of gltfSave.extensions.KHR_lights_punctual.lights) {
                const color = light.color ?? [1, 1, 1];
                const intensity = light.intensity ?? 1;

                lights.push(new GLTFLight(light.name, light.type, color, intensity, light.range));
            }
        }
        return lights;
    }

    private constructNodes(gltfSave: GLTFFileFormat, meshes: GLTFMesh[], cameras: GLTFCamera[], lights: GLTFLight[]) {
        // nodes
        const nodes: GLTFNode[] = [];
        for (const node of gltfSave.nodes) {
            const translation = node.translation ?? [0, 0, 0];
            const rotation = node.rotation ?? [0, 0, 0, 1];
            const scale = node.scale ?? [1, 1, 1];

            // mesh nodes
            if (node.mesh !== undefined) {
                if (node.mesh < 0 || node.mesh >= meshes.length)
                    throw new BadGLTFFileError(
                        `Invalid node mesh index '${node.mesh}' for meshes[] of length '${meshes.length}'`,
                    );

                nodes.push(new GLTFNodeMesh(node.name, rotation, translation, scale, meshes[node.mesh]));
                continue;
            }

            // camera nodes
            if (node.camera !== undefined) {
                if (node.camera < 0 || node.camera >= cameras.length)
                    throw new BadGLTFFileError(
                        `Invalid node camera index '${node.camera}' for cameras[] of length '${cameras.length}'`,
                    );

                nodes.push(new GLTFNodeCamera(node.name, rotation, translation, scale, cameras[node.camera]));
                continue;
            }

            // light nodes
            if (node.extensions?.KHR_lights_punctual !== undefined) {
                if (
                    node.extensions.KHR_lights_punctual.light < 0 ||
                    node.extensions.KHR_lights_punctual.light >= cameras.length
                )
                    throw new BadGLTFFileError(
                        `Invalid node light index '${node.extensions.KHR_lights_punctual.light}' for lights[] of length '${lights.length}'`,
                    );

                nodes.push(
                    new GLTFNodeLight(
                        node.name,
                        rotation,
                        translation,
                        scale,
                        lights[node.extensions.KHR_lights_punctual.light],
                    ),
                );
                continue;
            }

            // unknown node
            throw new BadGLTFFileError(`Unrecognized node:\n\n${node}`);
        }
        return nodes;
    }

    private constructAnimations(gltfSave: GLTFFileFormat, accessors: GLTFAccessor[], nodes: GLTFNode[]) {
        // animations
        const animations: GLTFAnimation[] = [];
        for (const animation of gltfSave.animations ?? []) {
            const name = animation.name ?? 'Untitled animation';

            const samplers: GLTFAnimationSampler[] = [];
            for (const sampler of animation.samplers) {
                if (sampler.input < 0 || sampler.input >= accessors.length)
                    throw new BadGLTFFileError(
                        `Invalid animation accessor input index '${sampler.input}' for accessors[] of length '${accessors.length}'`,
                    );
                if (sampler.output < 0 || sampler.output >= accessors.length)
                    throw new BadGLTFFileError(
                        `Invalid animation accessor output index '${sampler.output}' for accessors[] of length '${accessors.length}'`,
                    );

                samplers.push(
                    new GLTFAnimationSampler(
                        accessors[sampler.input],
                        accessors[sampler.output],
                        sampler.interpolation ?? 'LINEAR',
                    ),
                );
            }

            const channels: GLTFAnimationChannel[] = [];
            for (const channel of animation.channels) {
                if (channel.sampler < 0 || channel.sampler >= samplers.length)
                    throw new BadGLTFFileError(
                        `Invalid animation channel sampler index '${channel.sampler}' for samplers[] of length '${samplers.length}'`,
                    );
                if (channel.target.node < 0 || channel.target.node >= nodes.length)
                    throw new BadGLTFFileError(
                        `Invalid animation channel target node index '${channel.target.node}' for nodes[] of length '${nodes.length}'`,
                    );

                channels.push(
                    new GLTFAnimationChannel(
                        samplers[channel.sampler],
                        new GLTFAnimationChannelTarget(nodes[channel.target.node], channel.target.path),
                    ),
                );
            }

            const finalAnimation = new GLTFAnimation(name, samplers, channels);

            // update the node to include the animation
            const affectedNodes = new Set(channels.map(c => c.target.node)); // Set excludes repeated values
            affectedNodes.forEach(node => node.registerAnimation(finalAnimation));

            animations.push(finalAnimation);
        }
        return animations;
    }

    private constructScenes(gltfSave: GLTFFileFormat, nodes: GLTFNode[]) {
        // scenes
        const scenes: GLTFScene[] = [];
        for (const scene of gltfSave.scenes) {
            if (scene.nodes.some(nodeIndex => nodeIndex < 0 || nodeIndex >= nodes.length))
                throw new BadGLTFFileError(`Invalid scene node index for nodes[] of length '${nodes.length}'`);

            scenes.push(
                new GLTFScene(
                    scene.name,
                    scene.nodes.map(nodeIndex => nodes[nodeIndex]),
                ),
            );
        }
        return scenes;
    }

    async loadGLBAsset(blob: ArrayBuffer) {
        if (blob.byteLength < 12) throw new BadGLTFFileError(`GLB File with less then 12 bytes of length`);

        const header = new Uint32Array(blob.slice(0, 12));
        const magicNumber = header[0];
        const version = header[1];
        const length = header[2];

        // header validation
        if (magicNumber !== 0x46546c67) throw new BadGLTFFileError(`GLB File header magic number doesn't match`);
        if (version !== 2) throw new BadGLTFFileError(`GLB File header version is not 2`);
        if (length !== blob.byteLength)
            throw new BadGLTFFileError(
                `GLB File header length of '${length}' doesn't match blob length of '${blob.byteLength}'`,
            );

        // chunk validation
        const chunks = this.parseGLBChunks(blob);
        const jsonChunks = chunks.filter(c => c.type === 0x4e4f534a);
        const binChunks = chunks.filter(c => c.type === 0x004e4942);
        if (jsonChunks.length !== 1)
            throw new BadGLTFFileError(`GLB File has '${jsonChunks.length}' JSON chunks (should be 1)`);
        if (binChunks.length > 1)
            throw new BadGLTFFileError(`GLB File has '${binChunks.length}' BINARY chunks (should be 0 or 1)`);

        const json = JSON.parse(new TextDecoder().decode(jsonChunks[0].data)) as GLTFFileFormat;
        return await this.constructGLTFAsset(
            json,
            binChunks.map(c => c.data),
        );
    }

    private parseGLBChunks(blob: ArrayBuffer) {
        const chunks: GLBChunk[] = [];
        let position = 12; // start from header

        while (position < blob.byteLength) {
            const chunkHeader = new Uint32Array(blob.slice(position, position + 8));
            const chunkLength = chunkHeader[0];
            const chunkType = chunkHeader[1];

            if (chunkType !== 0x4e4f534a && chunkType !== 0x004e4942)
                throw new BadGLTFFileError(
                    `GLB File chunk header has an invalid type '${chunkType}', should be '${0x4e4f534a}' or '${0x004e4942}'`,
                );
            const chunkDataEnd = Math.ceil((position + 8 + chunkLength) / 4) * 4; // chunks MUST be aligned to a 4-byte boundary
            if (chunkDataEnd > blob.byteLength)
                throw new BadGLTFFileError(
                    `GLB File chunk length of '${chunkLength}' exceeds the blob size of '${blob.byteLength}' (chunk from '${position + 8}' to '${chunkDataEnd}')`,
                );

            const chunkData = blob.slice(position + 8, chunkDataEnd);
            chunks.push({
                type: chunkType,
                length: chunkLength,
                data: chunkData,
            });

            position = chunkDataEnd;
        }

        return chunks;
    }
}
