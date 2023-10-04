import { MappedRegionSize } from "./mapped_region_size";

export interface MappedRegionRequest {
    preferredSize: MappedRegionSize;
    canShrink: boolean;
}