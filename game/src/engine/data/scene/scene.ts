import { Camera } from "../camera/camera";
import { Entity } from "../entity/entity";
import { Light } from "../lights/light";
import { Skybox } from "../skybox/skybox";

export class Scene {

    private _entities: Entity[];
    private _cameras: Camera[];
    private _lights: Light[];
    private _skyboxes: Skybox[];

    private _activeCamera?: Camera;
    private _activeSkybox?: Skybox;

    private _entitiesPerWindingOrder = {
        cw: [] as Entity[],
        ccw: [] as Entity[]
    };
    
    constructor(private _name: string, props: {
        entities: Entity[],
        cameras: Camera[],
        lights: Light[],
        skyboxes: Skybox[]
    }) {
        this._entities = props.entities;
        this._cameras = props.cameras;
        this._lights = props.lights;
        this._skyboxes = props.skyboxes;
        this.buildWindingOrderCache();
    }

    buildWindingOrderCache() {
        this._entitiesPerWindingOrder.cw = [];
        this._entitiesPerWindingOrder.ccw = [];

        this._entities.forEach(e => {
            switch (e.windingOrder) {
                case 'cw':
                    this._entitiesPerWindingOrder.cw.push(e);
                    break;
                case 'ccw':
                    this._entitiesPerWindingOrder.ccw.push(e);
                    break;
            }
        });
    }

    get activeCamera() {
        if (!this._activeCamera && this._cameras.length > 0) {
            console.log(`Scene '${this._name}' doesn't have an active camera, setting the first one as active`);
            this._activeCamera = this._cameras[0];
        }
        return this._activeCamera;
    }

    set activeCamera(c: Camera | undefined) {
        this._activeCamera = c;
    }

    get activeSkybox() {
        return this._activeSkybox;
    }

    set activeSkybox(s: Skybox | undefined) {
        this._activeSkybox = s;
    }

    get entitiesToRender() {
        return this._entities;
    }

    get entitiesPerWindingOrder() {
        return this._entitiesPerWindingOrder;
    }

    get lights() {
        return this._lights;
    }

    get skyboxes() {
        return this._skyboxes;
    }

}