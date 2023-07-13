/**
 * This file exists to make it possible to import .vs and .fs files as modules like:
 *  import vertexShader from "./pbr.vs"
 *  import fragmentShader from "./pbr.fs"
 */
declare module '*.vs' {
    const content: string;
    export default content;
}
declare module '*.fs' {
    const content: string;
    export default content;
}
declare module '*.wgsl' {
    const content: string;
    export default content;
}