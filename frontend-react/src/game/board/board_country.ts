import { Entity } from "../../engine/entity/entity";
import { MissingAssetError } from "../../errors/engine/asset/missing_asset";

export class BoardCountry extends Entity {

    constructor(name: string, private _gltfName: string) {
        
        const meshNode = game.engine.managers.asset.getGLTFAsset('board').gltfFile.defaultScene.meshes.find(m => m.name === _gltfName);
        if (!meshNode) throw new MissingAssetError(`Failed to get mesh with name '${_gltfName}' for country '${name}'`);

        super({
            name: name,
            mesh: meshNode.mesh.asEngineMesh
        });
        this.translation = meshNode.translation;
        this.rotationQuaternion = meshNode.rotation;
        this.scale = meshNode.scale;
    }

}