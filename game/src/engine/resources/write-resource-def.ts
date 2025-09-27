import type { Vec2 } from ':engine/data/vec/vec2';
import type { Resolution } from ':engine/resolution';

export type WriteResourceDefBase = {
	identifier: string;
};

export type WriteResourceDefTexture = WriteResourceDefBase & {
	kind: 'texture';
	size: 'full resolution' | 'half resolution' | 'quarter resolution' | 'specific';
	specificSize?: (resolution: Resolution) => Vec2;
	format: GPUTextureFormat;
	/**
	 * GPU Texture usage, by default will be RENDER_ATTACHMENT and TEXTURE_BINDING.
	 */
	usage?: number;
};

export type WriteResourceDefBuffer = WriteResourceDefBase & {
	kind: 'buffer';
};

export type WriteResourceDef = WriteResourceDefTexture | WriteResourceDefBuffer;
