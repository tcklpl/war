
export interface RoundState {
    /**
     * Round count. A Round is a collection of turns from all players.
     */
    round: number;
    /**
     * Round turn index. The index of the player that is currently playing.
     */
    turn: number;
    /**
     * Timeout secs before the current turn is skipped.
     */
    timeout: number;
}