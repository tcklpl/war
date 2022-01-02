import { Vec3 } from "../data_formats/vec/vec3";
import { Positionable } from "./positionable";

export class BoxPositionable extends Positionable {

    private movableBoxVertices: Vec3[];

    constructor(movableBoxVertices: Vec3[]) {
        super();
        this.movableBoxVertices = movableBoxVertices;
    }

    
}