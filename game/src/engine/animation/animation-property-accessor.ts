export interface AnimationPropertyAccessor<T> {
	get(): T;
	set(value: T): void;
}
