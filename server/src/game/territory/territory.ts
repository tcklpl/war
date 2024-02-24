import { ContinentCode, TerritoryCode } from "../../../../protocol";

export class Territory {

    constructor(
        public readonly code: TerritoryCode,
        public readonly continentCode: ContinentCode
    ) {}

}