import { Constructor } from "typeUtils";
import { Vec4 } from "../vec/vec4";

interface IIdentifiable {
    get id(): number;
}

export function identifiable<T extends Constructor>(base: T): Constructor<IIdentifiable> & T {
    return class extends base {

        private _id: number;
        private _idVec4: Vec4;

        constructor(...args: any[]) {
            super(...args);
            this._id = game.engine.idPool.requestID();
            this._idVec4 = Vec4.fromId(this._id);
        }

        get id() {
            return this._id;
        }

        get idVec4() {
            return this._idVec4;
        }
    }
}
