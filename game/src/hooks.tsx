import { FC } from 'react';
import { AlertProvider } from './hooks/use_alert';
import { ConfirmationProvider } from './hooks/use_confirmation';
import { GameProvider } from './hooks/use_game';
import { ConfigProvider } from './hooks/use_config';
import { GameSessionProvider } from './hooks/use_game_session';
import { CrashProvider } from './hooks/use_crash';

const Hooks: FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <AlertProvider>
            <ConfirmationProvider>
                <GameProvider>
                    <ConfigProvider>
                        <GameSessionProvider>
                            <CrashProvider>{children}</CrashProvider>
                        </GameSessionProvider>
                    </ConfigProvider>
                </GameProvider>
            </ConfirmationProvider>
        </AlertProvider>
    );
};

export default Hooks;
