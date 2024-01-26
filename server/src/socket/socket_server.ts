import { Server } from "socket.io";
import { ConfigManager } from "../config/config_manager";
import { CfgServer } from "../config/default/cfg_server";
import svlog from "../utils/logging_utils";
import { CryptManager } from "../crypt/crypt_manager";
import { GameServer } from "../game/game_server";
import { Player } from "../game/player/player";
import { GameSocketServer } from "../@types/server_socket";
import { socketRoutes } from "./routes/socket_routes";

export class SocketServer {

    constructor (private _configManager: ConfigManager, private _cryptManager: CryptManager, private _gameServer: GameServer) {}

    private _io!: GameSocketServer;

    private startServer() {
        this._io = new Server({
            cors: {
                origin: "*"
            }
        });
        const serverConfig = this._configManager.getConfig(CfgServer);

        this.registerConnectionEvents();
        
        this._io.listen(serverConfig.socket_port);
        svlog.log(`Socket Server listening on ${serverConfig.host}:${serverConfig.socket_port}`);
    }

    private registerConnectionEvents() {

        // Authorization: user needs a signed token before starting a connection
        this._io.use((socket, next) => {
            const token: string = socket.handshake.auth.token;
            if (!this._cryptManager.validateToken(token)) return next(new Error("Not Authorized"));
            next();
        });

        this._io.on("connection", (socket) => {
            const token: string = socket.handshake.auth.token;
            const authTokenBody = this._cryptManager.extractPayload(token);
            const player = new Player(authTokenBody, socket);
            this._gameServer.playerManager.loginPlayer(player);

            // register all socket routes
            socketRoutes(socket, this._gameServer, player);

            socket.on("disconnect", () => {
                this._gameServer.playerManager.logoffPlayer(player);
            });
            
        });


    }

    async initialize() {
        this.startServer();
    }

}