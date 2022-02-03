import { Vec3 } from "../data_formats/vec/vec3";

export interface ILightCreationInfo {
    
    name: string;
    enabled: boolean;
    color: Vec3;
    intensity: number;

    position: Vec3;
    target: Vec3;
    up: Vec3;

    near: number;
    far: number;

    castsShadows: boolean;
    shadowMapResolution: number;
    
}