import type { MappedAtlasRegion } from '../atlas/mapped-atlas-region';
import type { MappedRegionSize } from '../atlas/mapped-region-size';
import type { Mat4 } from '../mat/mat4';
import type { Vec3 } from '../vec/vec3';

type BaseLightProperties = {
	name: string;
	position: Vec3;
	color: Vec3;
	intensity: number;
	range: number;
	radius: number;

	/**
	 * If the light can cast shadows.
	 */
	castsShadows: boolean;
};

type LightPropertiesNoShadow = BaseLightProperties & {
	castsShadows: false;
};

type LightPropertiesWithShadow = BaseLightProperties & {
	castsShadows: true;
	/**
	 * Required shadow map resolution.
	 */
	shadowMapSize: MappedRegionSize;
	/**
	 * If the light source can accept having it's shadow map resolution smaller
	 * than the specified at "shadowMapSize".
	 */
	shadowMapCanShrink: boolean;
};

export type LightProperties = LightPropertiesNoShadow | LightPropertiesWithShadow;

export abstract class Light {
	/**
	 * Shadow map atlas region if shadow mapping is enabled.
	 *
	 * If shadow mapping is enabled and this value is undefined (as it will be on the first frame),
	 * the "light" render stage will try to allocate a spot on the shadow map atlas and overwrite this
	 * attribute.
	 */
	shadowAtlasMappedRegion?: MappedAtlasRegion;
	shadowMappingViewProj?: Mat4;

	constructor(
		private readonly _properties: LightProperties,
		public enabled = true,
	) {
		game.engine.managers.light.register(this);
	}

	abstract writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void;

	get properties() {
		return this._properties;
	}
}
