import type { MappedRegionSize } from './mapped-region-size';

export interface MappedRegionRequest {
	preferredSize: MappedRegionSize;
	canShrink: boolean;
}
