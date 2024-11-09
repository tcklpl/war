import { MappedAtlasRegion } from '../atlas/mapped_atlas_region';
import { MappedRegionSize } from '../atlas/mapped_region_size';
import { Mat4 } from '../mat/mat4';
import { Vec3 } from '../vec/vec3';

export interface LightProperties {
    name: string;
    position: Vec3;
    color: Vec3;
    intensity: number;
    range: number;

    /**
     * If the light can cast shadows.
     */
    castsShadows: boolean;
    /**
     * Required shadow map resolution.
     */
    shadowMapSize: MappedRegionSize;
    /**
     * If the light source can accept having it's shadow map resolution smaller
     * than the specified at "shadowMapSize".
     */
    shadowMapCanShrink: boolean;
}

export abstract class Light {
    private readonly _properties: LightProperties;
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
        properties: LightProperties,
        private _enabled = true,
    ) {
        this._properties = properties;
        game.engine.managers.light.register(this);
    }

    get properties() {
        return this._properties;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(e: boolean) {
        this._enabled = e;
    }

    abstract writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void;
}
