import { Entity } from ':engine/data/entity/entity';
import { EntityFlag } from ':engine/data/entity/entity-flag';
import { Vec4 } from ':engine/data/vec/vec4';
import { PrincipledBSDFPipeline } from ':engine/render/pipeline/geometry/principled-bsdf.pipeline';
import { interactable } from ':engine/traits/interactable.trait';
import { renderable } from ':engine/traits/renderable.trait';
import type { TerritoryCode } from ':protocol';
import { MissingAssetError } from '../../errors/engine/asset/missing-asset';
import { PrincipledBSDFShader } from '../../shaders/geometry/principled-bsdf/principled-bsdf-shader';

const BoardCountryBase = renderable(
	{ pipeline: PrincipledBSDFPipeline, modelBindGroupIndex: PrincipledBSDFShader.BINDING_GROUPS.MODEL },
	interactable(Entity),
);

export class BoardCountry extends BoardCountryBase {
	constructor(
		name: string,
		gltfName: string,
		public readonly territoryCode: TerritoryCode,
	) {
		super();

		const meshNode = game.engine.managers.asset
			.getGLTFAsset('board')
			.gltfFile.defaultScene.meshes.find(m => m.name === gltfName);
		if (!meshNode) throw new MissingAssetError(`Failed to get mesh with name '${gltfName}' for country '${name}'`);
		this.mesh = meshNode.mesh.convertToEngineMesh();

		this.registerRenderableObjectBuffer(this._entityObjectBuffer);

		this.position = meshNode.translation;
		this.rotation = meshNode.rotation;
		this.scale = meshNode.scale;
	}

	onMouseHover(): void {
		this.overlay = new Vec4(1, 0, 0, 1);
		this.addFlag(EntityFlag.OUTLINE);
	}

	onMouseLeave(): void {
		this.overlay = new Vec4(0, 0, 0, 0);
		this.removeFlag(EntityFlag.OUTLINE);
	}
}
