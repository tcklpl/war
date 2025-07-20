import type { RenderResourcePool } from '../render-resource-pool';

export interface RenderStage {
	initialize?: (pool: RenderResourcePool) => Promise<void>;
	render: (pool: RenderResourcePool) => void | Promise<void>;
	free?: () => void;

	onScreenResize?: (pool: RenderResourcePool) => void;
}
