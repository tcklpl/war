import { render } from '@testing-library/react';
import { ConfigDisplay } from '../../../../engine/config/cfg_display';
import { WarGameSession } from '../../../../game/lobby/war_game_session';
import { WarGame } from '../../../../game/war_game';
import { useConfig } from '../../../../hooks/use_config';
import { useGame } from '../../../../hooks/use_game';
import { useGameSession } from '../../../../hooks/use_game_session';
import HUDPerformance from './hud_performance';

vi.mock('../../../../hooks/use_game');
vi.mock('../../../../hooks/use_game_session');
vi.mock('../../../../hooks/use_config');

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
            ...(await vi.importActual('../../../../hooks/use_game_session')),
            currentGameSession: undefined,
        });

        mockUseConfig.mockReturnValue({
            ...(await vi.importActual('../../../../hooks/use_config')),
            displayConfig: new ConfigDisplay(),
        });

        const { container } = render(<HUDPerformance />);
        expect(container).toBeEmptyDOMElement();
    });

    it(`renders performance hud`, async () => {
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
            ...(await vi.importActual('../../../../hooks/use_game_session')),
            currentGameSession: {} as WarGameSession,
        });

        mockUseConfig.mockReturnValue({
            ...(await vi.importActual('../../../../hooks/use_config')),
            displayConfig,
        });

        const { container } = render(<HUDPerformance />);

        expect(container).not.toBeEmptyDOMElement();
        expect(mockRegisterFrameListener).toHaveBeenCalled();
    });
});
