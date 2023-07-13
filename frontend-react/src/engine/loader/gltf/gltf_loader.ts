import { GLTFFileFormat } from "gltf";
import { GLTFBuffer } from "../../data/gltf/gltf_buffer";
import { FetchUtils } from "../../../utils/fetch_utils";
import { GLTFBufferView } from "../../data/gltf/gltf_buffer_view";
import { BadGLTFFileError } from "../../../errors/engine/gltf/bad_gltf_file";
import { GLTFAccessor } from "../../data/gltf/gltf_accessor";
import { GLTFMesh } from "../../data/gltf/gltf_mesh";
import { GLTFMaterial } from "../../data/gltf/gltf_material";
import { GLTFMeshPrimitive } from "../../data/gltf/gltf_mesh_primitive";
import { GLTFNode, GLTFNodeCamera, GLTFNodeLight, GLTFNodeMesh } from "../../data/gltf/gltf_node";
import { GLTFScene } from "../../data/gltf/gltf_scene";
import { GLTFFile } from "../../data/gltf/gltf_file";
import { GLTFCamera } from "../../data/gltf/gltf_camera";
import { UnsupportedGLTFFeatureError } from "../../../errors/engine/gltf/unsupported_gltf_feature";
import { GLTFLight } from "../../data/gltf/gltf_light";

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
 *  [ ] Animations
 *  [ ] Skins
 */
export class GLTFLoader {

    private _supportedGLTFExtensions = [
        "KHR_materials_transmission",
        "KHR_materials_specular",
        "KHR_materials_ior",
        "KHR_lights_punctual"
    ];

    async constructGLTFAsset(gltfSave: GLTFFileFormat) {

        // validate extensions
        const extensions = new Set((gltfSave.extensionsRequired ?? []).concat(gltfSave.extensionsUsed ?? []));
            extensions.forEach(reqExt => {
                if (!this._supportedGLTFExtensions.includes(reqExt))
                    throw new UnsupportedGLTFFeatureError(`Unsupported extension: ${reqExt}`);
        });

        // buffers
        const buffers: GLTFBuffer[] = [];
        for (const buf of gltfSave.buffers) {
            const data = await FetchUtils.fetchByteBuffer(buf.uri);
            buffers.push(new GLTFBuffer(data));
        }

        // buffer views
        const bufferViews: GLTFBufferView[] = [];
        for (const bv of gltfSave.bufferViews) {
            if (bv.buffer < 0 || bv.buffer >= buffers.length) 
                throw new BadGLTFFileError(`Invalid bufferView buffer index '${bv.buffer}' for buffer[] of length '${buffers.length}'`);
            bufferViews.push(new GLTFBufferView(buffers[bv.buffer], bv.byteLength, bv.byteOffset, bv.target));
        }

        // accessors
        const accessors: GLTFAccessor[] = [];
        for (const acc of gltfSave.accessors) {
            if (acc.bufferView < 0 || acc.bufferView >= bufferViews.length) 
                throw new BadGLTFFileError(`Invalid accessor bufferView index '${acc.bufferView}' for bufferView[] of length '${bufferViews.length}'`);
            accessors.push(new GLTFAccessor(
                bufferViews[acc.bufferView],
                acc.componentType,
                acc.count,
                acc.type,
                acc.min,
                acc.max
            ));
        }

        // materials
        const materials: GLTFMaterial[] = [];
        for (const mat of gltfSave.materials) {
            materials.push(new GLTFMaterial(
                mat.name,
                {
                    doubleSided: mat.doubleSided,
                    baseColor: mat.pbrMetallicRoughness.baseColorFactor,
                    metallic: mat.pbrMetallicRoughness.metallicFactor,
                    roughness: mat.pbrMetallicRoughness.roughnessFactor,

                    // extensions
                    ior: mat.extensions?.KHR_materials_ior?.ior,
                    specular: mat.extensions?.KHR_materials_specular?.specularColorFactor,
                    transmission: mat.extensions?.KHR_materials_transmission?.transmissionFactor
                }
            ))
        }

        // meshes
        const meshes: GLTFMesh[] = [];
        for (const mesh of gltfSave.meshes) { 
            const primitives: GLTFMeshPrimitive[] = [];
            mesh.primitives.forEach(p => {
                // validate attributes
                Object.keys(p.attributes).forEach(attrKey => {
                    const index = (p.attributes as any)[attrKey] as number;
                    if (index < 0 || index >= accessors.length)
                        throw new BadGLTFFileError(`Invalid mesh accessor '${attrKey}' index '${index}' for accessors[] of length '${accessors.length}'`);
                });
                
                if (p.indices < 0 || p.indices >= accessors.length)
                    throw new BadGLTFFileError(`Invalid mesh accessor 'indices' index '${p.indices}' for accessors[] of length '${accessors.length}'`);
                
                if (p.material < 0 || p.material >= materials.length)
                    throw new BadGLTFFileError(`Invalid mesh material index '${p.material}' for materials[] of length '${materials.length}'`);

                primitives.push({
                    attributes: {
                        POSITION: accessors[p.attributes.POSITION],
                        TEXCOORD_0: accessors[p.attributes.TEXCOORD_0],
                        NORMAL: accessors[p.attributes.NORMAL],
                        TANGENT: accessors[p.attributes.TANGENT]
                    },
                    indices: accessors[p.indices],
                    material: materials[p.material]
                })
            });
            meshes.push(new GLTFMesh(mesh.name, primitives));
        }

        // cameras
        const cameras: GLTFCamera[] = [];
        for (const camera of gltfSave.cameras) {
            const znear = camera.perspective?.znear ?? camera.orthographic?.znear;
            const zfar = camera.perspective?.zfar ?? camera.orthographic?.zfar;
            if (!znear || !zfar) throw new BadGLTFFileError('Camera missing either znear or zfar properties (or both)');

            cameras.push(new GLTFCamera(camera.name, camera.type, znear, zfar, {
                aspectRatio: camera.perspective?.aspectRatio,
                yfov: camera.perspective?.yfov,

                xmag: camera.orthographic?.xmag,
                ymag: camera.orthographic?.ymag
            }));
        }

        // lights
        const lights: GLTFLight[] = [];
        if (gltfSave.extensions?.KHR_lights_punctual) {
            for (const light of gltfSave.extensions.KHR_lights_punctual.lights) {
                const color = light.color ?? [1, 1, 1];
                const intensity = light.intensity ?? 1;
                
                lights.push(new GLTFLight(light.name, light.type, color, intensity, light.range));
            }
        }

        // nodes
        const nodes: GLTFNode[] = [];
        for (const node of gltfSave.nodes) {

            const translation = node.translation ?? [0, 0, 0];

            // mesh nodes
            if (node.mesh !== undefined) {
                if (node.mesh < 0 || node.mesh >= meshes.length)
                    throw new BadGLTFFileError(`Invalid node mesh index '${node.mesh}' for meshes[] of length '${meshes.length}'`);
                
                nodes.push(new GLTFNodeMesh(
                    node.name,
                    node.rotation,
                    translation,
                    meshes[node.mesh]
                ));
                continue;
            }

            // camera nodes
            if (node.camera !== undefined) {
                if (node.camera < 0 || node.camera >= cameras.length)
                    throw new BadGLTFFileError(`Invalid node camera index '${node.camera}' for cameras[] of length '${cameras.length}'`);
                
                nodes.push(new GLTFNodeCamera(
                    node.name,
                    node.rotation,
                    translation,
                    cameras[node.camera]
                ));
                continue;
            }

            // light nodes
            if (node.extensions?.KHR_lights_punctual !== undefined) {
                if (node.extensions.KHR_lights_punctual.light < 0 || node.extensions.KHR_lights_punctual.light >= cameras.length)
                    throw new BadGLTFFileError(`Invalid node light index '${node.extensions.KHR_lights_punctual.light}' for lights[] of length '${lights.length}'`);
                
                nodes.push(new GLTFNodeLight(
                    node.name,
                    node.rotation,
                    translation,
                    lights[node.extensions.KHR_lights_punctual.light]
                ));
                continue;
            }

            // unknown node
            throw new BadGLTFFileError(`Unrecognized node:\n\n${node}`);
        }

        // scenes
        const scenes: GLTFScene[] = [];
        for (const scene of gltfSave.scenes) {
            
            if (scene.nodes.some(nodeIndex => nodeIndex < 0 || nodeIndex >= nodes.length))
                throw new BadGLTFFileError(`Invalid scene node index for nodes[] of length '${nodes.length}'`);
            
            scenes.push(new GLTFScene(
                scene.name,
                scene.nodes.map(nodeIndex => nodes[nodeIndex])
            ));
        }
        
        return new GLTFFile(
            {
                generator: gltfSave.asset.generator,
                version: gltfSave.asset.version
            },
            scenes,
            gltfSave.scene
        );

    }

}