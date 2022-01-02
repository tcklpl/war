import { Vec3 } from "../data_formats/vec/vec3";

export interface IMovable {

    translate(offset: Vec3): void;
    setTranslation(to: Vec3): void;

    rotate(offset: Vec3): void;
    setRotation(to: Vec3): void;

    scale(magnitude: Vec3): void;
    setScale(to: Vec3): void;
};