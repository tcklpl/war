import { WarGame } from "../game/war_game";

declare global {
    var gl: WebGL2RenderingContext;
    var device: GPUDevice;
    var gameCanvas: HTMLCanvasElement;
    var game: WarGame;
    var gpuCtx: GPUCanvasContext;

    interface Window {
        electron_api?: {
            nodeReadFileText(channel: 'channel-fs', path: string): Promise<string>;
            nodeReadFileBuffer(channel: 'channel-fs', path: string): Promise<Buffer>;
        }
    }
}

export default global;