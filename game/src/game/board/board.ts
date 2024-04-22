import { Scene } from "../../engine/data/scene/scene";
import { BoardCamera } from "./board_camera";
import { BoardCountriesIndex } from "./board_countries_index";
import { BoardLights } from "./board_lights";
import { BoardSkybox } from "./board_skybox";

export class GameBoard extends Scene {

    private _mainCamera: BoardCamera;
    private _countries: BoardCountriesIndex;
    private _boardLights: BoardLights;
    private _skybox: BoardSkybox;

    constructor() {
        const mainCamera = new BoardCamera()
        const countries = new BoardCountriesIndex();
        const lights = new BoardLights();
        const skybox = new BoardSkybox();
        
        super('Game board scene', {
            entities: [ ...countries.allCountries ],
            cameras: [ mainCamera ],
            lights: [ lights.sun, ...countries.allCountries.map(c => c.hoverLight) ],
            skyboxes: [ skybox ],

            activeCamera: mainCamera,
            activeSkybox: skybox
        });
        this._mainCamera = mainCamera;
        this._countries = countries;
        this._boardLights = lights;
        this._skybox = skybox;
    }

    async initialize() {
        await this._skybox.initialize();
        await this.buildSceneInfo();
    }

}