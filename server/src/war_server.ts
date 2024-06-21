import chalk from 'chalk';
import { ConfigManager } from './config/config_manager';
import { CryptManager } from './crypt/crypt_manager';
import { ExpressServer } from './express/express_server';
import { GameServer } from './game/game_server';
import { SocketServer } from './socket/socket_server';
import { WarServerBanner } from './banner';
import { CommandProcessor } from './commands/command_processor';
import { CfgServer } from './config/default/cfg_server';
import { Logger } from './log/logger';
import { PersistenceManager } from './persistence/persistence_manager';

export class WarServer {
    private _log = new Logger('War Server');
    private _banner = new WarServerBanner();

    private _configManager = new ConfigManager(this._log.createChildContext('Config Manager'));
    private _cryptManager = new CryptManager(this._configManager, this._log.createChildContext('Crypt Manager'));
    private _persistenceManager = new PersistenceManager(this._log.createChildContext('Persistence Manager'));

    private _gameServer = new GameServer(
        this._configManager,
        this._cryptManager,
        this._log.createChildContext('Game Server'),
    );
    private _expressServer = new ExpressServer(
        this._configManager,
        this._cryptManager,
        this._gameServer,
        this._log.createChildContext('Express Server'),
    );
    private _socketServer = new SocketServer(
        this._configManager,
        this._cryptManager,
        this._gameServer,
        this._log.createChildContext('Socket Server'),
    );

    private _commandProcessor = new CommandProcessor(this, this._log.createChildContext('Command Processor'));

    async initialize() {
        console.log(this._banner.greetings);

        const startTime = Date.now();
        this._log.info(`Initializing server`);

        await this._configManager.loadConfig();
        await this._cryptManager.initialize();
        await this._persistenceManager.initialize();

        await this._gameServer.initialize();
        await this._expressServer.initialize();
        await this._socketServer.initialize();

        const loadTime = Date.now() - startTime;
        this._log.info(`Server started ${chalk.green('successfully')} in ${loadTime}ms`);

        const logLvl = Logger.parseLogLevelFromString(this._configManager.getConfig(CfgServer).log_level);
        Logger.setLogLevel(logLvl);

        this._commandProcessor.parseCommands();
    }

    async stop() {
        this._log.info(`Stopping server...`);
        this._commandProcessor.stop();
        await this._gameServer.stop();
        await this._expressServer.stop();
        await this._socketServer.stop();
        this._log.info(`Server closed`);
        process.exit(0);
    }

    get configManager() {
        return this._configManager;
    }

    get gameServer() {
        return this._gameServer;
    }

    get commandProcessor() {
        return this._commandProcessor;
    }
}
