import { EngineError } from '../../errors/engine/engine-error';
import type { FrameGraphPassExecutor } from './frame-graph-pass-executor';
import type { ReadResourceDef } from './read-resource-def';
import type { WriteResourceDef } from './write-resource-def';

export class FrameGraphPassBuilder {
	readonly writeDefs: WriteResourceDef[] = [];
	readonly readDefs: ReadResourceDef[] = [];
	private _initializationLambda?: (executor: FrameGraphPassExecutor) => void | Promise<void>;
	private _executionLambda?: (executor: FrameGraphPassExecutor) => void | Promise<void>;

	write(def: WriteResourceDef) {
		this.writeDefs.push(def);
	}

	read(identifier: ReadResourceDef) {
		this.readDefs.push(identifier);
	}

	initialize(lambda: (executor: FrameGraphPassExecutor) => void | Promise<void>) {
		this._initializationLambda = lambda;
	}

	execute(lambda: (executor: FrameGraphPassExecutor) => void | Promise<void>) {
		this._executionLambda = lambda;
	}

	get executionLambda() {
		if (!this._executionLambda)
			throw new EngineError('Trying to read an execution lambda from a pass builder that has none');
		return this._executionLambda;
	}

	get initializationLambda() {
		if (!this._initializationLambda)
			throw new EngineError('Trying to read an initialization lambda from a pass builder that has none');
		return this._initializationLambda;
	}
}
