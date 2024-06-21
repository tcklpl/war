import {
    LobbyState,
    LobbyListState,
    InitialGameStatePacket,
    RoundState,
    TurnAllowedActions,
    GameStage,
    TerritoryCode,
    LobbyStage,
} from './data';
import { GameError } from './data/ingame/game_error';

export type LobbyCreationFailReason = 'full' | 'unavailable name' | 'already owner' | 'other';

export interface ServerToClientPackets {
    /*
        ----------------------------------------------------------
        Lobby List Packets
        ----------------------------------------------------------
    */
    lobbies: (lobbies: LobbyListState) => void;
    failedToCreateLobby: (reason: LobbyCreationFailReason) => void;
    failedToJoinLobby: () => void;

    /*
        ----------------------------------------------------------
        Lobby Packets
        ----------------------------------------------------------
    */
    joinedLobby: (lobby: LobbyState) => void;
    leftLobby: (kicked?: boolean) => void;
    chatMessage: (sender: string, msg: string) => void;
    updateLobbyState: (lobby: LobbyState) => void;
    lStartingGame: (countdown: number) => void;
    lGameStartCancelled: () => void;
    lUpdateLobbyStage: (stage: LobbyStage) => void;

    /*
        ----------------------------------------------------------
        Game Packets
        ----------------------------------------------------------
    */
    // Global game state update
    gInitialGameState: (state: InitialGameStatePacket) => void;
    gUpdateGameStage: (stage: GameStage) => void;
    gGameSessionConnectionToken: (token: string) => void;

    // Territory selection
    gInitialTerritorySelectionTurn: (currentPlayer: string, timeout: number) => void;
    gInitialTerritorySelectionAllowedTerritories: (allowed: TerritoryCode[]) => void;
    gInitialTerritorySelectionAssignment: (
        player: string,
        territory: TerritoryCode,
        reason: 'selected' | 'timeout',
    ) => void;

    gUpdateRoundState: (state: RoundState) => void;
    gTurnAllowedActions: (allowed: TurnAllowedActions) => void;
    gGameError: (error: GameError) => void;

    gPlayerDisconnected: (player: string) => void;
    gPlayerRejoined: (player: string, allPlayersOnline: boolean) => void;
}
