import { Subject } from 'rxjs';
import { AssetManager } from './asset/asset-manager';
import { ConfigManager } from './config/cfg-manager';
import { CameraManager } from './data/camera/camera-manager';
import { LightManager } from './data/lights/light-manager';
import { MaterialManager } from './data/material/material-manager';
import { MeshManager } from './data/meshes/mesh-manager';
import { SceneManager } from './data/scene/scene-manager';
import { IDBWarConnection } from './idb-war-connection';
import { IdentifierPool } from './identifier-pool';
import { GameIO } from './io/io';
import type { Renderer } from './render/renderer/renderer';
import { BRDFLUTRenderer } from './render/renderer/util/brdf-lut.renderer';
import { CubemapPrefilterRenderer } from './render/renderer/util/cubemap-prefilter.renderer';
import { EquirectangularToCubemapRenderer } from './render/renderer/util/equirec-to-cubemap.renderer';
import { MipmapRenderer } from './render/renderer/util/mipmap.renderer';
import { TexturePackingRenderer } from './render/renderer/util/texture-packing.renderer';
import { VanillaRenderer } from './render/renderer/vanilla/vanilla-renderer';
import { Time } from './time';

export class Engine {
	private _renderer: Renderer = new VanillaRenderer();
	private _shouldRender = false;

	readonly idPool = new IdentifierPool();
	readonly db = new IDBWarConnection();
	private _config!: ConfigManager;

	readonly managers = {
		io: new GameIO(),
		asset: new AssetManager(),
		camera: new CameraManager(),
		mesh: new MeshManager(),
		scene: new SceneManager(),
		material: new MaterialManager(),
		light: new LightManager(),
	};

	readonly utilRenderers = {
		equirecToCubemap: new EquirectangularToCubemapRenderer(),
		cubemapPrefilter: new CubemapPrefilterRenderer(),
		BRDF_LUT: new BRDFLUTRenderer(),
		mipmap: new MipmapRenderer(),
		packing: new TexturePackingRenderer(),
	};

	readonly onFrame$ = new Subject<number>();
	readonly onSecond$ = new Subject<void>();

	private _brdfLUT!: GPUTexture;

	// time
	private _lastFrameTime = 0;
	private _lastFullSecondTime = 0;
	private _framesRenderedSinceLastSecond = 0;

	constructor() {
		requestAnimationFrame(time => this.renderLoop(time));
	}

	private async renderLoop(time: number) {
		const msDiff = time - this._lastFrameTime;
		const deltaTime = msDiff / 1000;
		Time.updateDeltaTime(deltaTime);
		this._lastFrameTime = time;
		if (time - this._lastFullSecondTime >= 1000) {
			this._lastFullSecondTime = time;
			Time.updateFPS(this._framesRenderedSinceLastSecond);
			this._framesRenderedSinceLastSecond = 0;
			this.onSecond$.next();
		}

		if (this._shouldRender) {
			// Update all frame listeners before rendering
			this.onFrame$.next(deltaTime);
			await this._renderer.render();
		}

		this._framesRenderedSinceLastSecond++;
		requestAnimationFrame(time => this.renderLoop(time));
	}

	pauseRender() {
		this._shouldRender = false;
	}

	async initialize() {
		await this.initializeDB();
		await this.initializeRenderers();
	}

	private async initializeDB() {
		await this.db.openConnection();
		this._config = new ConfigManager(this.db);
		await this._config.loadConfig();
		await this._config.saveConfig();
		await this.managers.asset.initializeDB(this.db);
	}

	private async initializeRenderers() {
		await this.utilRenderers.equirecToCubemap.initialize();
		await this.utilRenderers.cubemapPrefilter.initialize();
		await this.utilRenderers.BRDF_LUT.initialize();
		await this.utilRenderers.mipmap.initialize();
		await this.utilRenderers.packing.initialize();
		await this._renderer.initialize();

		this._brdfLUT = await this.utilRenderers.BRDF_LUT.renderLUT();
	}

	resumeRender() {
		this._shouldRender = true;
	}

	async free() {
		// prevent rendering while we destroy the whole engine
		this.pauseRender();

		// assets don't need any memory freeing
		// cameras also don't need any memory freeing
		this.managers.mesh.freeMeshes();
		// scenes also don't need any memory freeing
		this.managers.material.freeMaterials();
		this.managers.scene.freeScenes();

		this.utilRenderers.equirecToCubemap.free();
		this.utilRenderers.cubemapPrefilter.free();
		this.utilRenderers.BRDF_LUT.free();
		this.utilRenderers.mipmap.free();
		this.utilRenderers.packing.free();

		this._brdfLUT?.destroy();

		this._renderer.free();
	}

	async reinitializeRenderer() {
		const wasRendering = this._shouldRender;
		this.pauseRender();

		await this._renderer.free();
		this._renderer = new VanillaRenderer();
		await this._renderer.initialize();

		if (wasRendering) this.resumeRender();
	}

	get config() {
		return this._config;
	}

	get renderer() {
		return this._renderer;
	}

	get brdfLUT() {
		return this._brdfLUT;
	}
}
