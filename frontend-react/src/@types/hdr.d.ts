
declare module 'hdr' {

    export interface HDRFile {
        width: number;
        height: number;
        exposure: number;
        gamma: number;
        format: string;
        f32Data: Float32Array;
    }

}