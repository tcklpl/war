import { type TerritoryCode } from '../../../../protocol';
import { Logger } from '../../log/logger';
import { ServerPacketInitialTerritorySelectionAllowedTerritories } from '../../socket/packet/game/ini_territory_selection_allowed_territories';
import { ServerPacketInitialTerritoryAssignment } from '../../socket/packet/game/ini_territory_selection_assignment';
import { ServerPacketInitialTerritorySelectionTurn } from '../../socket/packet/game/ini_territory_selection_turn';
import { GamePlayer } from '../player/game_player';
import { Game } from './game';

export class InitialTerritorySelectionManager {
    onSelectionFinished?: () => void;

    private _freeUseTerritoryPool: TerritoryCode[] = [
        'alaska',
        'california',
        'cuba',
        'greenland',
        'labrador',
        'mackenzie',
        'mexico',
        'new_york',
        'ottawa',
        'vancouver',
        'argentina',
        'brazil',
        'chile',
        'venezuela',
        'germany',
        'france',
        'england',
        'iceland',
        'moscow',
        'sweden',
        'australia',
        'sumatra',
        'borneo',
        'n_guinea',
        'egypt',
        'algeria',
        'sudan',
        'congo',
        's_africa',
        'madagascar',
        'poland',
        'aral',
        'india',
        'ornsk',
        'middle_east',
        'vietnam',
        'china',
        'mongolia',
        'dudinka',
        'tchita',
        'siberia',
        'vladvostok',
        'japan',
    ];

    private readonly _timeoutDurationSeconds = 60;
    private _curPlayerIndex = 0;
    private _curSelectionTimeout?: Timer;
    private _curAllowedTerritories: TerritoryCode[] = [];
    private _finished = false;
    private _paused = false;

    constructor(
        private readonly _game: Game,
        private readonly _log: Logger,
    ) {}

    private removeFromTerritoryPool(code: TerritoryCode) {
        this._freeUseTerritoryPool = this._freeUseTerritoryPool.filter(t => t !== code);
    }

    private setupTerritoryPool() {
        this._game.players.forEach(p => {
            // If the player's party has a fixed starting territory
            if (p.party.startingTerritories !== 'any') {
                // And if it's only ONE possible starting point
                if (p.party.startingTerritories.length === 1) {
                    this.removeFromTerritoryPool(p.party.startingTerritories[0]);
                }
            }
        });
    }

    private selectPlayerTerritory() {
        new ServerPacketInitialTerritorySelectionTurn(
            this.currentPlayer.username,
            this._timeoutDurationSeconds,
        ).dispatch(...this._game.players);

        let availableStarts = this.currentPlayer.party.startingTerritories;
        if (availableStarts === 'any') availableStarts = this._freeUseTerritoryPool;
        this._curAllowedTerritories = availableStarts;
        new ServerPacketInitialTerritorySelectionAllowedTerritories(availableStarts).dispatch(this.currentPlayer);

        this._curSelectionTimeout = setTimeout(() => this.onSelectionTimeout(), this._timeoutDurationSeconds * 1000);
        this._log.debug(`player ${this.currentPlayer.username} is now selecting a starting territory`);
    }

    startPlayerTerritorySelection() {
        this._log.debug(`Starting territory selection, territory pool with size ${this._freeUseTerritoryPool.length}`);
        this.setupTerritoryPool();
        this._log.debug(`Filtered territory pool, new size: ${this._freeUseTerritoryPool.length}`);
        this.selectPlayerTerritory();
    }

    onTerritorySelection(player: GamePlayer, territory: TerritoryCode) {
        if (!this._curAllowedTerritories.find(t => t === territory)) {
            this._log.warn(`player ${player.username} is trying to select a territory that isn't allowed`);
            return;
        }
        if (player !== this.currentPlayer) {
            this._log.warn(`player ${player.username} is trying to pick a starting territory on another players turn`);
            return;
        }
        if (this._paused) {
            this._log.warn(
                `player ${player.username} is trying to pick a starting territory while the selection is paused`,
            );
            return;
        }

        clearTimeout(this._curSelectionTimeout);
        this._curSelectionTimeout = undefined;

        this._log.debug(`player ${player.username} selected the starting territory ${territory}`);
        new ServerPacketInitialTerritoryAssignment(this.currentPlayer.username, territory, 'selected').dispatch(
            ...this._game.players,
        );
        this.finishUpCurrentSelection(territory);
    }

    private onSelectionTimeout() {
        this._curSelectionTimeout = undefined;
        const selected = this._curAllowedTerritories[Math.floor(Math.random() * this._curAllowedTerritories.length)];
        new ServerPacketInitialTerritoryAssignment(this.currentPlayer.username, selected, 'timeout').dispatch(
            ...this._game.players,
        );
        this._log.debug(
            `player ${this.currentPlayer.username} timed out the territory selection, ${selected} was picked at random`,
        );
        this.finishUpCurrentSelection(selected);
    }

    private finishUpCurrentSelection(selected: TerritoryCode) {
        this.removeFromTerritoryPool(selected);

        // If it's the last player
        if (this._curPlayerIndex >= this.playersToSelect.length - 1) {
            this._log.debug(`Territory selection has finished`);
            this._finished = true;
            this.onSelectionFinished?.();
        } else {
            this._log.debug(`Selecting territory for next player`);
            this.selectForNextPlayer();
        }
    }

    private selectForNextPlayer() {
        this._curPlayerIndex++;
        this.selectPlayerTerritory();
    }

    pauseSelection() {
        if (this._finished) {
            this._log.trace('Trying to pause a territory selection that has already ended');
            return;
        }
        if (this._paused) {
            this._log.trace('Initial territory selection is already paused');
            return;
        }
        this._paused = true;
        clearTimeout(this._curSelectionTimeout);
        this._curSelectionTimeout = undefined;
    }

    resumeSelection() {
        if (this._finished) {
            this._log.trace('Trying to resume a territory selection that has already ended');
            return;
        }
        if (!this._paused) {
            this._log.trace(`Trying to resume a territory selection that wasn't paused`);
            return;
        }
        this._paused = false;
        this.selectPlayerTerritory();
    }

    private get playersToSelect() {
        return this._game.players.filter(p => !p.discarded);
    }

    private get currentPlayer() {
        return this.playersToSelect[this._curPlayerIndex];
    }

    get hasFinished() {
        return this._finished;
    }

    get isPaused() {
        return this._paused;
    }
}
