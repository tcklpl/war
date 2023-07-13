import assetIndex from '../../asset_index.json';
import { Camera } from '../../engine/camera/camera';
import { Scene } from '../../engine/data/scene/scene';
import { Entity } from '../../engine/entity/entity';
import { GLTFLoader } from '../../engine/loader/gltf/gltf_loader';
import { LoadingState } from './loading_state';


export class WarGameLoader {

    private _loadingState = LoadingState.INITIALIZING;

    private _gltfLoader = new GLTFLoader();

    
    loadGLTFAssets() {
        assetIndex.gltf.forEach(asset => {
            fetch(asset.url).then(res => res.json().then(resj => this._gltfLoader.constructGLTFAsset(resj).then(res => {
                const entities: Entity[] = [];

                res.defaultScene.meshes.forEach(mesh => {
                    const constructedEntity = mesh.constructEntity();
                    entities.push(constructedEntity);
                });

                const cameras: Camera[] = [];
                res.defaultScene.cameras.forEach(cam => {
                    const constructedCamera = cam.constructEngineCamera();
                    cameras.push(constructedCamera);
                });

                const scene = new Scene(res.defaultScene.name, entities, cameras);
                game.engine.managers.scene.register(scene);
                game.engine.managers.scene.activeScene = scene;
            })));
        });
    }

}