import { render } from '@testing-library/react';
import { useConfig } from '../../../../hooks/use_config';
import { useGame } from '../../../../hooks/use_game';
import { useGameSession } from '../../../../hooks/use_game_session';
import HUDPerformance from './hud_performance';
import { ConfigDisplay } from '../../../../engine/config/cfg_display';
import { WarGame } from '../../../../game/war_game';
import { WarGameSession } from '../../../../game/lobby/war_game_session';

jest.mock('../../../../hooks/use_game');
jest.mock('../../../../hooks/use_game_session');
jest.mock('../../../../hooks/use_config');

describe('Performance HUD', () => {
    it(`renders nothing if there's no game instance`, () => {
        const mockUseGame = jest.mocked(useGame);
        const mockUseGameSession = jest.mocked(useGameSession);
        const mockUseConfig = jest.mocked(useConfig);

        mockUseGame.mockReturnValue({
            setGameInstance() {},
            gameInstance: undefined,
        });

        mockUseGameSession.mockReturnValue({
            ...jest.requireActual('../../../../hooks/use_game_session'),
            currentGameSession: undefined,
        });

        mockUseConfig.mockReturnValue({
            ...jest.requireActual('../../../../hooks/use_config'),
            displayConfig: new ConfigDisplay(),
        });

        const { container } = render(<HUDPerformance />);
        expect(container).toBeEmptyDOMElement();
    });

    it(`renders performance hud`, () => {
        const mockUseGame = jest.mocked(useGame);
        const mockUseGameSession = jest.mocked(useGameSession);
        const mockUseConfig = jest.mocked(useConfig);

        const mockRegisterFrameListener = jest.fn();

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
            ...jest.requireActual('../../../../hooks/use_game_session'),
            currentGameSession: {} as WarGameSession,
        });

        mockUseConfig.mockReturnValue({
            ...jest.requireActual('../../../../hooks/use_config'),
            displayConfig,
        });

        const { container } = render(<HUDPerformance />);

        expect(container).not.toBeEmptyDOMElement();
        expect(mockRegisterFrameListener).toHaveBeenCalled();
    });
});
