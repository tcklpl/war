import { ConfigGame } from ':engine/config/cfg_game';
import { useConfig } from ':hooks/use_config';
import { render } from '@testing-library/react';
import CfgGameScreen from './cfg_game_screen';

vi.mock(':hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
    mockUseConfig.mockReturnValue({
        ...(await vi.importActual(':hooks/use_config')),
        gameConfig: new ConfigGame(),
    });

    render(<CfgGameScreen />);
});
