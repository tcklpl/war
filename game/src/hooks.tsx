import type { FC } from 'react';
import { ConfigProvider } from './hooks/use-config';
import { ConfirmationProvider } from './hooks/use-confirmation';
import { CrashProvider } from './hooks/use-crash';
import { GameProvider } from './hooks/use-game';
import { GameSessionProvider } from './hooks/use-game-session';

const Hooks: FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<ConfirmationProvider>
			<GameProvider>
				<ConfigProvider>
					<GameSessionProvider>
						<CrashProvider>{children}</CrashProvider>
					</GameSessionProvider>
				</ConfigProvider>
			</GameProvider>
		</ConfirmationProvider>
	);
};

export default Hooks;
