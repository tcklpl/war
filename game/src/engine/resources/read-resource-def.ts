export type ReadResourceDefBase = {
	identifier: string;
};

export type ReadResourceDefTexture = ReadResourceDefBase & {
	kind: 'texture';
};

export type ReadResourceDefBuffer = ReadResourceDefBase & {
	kind: 'buffer';
};

export type ReadResourceDef = ReadResourceDefTexture | ReadResourceDefBuffer;
