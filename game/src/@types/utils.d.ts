
declare module 'typeUtils' {
    type Constructor<T = any> = new (...args: any[]) => T;
    type Listener<T = any> = (value: T) => void;
}