
export abstract class Renderer {

    abstract initialize(): void;
    abstract render(): void;
    abstract free(): void;

    abstract get pbrPipeline(): GPURenderPipeline;

}