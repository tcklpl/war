import type {
	GamePauseReason,
	GameStage,
	InitialGameStatePacket,
	LobbyListState,
	LobbyStage,
	LobbyState,
	PrematureGameEndReason,
	RoundState,
	TerritoryCode,
	TurnAllowedActions,
} from './data';
import type { GameError } from './data/ingame/game-error';

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
	gPlayerReconnected: (player: string, allPlayersOnline: boolean) => void;
	gPrematureGameEnd: (reason: PrematureGameEndReason) => void;
	gGameSaved: () => void;
	gGamePaused: (reason: GamePauseReason) => void;
	gGameResumed: () => void;
}
