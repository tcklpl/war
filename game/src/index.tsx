import ReactDOM from 'react-dom/client';
import './i18next';
import App from './App';
import { GameProvider } from './hooks/use_game';
import { ConfigProvider } from './hooks/use_config';
import { CrashProvider } from './hooks/use_crash';
import { AlertProvider } from './hooks/use_alert';
import { GameSessionProvider } from './hooks/use_game_session';
import { ConfirmationProvider } from './hooks/use_confirmation';

const Hooks: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <Hooks>
        <App />
    </Hooks>,
);
