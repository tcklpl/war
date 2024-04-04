import { Party } from "../game/party/party";
import { Player } from "../game/player/player";

export type PlayerWithParty = Player & {party: Party};