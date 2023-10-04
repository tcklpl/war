import { MathUtils } from "../../../utils/math_utils";
import { Texture } from "../texture/texture";
import { Vec2 } from "../vec/vec2";
import { AtlasTree } from "./atlas_tree";
import { MappedAtlasRegion } from "./mapped_atlas_region";
import { MappedRegionRequest } from "./mapped_region_request";
import { MappedRegionSize } from "./mapped_region_size";

export class Atlas {

    private _atlasTexture = new Texture();
    private _resolution: number;
    private _mappedRegions: MappedAtlasRegion[] = [];
    private _tree = new AtlasTree();

    constructor(props: {resolution: number, format: GPUTextureFormat, usage: number, label?: string}) {
        const resolution = MathUtils.clamp(1, device.limits.maxTextureDimension2D, props.resolution);
        this._resolution = resolution;

        this._atlasTexture.texture = device.createTexture({
            label: props.label ?? 'unnamed atlas texture',
            format: props.format,
            size: [resolution, resolution],
            usage: props.usage
        });
    }

    private mappedSizeToAtlasDepth(size: MappedRegionSize) {
        switch (size) {
            case MappedRegionSize.BIG:
                return 1;
            case MappedRegionSize.MEDIUM:
                return 2;
            case MappedRegionSize.SMALL:
                return 3;
            default:
                return 3;
        }
    }

    requestMappedRegion(req: MappedRegionRequest) {
        let desiredAtlasDepth = this.mappedSizeToAtlasDepth(req.preferredSize);
        let availableNode;
        do {
            // try to find an available node at the desired depth
            availableNode = this._tree.tryToFindAvailableNode(desiredAtlasDepth);
            // if not, check if we can get a smaller node. If we can, try again with a smaller one.
            if (!availableNode && req.canShrink && desiredAtlasDepth < 3) {
                desiredAtlasDepth++;
            }
        } while (!availableNode && desiredAtlasDepth < 3);

        // return null if we're unable to find an available node with the specified parameters
        if (!availableNode) return null;

        // set the node as not available
        availableNode.available = false;
        const nodeGridSide = 4 / (2**(availableNode.depth - 1));

        // size of an individual small node on the target texture, our node can be 1, 2 or 4 of these
        const smallNodeTextureSide = this._resolution * MappedRegionSize.SMALL;

        // side of the mapped region side
        const finalTextureSide = smallNodeTextureSide * nodeGridSide;
        
        // lower and higher positions on the texture
        const lowerTexturePosition = new Vec2(
            availableNode.position.x * smallNodeTextureSide,
            availableNode.position.y * smallNodeTextureSide
        );
        const higherTexturePosition = new Vec2(
            lowerTexturePosition.x + finalTextureSide,
            lowerTexturePosition.y + finalTextureSide
        );
        
        // UV corners (from 0 to 1)
        const uvLowerCorner = new Vec2(
            availableNode.position.x / 8,
            availableNode.position.y / 8
        );
        const uvHigherCorner = new Vec2(
            (availableNode.position.x + nodeGridSide) / 8,
            (availableNode.position.y + nodeGridSide) / 8
        );

        const mappedRegion = new MappedAtlasRegion(lowerTexturePosition, higherTexturePosition, uvLowerCorner, uvHigherCorner, availableNode);
        this._mappedRegions.push(mappedRegion);
        return mappedRegion;
    }

    freeMappedRegion(map: MappedAtlasRegion) {
        map.treeNode.available = true;
        this._mappedRegions = this._mappedRegions.filter(r => r !== map);
    }
    
    free() {
        this._atlasTexture.free();
    }    

    get resolution() {
        return this._resolution;
    }

    get mappedRegions() {
        return this._mappedRegions;
    }

    get texture() {
        return this._atlasTexture;
    }
}