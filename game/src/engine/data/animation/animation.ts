import { Animatable } from './animatable';

export class Animation<T extends Animatable> {
    constructor(readonly name: string) {}
}
