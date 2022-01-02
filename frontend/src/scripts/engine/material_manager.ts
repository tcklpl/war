import { Material } from "./material";

export class MaterialManager {

    private materials: Material[] = [];

    registerMaterial(mat: Material) {
        this.materials.push(mat);
    }

    getByName(name: string) {
        return this.materials.find(x => x.name == name);
    }

    public get allMaterials() {
        return this.materials;
    }
}