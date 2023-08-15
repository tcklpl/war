
declare module 'typeUtils' {
    type Constructor<T = any> = new (...args: any[]) => T;
}