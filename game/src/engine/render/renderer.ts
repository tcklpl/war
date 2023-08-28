
export abstract class Renderer {

    abstract initialize(): Promise<void>;
    abstract render(): void;
    abstract free(): void;

}