import { FrameGraphPassBuilder } from './frame-graph-pass-builder';

export class FrameGraph {
	state: 'new' | 'compiled' = 'new';

	private readonly _passDefBuilders: FrameGraphPassBuilder[] = [];

	constructor(private readonly _device: GPUDevice) {}

	addPass(def: (builder: FrameGraphPassBuilder) => void) {
		const builder = new FrameGraphPassBuilder();
		def(builder);
		this._passDefBuilders.push(builder);
	}
}
