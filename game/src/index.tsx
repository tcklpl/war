import ReactDOM from 'react-dom/client';
import './i18next';
import App from './App';
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
