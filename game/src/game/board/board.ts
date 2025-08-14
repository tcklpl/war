import { Scene } from ':engine/data/scene/scene';
import { BoardCamera } from './board-camera';
import { BoardCountriesIndex } from './board-countries-index';
import { BoardLights } from './board-lights';
import { BoardSkybox } from './board-skybox';

export class GameBoard extends Scene {
	private readonly _mainCamera: BoardCamera;
	readonly countries: BoardCountriesIndex;
	private readonly _boardLights: BoardLights;
	private readonly _skybox: BoardSkybox;

	constructor() {
		const mainCamera = new BoardCamera();
		const countries = new BoardCountriesIndex();
		const lights = new BoardLights();
		const skybox = new BoardSkybox();

		super('Game board scene', {
			entities: [...countries.allCountries],
			cameras: [mainCamera],
			lights: [lights.sun],
			skyboxes: [skybox],

			activeCamera: mainCamera,
			activeSkybox: skybox,
		});
		this._mainCamera = mainCamera;
		this.countries = countries;
		this._boardLights = lights;
		this._skybox = skybox;
	}

	async initialize() {
		await this._skybox.initialize();
		await this.buildSceneInfo();
	}
}
