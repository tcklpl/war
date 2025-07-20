export abstract class Renderer {
	abstract initialize(): Promise<void>;
	abstract render(): Promise<void>;
	abstract free(): Promise<void>;
}
