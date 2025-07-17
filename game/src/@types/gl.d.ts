import type { WarGame } from ':game/war-game';

declare global {
	var gl: WebGL2RenderingContext;
	var device: GPUDevice;
	var gameCanvas: HTMLCanvasElement;
	var game: WarGame;
	var gpuCtx: GPUCanvasContext;
}

export default global;
