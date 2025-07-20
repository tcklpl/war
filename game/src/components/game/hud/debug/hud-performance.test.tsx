import { ConfigDisplay } from ':engine/config/cfg-display';
import type { WarGameSession } from ':game/lobby/war-game-session';
import type { WarGame } from ':game/war-game';
import { useConfig } from ':hooks/use-config';
import { useGame } from ':hooks/use-game';
import { useGameSession } from ':hooks/use-game-session';
import { render } from '@testing-library/react';
import HUDPerformance from './hud-performance';

vi.mock(':hooks/use-game');
vi.mock(':hooks/use-game_session');
vi.mock(':hooks/use-config');

describe('Performance HUD', () => {
	it(`renders nothing if there's no game instance`, async () => {
		const mockUseGame = vi.mocked(useGame);
		const mockUseGameSession = vi.mocked(useGameSession);
		const mockUseConfig = vi.mocked(useConfig);

		mockUseGame.mockReturnValue({
			setGameInstance() {},
			gameInstance: undefined,
		});

		mockUseGameSession.mockReturnValue({
			...(await vi.importActual(':hooks/use-game-session')),
			currentGameSession: undefined,
		});

		mockUseConfig.mockReturnValue({
			...(await vi.importActual(':hooks/use-config')),
			displayConfig: new ConfigDisplay(),
		});

		const { container } = render(<HUDPerformance />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders performance hud', async () => {
		const mockUseGame = vi.mocked(useGame);
		const mockUseGameSession = vi.mocked(useGameSession);
		const mockUseConfig = vi.mocked(useConfig);

		const mockRegisterFrameListener = vi.fn();

		const displayConfig = new ConfigDisplay();
		displayConfig.showPerformance = true;

		mockUseGame.mockReturnValue({
			setGameInstance() {},
			gameInstance: {
				engine: {
					registerFrameListener: mockRegisterFrameListener,
				},
			} as unknown as WarGame,
		});

		mockUseGameSession.mockReturnValue({
			...(await vi.importActual(':hooks/use-game-session')),
			currentGameSession: {} as WarGameSession,
		});

		mockUseConfig.mockReturnValue({
			...(await vi.importActual(':hooks/use-config')),
			displayConfig,
		});

		const { container } = render(<HUDPerformance />);

		expect(container).not.toBeEmptyDOMElement();
		expect(mockRegisterFrameListener).toHaveBeenCalled();
	});
});
