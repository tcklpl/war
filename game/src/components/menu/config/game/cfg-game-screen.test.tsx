import { ConfigGame } from ':engine/config/cfg-game';
import { useConfig } from ':hooks/use-config';
import { render } from '@testing-library/react';
import CfgGameScreen from './cfg-game-screen';

vi.mock(':hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
	mockUseConfig.mockReturnValue({
		...(await vi.importActual(':hooks/use_config')),
		gameConfig: new ConfigGame(),
	});

	const mockGlobalGame = {
		engine: {
			managers: {
				asset: {
					getCachedAssetCount: () => 1,
				},
			},
		},
	};
	vi.stubGlobal('game', mockGlobalGame);

	render(<CfgGameScreen />);
});
