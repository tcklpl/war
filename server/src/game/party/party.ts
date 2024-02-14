import { GameParty } from "../../../../protocol";
import { Player } from "../player/player";

export abstract class Party {

    player?: Player;

    constructor(
        readonly protocolValue: GameParty
    ) {}

}