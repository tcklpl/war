import { Scene } from "../../engine/data/scene/scene";
import { BoardCamera } from "./board_camera";
import { BoardCountriesIndex } from "./board_countries_index";
import { BoardLights } from "./board_lights";

export class GameBoard extends Scene {

    private _mainCamera: BoardCamera;
    private _countries: BoardCountriesIndex;
    private _boardLights: BoardLights;

    constructor() {
        const mainCamera = new BoardCamera()
        const countries = new BoardCountriesIndex();
        const lights = new BoardLights();
        
        super('Game board scene', [...countries.allCountries], [ mainCamera ], [ lights.sun ]);
        this._mainCamera = mainCamera;
        this._countries = countries;
        this._boardLights = lights;
        this.activeCamera = this._mainCamera;
        
    }

}