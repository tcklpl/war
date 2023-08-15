import { Manager } from "../../manager";
import { Material } from "./material";

export class MaterialManager extends Manager<Material> {

    private _materialId = 0;

    private _activeMaterial?: Material;

    requestMaterialId() {
        return this._materialId++;
    }

    freeMaterials() {
        this.all.forEach(m => m.free());
    }

}