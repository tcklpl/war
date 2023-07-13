import { WarGame } from "../game/war_game";

declare global {
    var gl: WebGL2RenderingContext;
    var device: GPUDevice;
    var gameCanvas: HTMLCanvasElement;
    var game: WarGame;
}

export default global;