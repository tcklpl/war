import { ConfigManager } from "../../config/config_manager";
import { CfgServer } from "../../config/default/cfg_server";
import { OverLimitError } from "../../exceptions/over_limit_error";
import { Player } from "../player/player";
import { GameRoom } from "./game_room";

export class GameRoomManager {

    private _rooms: GameRoom[] = [];
    private _maxGameRooms: number;

    constructor(private _configManager: ConfigManager) {
        this._maxGameRooms = this._configManager.getConfig(CfgServer).max_game_rooms;
    }

    createRoom(owner: Player, name: string) {
        if (this._rooms.length >= this._maxGameRooms) throw new OverLimitError();
        const room = new GameRoom(owner, name);
        this._rooms.push(room);
        return room;
    }

    get rooms() {
        return this._rooms;
    }

}