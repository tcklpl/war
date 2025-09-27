import type { Scene } from ':engine/data/scene/scene.ts';
import type { Texture } from ':engine/data/texture/texture.ts';
import type { ReadResourceDef, ReadResourceDefBuffer, ReadResourceDefTexture } from './read-resource-def';

type ResourceKeyReturn<K> = K extends ReadResourceDefTexture
	? Texture
	: K extends ReadResourceDefBuffer
		? GPUBuffer
		: never;

export class FrameGraphPassExecutor {
	resolveResourceKey<K extends ReadResourceDef>(key: K): ResourceKeyReturn<K> {
		return {} as unknown as ResourceKeyReturn<K>;
	}

	get currentScene(): Scene {
		return {} as Scene;
	}

	get commandEncoder(): GPUCommandEncoder {
		return {} as GPUCommandEncoder;
	}
}
