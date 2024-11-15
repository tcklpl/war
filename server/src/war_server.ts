import { c } from 'tasai';
import { WarServerBanner } from './banner';
import { CommandProcessor } from './commands/command_processor';
import { ConfigManager } from './config/config_manager';
import { CfgServer } from './config/default/cfg_server';
import { CryptManager } from './crypt/crypt_manager';
import { ExpressServer } from './express/express_server';
import { GameServer } from './game/game_server';
import { Logger } from './log/logger';
import { PersistenceManager } from './persistence/persistence_manager';
import { SocketServer } from './socket/socket_server';

export class WarServer {
    private readonly _log = new Logger('War Server');
    private readonly _banner = new WarServerBanner();

    private readonly _configManager = new ConfigManager(this._log.createChildContext('Config Manager'));
    private readonly _cryptManager = new CryptManager(
        this._configManager,
        this._log.createChildContext('Crypt Manager'),
    );
    private readonly _persistenceManager = new PersistenceManager(this._log.createChildContext('Persistence Manager'));

    private readonly _gameServer = new GameServer(
        this._configManager,
        this._cryptManager,
        this._persistenceManager,
        this._log.createChildContext('Game Server'),
    );
    private readonly _expressServer = new ExpressServer(
        this._configManager,
        this._cryptManager,
        this._gameServer,
        this._log.createChildContext('Express Server'),
    );
    private readonly _socketServer = new SocketServer(
        this._configManager,
        this._cryptManager,
        this._gameServer,
        this._log.createChildContext('Socket Server'),
    );

    private readonly _commandProcessor = new CommandProcessor(this, this._log.createChildContext('Command Processor'));

    async initialize() {
        console.log(this._banner.greetings);

        const startTime = Date.now();
        this._log.info(`Initializing server`);

        await this._configManager.loadConfig();
        const logLvl = Logger.parseLogLevelFromString(this._configManager.getConfig(CfgServer).log_level);
        Logger.setLogLevel(logLvl);

        await this._cryptManager.initialize();
        await this._persistenceManager.initialize();

        await this._gameServer.initialize();
        await this._expressServer.initialize();
        await this._socketServer.initialize();

        const loadTime = Date.now() - startTime;
        this._log.info(`Server started ${c.brightGreen('successfully')} in ${loadTime}ms`);

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
