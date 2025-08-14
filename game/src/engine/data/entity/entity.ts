import { animatable } from ':engine/traits/animatable.trait';
import { flaggable } from ':engine/traits/flaggable.trait';
import { outlinable } from ':engine/traits/outlinable.trait';
import { overlayable } from ':engine/traits/overlayable.trait';
import { transformable } from ':engine/traits/transformable.trait';
import { visible } from ':engine/traits/visible.trait';
import { BufferUtils } from '../../../utils/buffer-utils';
import { identifiable } from '../../traits/identifiable.trait';
import { Mat4 } from '../mat/mat4';
import { Vec4 } from '../vec/vec4';

const EntityBase = visible(overlayable(outlinable(flaggable(transformable(animatable(identifiable(class {})))))));

export class Entity extends EntityBase {
	protected readonly _entityObjectBuffer = BufferUtils.createEmptyBuffer(
		3 * Mat4.byteSize + 2 * Vec4.byteSize + 4,
		GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	);

	constructor() {
		super();
		this.registerTransformableBuffer(this._entityObjectBuffer, {
			modelMatrix: 0,
			inverseModelMatrix: 0x40,
			previousFrameModelMatrix: 0x80,
		});
		this.registerOverlayableBuffer(this._entityObjectBuffer, 0xc0);
		this.registerOutlinableBuffer(this._entityObjectBuffer, 0xd0);
		this.writeIdToBuffer(this._entityObjectBuffer, 0xe0);
		this.registerFlaggableBuffer(this._entityObjectBuffer, 0xe4);
	}

	destroy() {
		this._entityObjectBuffer.destroy();
	}
}
