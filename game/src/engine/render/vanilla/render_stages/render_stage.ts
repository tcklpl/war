import { RenderInitializationResources } from '../render_initialization_resources';
import { RenderResourcePool } from '../render_resource_pool';

export interface RenderStage {
    initialize: (resources: RenderInitializationResources) => Promise<void>;
    render: (pool: RenderResourcePool) => void;
    free?: () => void;
}
