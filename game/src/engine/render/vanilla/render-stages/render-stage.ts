import type { RenderInitializationResources } from '../render-initialization-resources';
import type { RenderResourcePool } from '../render-resource-pool';

export interface RenderStage {
	initialize: (resources: RenderInitializationResources) => Promise<void>;
	render: (pool: RenderResourcePool) => void;
	free?: () => void;

	onScreenResize?: (pool: RenderResourcePool) => void;
}
