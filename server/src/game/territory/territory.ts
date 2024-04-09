import { ContinentCode, TerritoryCode } from "../../../../protocol";
import { Node } from "../../graph/node";
import { Party } from "../party/party";
import { Troop } from "../troop/troop";

export class Territory {

    private _party?: Party;
    node!: Node<Territory>;
    troops: Troop[] = [];

    constructor(
        public readonly code: TerritoryCode,
        public readonly continentCode: ContinentCode
    ) {}

    setParty(p: Party | undefined) {
        if (!!p && p !== this._party) {
            this._party = p;
            this._party?.addTerritory(this);
        } else if (!p) {
            this._party?.removeTerritory(this);
            this._party = p;
        }
    }

    get party() {
        return this._party;
    }

}