import { MappedRegionSize } from ':engine/data/atlas/mapped_region_size';
import { Entity } from ':engine/data/entity/entity';
import { PointLight } from ':engine/data/lights/point_light';
import { interactable } from ':engine/data/traits/interactable';
import { Vec3 } from ':engine/data/vec/vec3';
import { MissingAssetError } from '../../errors/engine/asset/missing_asset';
import {
    BoardCountryAnimationHoverOn,
    BoardCountryAnimationResetPosition,
} from './animations/board_country_animations';

const BoardCountryBase = interactable(Entity);
export class BoardCountry extends BoardCountryBase {
    private readonly _hoverLight = new PointLight(
        {
            color: Vec3.fromValue(1),
            intensity: 10,
            name: 'hover light',
            position: this.translation,
            castsShadows: false,
            range: 1000,
            radius: 10,
            shadowMapSize: MappedRegionSize.SMALL,
            shadowMapCanShrink: true,
        },
        false,
    );
    private readonly _lightOffset = new Vec3(0, -0.1, 0);

    private readonly animationTable = {
        hoverOn: BoardCountryAnimationHoverOn(this),
        resetPosition: BoardCountryAnimationResetPosition(this, this.translation),
    };

    constructor(
        name: string,
        private readonly _gltfName: string,
    ) {
        const meshNode = game.engine.managers.asset
            .getGLTFAsset('board')
            .gltfFile.defaultScene.meshes.find(m => m.name === _gltfName);
        if (!meshNode) throw new MissingAssetError(`Failed to get mesh with name '${_gltfName}' for country '${name}'`);

        super({
            name: name,
            mesh: meshNode.mesh.asEngineMesh,
        });
        this.translation = meshNode.translation;
        this.rotationQuaternion = meshNode.rotation;
        this.scale = meshNode.scale;

        this.onTransform(() => {
            this._hoverLight.properties.position = this.translation.add(this._lightOffset);
        });

        this.updateAnimationTable();
    }

    onMouseHover(): void {
        this.overlayIntensity = 0;
        this.overlayColor = new Vec3(5, 0, 0);
        this._hoverLight.enabled = false;
        this.puppeteer.cancelAllAnimations();
        this.puppeteer.playAnimation(this.animationTable.hoverOn);
    }

    onMouseLeave(): void {
        this.overlayIntensity = 0;
        this._hoverLight.enabled = false;
        this.puppeteer.cancelAllAnimations();
        this.puppeteer.playAnimation(this.animationTable.resetPosition);
    }

    private updateAnimationTable() {
        this.animationTable.resetPosition = BoardCountryAnimationResetPosition(this, this.translation);
    }

    get hoverLight() {
        return this._hoverLight;
    }
}
