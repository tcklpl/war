import { Manager } from '../../manager';
import { Scene } from './scene';

export class SceneManager extends Manager<Scene> {
    activeScene?: Scene;

    freeScenes() {
        this.all.forEach(x => x.free());
    }
}
