/**
 * This file exists to make it possible to import .wgsl files as modules like:
 *  import shaderSource from "./pbr.wgsl"
 */
declare module '*.wgsl' {
    const content: string;
    export default content;
}
