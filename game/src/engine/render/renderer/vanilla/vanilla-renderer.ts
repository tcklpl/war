import { RenderStagePrePass } from ':engine/render/renderer/vanilla/render-stages/geometry/prepass.render-stage.ts';
import { FrameGraph } from ':engine/resources/frame-graph';
import { WebGPUUnsupportedError } from '../../../../errors/engine/initialization/webgpu-unsupported';
import { useRenderTargetStore } from '../../../../state/render-target.store';
import { MathUtils } from '../../../../utils/math-utils';
import { Vec2 } from '../../../data/vec/vec2';
import { Renderer } from '../../renderer/renderer';
import { RenderPostEffects } from './render-post-effects';
import { RenderProjection } from './render-projection';
import { RenderResourcePool } from './render-resource-pool';
import { VanillaRenderPipeline } from './vanilla-render-pipeline';

export class VanillaRenderer extends Renderer {
	private readonly _renderProjection = new RenderProjection();
	private _renderPostEffects!: RenderPostEffects;
	private readonly _renderPipeline = new VanillaRenderPipeline();
	private readonly _renderResourcePool = new RenderResourcePool(this._device);

	private _renderTargetCanvas?: HTMLCanvasElement;
	private _renderTargetCanvasContext?: GPUCanvasContext;

	private _prepass = new RenderStagePrePass(this._device);

	private readonly _frameGraph = new FrameGraph(this._device);

	constructor(private readonly _device: GPUDevice) {
		super();
		useRenderTargetStore.subscribe(newState => {
			if (!newState.renderTargetCanvas) {
				console.warn('New render target state does not have a valid canvas');
				return;
			}
			this._renderTargetCanvas = newState.renderTargetCanvas;

			const context = this._renderTargetCanvas.getContext('webgpu');
			if (!context) throw new WebGPUUnsupportedError('Failed to get canvas WebGPU context');

			this._renderTargetCanvasContext = context;

			const preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
			this._renderTargetCanvasContext.configure({
				device: _device,
				format: preferredCanvasFormat,
			});

			this.assertCanvasResolution();
		});
	}

	private buildFrameGraph() {
		this._frameGraph.addPass(builder => {
			builder.write({
				identifier: 'depth',
				kind: 'texture',
				format: 'depth24plus',
				size: 'full resolution',
			});
			builder.write({
				identifier: 'velocity',
				kind: 'texture',
				format: 'rg16float',
				size: 'full resolution',
			});
			builder.initialize(async e => {
				const viewProjBuffer = e.resolveResourceKey({ kind: 'buffer', identifier: 'view proj' });
				await this._prepass.initialize(viewProjBuffer);
			});
			builder.execute(e => {
				const depthTexture = e.resolveResourceKey({ kind: 'texture', identifier: 'depth' });
				const velocityTexture = e.resolveResourceKey({ kind: 'texture', identifier: 'velocity' });
				this._prepass.render(e.commandEncoder, e.currentScene, depthTexture.view, velocityTexture.view);
			});
		});
	}

	// Jitter offsets - Needed for TAA, should be an array of zeroes if TAA is disabled
	private readonly _jitterOffsetCount = 16;
	private _jitterOffsets: Vec2[] = [];
	private _currentJitter = 0;

	async initialize() {
		this._renderProjection.initialize();
		this._renderPostEffects = new RenderPostEffects();
		await this._renderResourcePool.initialize();
		this._renderResourcePool.resizeBuffers(this._renderProjection.resolution);
		this._renderPipeline.buildPipeline(game.engine.config.graphics);
		await this._renderPipeline.initialize(this._renderResourcePool);
		this.buildJitterOffsets(this._renderProjection.resolution.full);
	}

	/**
	 * Jitter offsets used by TAA (Temporal Anti-Aliasing) to smooth pixelated edges.
	 * Should be initialized to an array of zeroes if TAA is disabled.
	 *
	 * @param resolution Screen resolution, needed to make sure all jitter offsets are less than 1px.
	 */
	private buildJitterOffsets(resolution: Vec2) {
		let offsets: Vec2[] = [];

		if (game.engine.config.graphics.useTAA) {
			for (let i = 0; i < this._jitterOffsetCount; i++) {
				const offset = new Vec2(MathUtils.haltonSequence(2, i), MathUtils.haltonSequence(3, i));
				offset.x = ((offset.x - 0.5) / resolution.x) * 2;
				offset.y = ((offset.y - 0.5) / resolution.y) * 2;
				offsets.push(offset);
			}
		} else {
			offsets = Array(this._jitterOffsetCount).fill(Vec2.fromValue(0));
		}

		this._jitterOffsets = offsets;
	}

	private async assertCanvasResolution() {
		if (!this._renderTargetCanvas) {
			console.warn('Trying to assert canvas resolution without a canvas');
			return;
		}
		const width = Math.max(
			1,
			Math.min(this._device.limits.maxTextureDimension2D, this._renderTargetCanvas.clientWidth),
		);
		const height = Math.max(
			1,
			Math.min(this._device.limits.maxTextureDimension2D, this._renderTargetCanvas.clientHeight),
		);

		const resize =
			!this._renderResourcePool.hasTextures ||
			width !== this._renderTargetCanvas.width ||
			height !== this._renderTargetCanvas.height;
		if (!resize) return;

		await this._device.queue.onSubmittedWorkDone();

		this._renderTargetCanvas.width = width;
		this._renderTargetCanvas.height = height;
		this._renderProjection.updateResolution(new Vec2(width, height));
		this._renderResourcePool.resizeBuffers(this._renderProjection.resolution);
		this._renderPipeline.dispatchResolutionUpdate(this._renderResourcePool);
		this.buildJitterOffsets(this._renderProjection.resolution.full);
	}

	async render() {
		const scene = game.engine.managers.scene.activeScene;
		if (!scene) {
			console.warn('Trying to render with no active scene');
			return;
		}
		const camera = scene.activeCamera;
		if (!camera) {
			console.warn('Trying to render with no active camera');
			return;
		}

		this._currentJitter = (this._currentJitter + 1) % this._jitterOffsetCount;
		const frameJitter = this._jitterOffsets[this._currentJitter];

		await this.assertCanvasResolution();
		const commandEncoder = this._device.createCommandEncoder();
		this._renderResourcePool.prepareForFrame({
			scene,
			commandEncoder,
			projection: this._renderProjection,
			postEffets: this._renderPostEffects,
			jitter: frameJitter,
		});
		await this._renderPipeline.render(this._renderResourcePool);
		this._device.queue.submit([commandEncoder.finish()]);

		await this._renderResourcePool.updatePicking();
		await this._renderResourcePool.luminanceHistogram.updateLuminanceHistogram();
		this._renderPostEffects.avg_luminance_target = this._renderResourcePool.luminanceHistogram.avg;
	}

	async free() {
		this._renderResourcePool.free();
		this._renderPipeline.free();
	}
}
