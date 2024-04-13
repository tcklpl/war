import { LobbyState, LobbyPlayerState, GameConfig, GameParty, GameStage } from "../../../../protocol";
import { Logger } from "../../log/logger";
import { ServerPacketInitialGameState } from "../../socket/packet/game/initial_game_state";
import { ServerPacketChatMessage } from "../../socket/packet/lobby/chat_message";
import { ServerPacketGameStartCancelled } from "../../socket/packet/lobby/game_start_cancelled";
import { ServerPacketStartingGame } from "../../socket/packet/lobby/starting_game";
import { ServerPacketUpdateLobbyState } from "../../socket/packet/lobby/update_lobby_state";
import { Game } from "../ingame/game";
import { PartyAnarchism } from "../party/anarchism";
import { PartyCapitalism } from "../party/capitalism";
import { PartyFeudalism } from "../party/feudalism";
import { PartyNotSet } from "../party/not_set";
import { Party } from "../party/party";
import { PartySocialism } from "../party/socialism";
import { Player } from "../player/player";

export class Lobby {

    private _status: GameStage = 'in lobby';
    private _players: Player[] = [];
    joinable = true;
    private _parties: Party[] = [
        new PartyAnarchism(),
        new PartyFeudalism(),
        new PartySocialism(),
        new PartyCapitalism()
    ];

    private readonly startGameCooldown = 10; // seconds
    private _startGameTask?: NodeJS.Timeout;
    private _game?: Game;

    constructor(private _owner: Player, private _name: string, private _gameConfig: GameConfig, private _log: Logger) {
        this._players.push(this.owner);
    }

    addPlayer(p: Player) {
        if (!this._players.find(x => x === p)) {
            this._players.push(p);
            new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
            this._log.info(`Player ${p.username} has joined the lobby`);
        }
    }

    removePlayer(p: Player) {
        this._players = this._players.filter(x => x !== p);
        if (p === this._owner && this._players.length > 0) {
            this._owner = this._players[0];
        }
        if (p.party) {
            p.party.player = undefined;
            p.party = new PartyNotSet();
        }
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        this._log.info(`Player ${p.username} has left the lobby`);
        // will cancel any ongoing game start. This function will do nothing if the game isn't starting
        this.cancelGameStart();
    }

    removeAllPlayers() {
        this._players.forEach(p => p.leaveCurrentLobby());
    }

    broadcastChatMessage(sender: Player, msg: string) {
        new ServerPacketChatMessage(sender, msg).dispatch(...this._players);
    }

    changeOwnership(newOwner: Player) {

        if (this._status !== 'in lobby') return;
        if (!this._players.find(p => p === newOwner)) return;

        this._log.info(`Lobby ownership changed from ${this._owner.username} to ${newOwner.username}`);
        this._owner = newOwner;
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
    }

    replaceLobbyState(state: LobbyState) {

        if (this._status !== 'in lobby') return;

        this.joinable = state.joinable;
        if (!this._gameConfig.is_immutable) {
            this._gameConfig = state.game_config;
        }
    }

    setPlayerParty(player: Player, protocolParty: GameParty) {

        if (this._status !== 'in lobby') return;

        const party = this._parties.find(p => p.protocolValue === protocolParty);
        if (!party || !(player.party instanceof PartyNotSet) || party.player) return;
        player.party = party;
        party.player = player;
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        this._log.debug(`${player.username} selected the party ${protocolParty}`);
    }

    deselectPlayerParty(player: Player) {

        if (this._status !== 'in lobby') return;

        player.party = new PartyNotSet();
        this._parties.filter(p => p.player === player).forEach(p => p.player = undefined);
        new ServerPacketUpdateLobbyState(this).dispatch(...this.players);
        this._log.debug(`${player.username} deselected their current party`);
    }

    startGame() {
        // validate if all players have selected a party
        if (this._players.some(p => p.party instanceof PartyNotSet)) return false;
        new ServerPacketStartingGame(this.startGameCooldown).dispatch(...this._players);
        this._status = 'starting';

        // set a timeout to actually start the game
        this._startGameTask = setTimeout(() => {
            this._game = new Game(this, (s) => this._status = s, this._log.createChildContext("In Game"));
            new ServerPacketInitialGameState(this._game.initialGameStatePacket).dispatch(...this._players);
            this._game.setupGame();
        }, this.startGameCooldown * 1000);

        this._log.info(`Starting game`);
        return true;
    }

    cancelGameStart() {
        if (this._startGameTask) {
            clearTimeout(this._startGameTask);
            this._status = 'in lobby';
            new ServerPacketGameStartCancelled().dispatch(...this._players);
            this._log.info(`Game start cancelled`);
        }
    }

    cleanup() {
        this.cancelGameStart();
        this.removeAllPlayers();
    }

    get name() {
        return this._name;
    }

    get players() {
        return this._players;
    }

    get owner() {
        return this._owner;
    }

    get gameConfig() {
        return this._gameConfig;
    }

    get game() {
        return this._game;
    }

    get status() {
        return this._status;
    }

    get asProtocolLobbyState(): LobbyState {
        return {
            name: this._name,
            joinable: this.joinable,
            players: this._players.map(p => <LobbyPlayerState> {
                name: p.username,
                is_lobby_owner: p === this._owner,
                party: p.party?.protocolValue
            }),
            game_config: this._gameConfig,
            selectable_parties: this._parties.filter(p => !p.player).map(p => p.protocolValue)
        }
    }
}