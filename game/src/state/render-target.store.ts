import { create } from 'zustand';

export interface RenderTargetStore {
	renderTargetCanvas?: HTMLCanvasElement;
	setRenderTargetCanvas(canvas: HTMLCanvasElement): void;
}

export const useRenderTargetStore = create<RenderTargetStore>()(set => ({
	setRenderTargetCanvas: canvas => set({ renderTargetCanvas: canvas }),
}));
