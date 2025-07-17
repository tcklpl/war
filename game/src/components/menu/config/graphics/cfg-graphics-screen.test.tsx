import { ConfigGraphics } from ':engine/config/cfg-graphics';
import { useConfig } from ':hooks/use-config';
import { render } from '@testing-library/react';
import CfgGraphicsScreen from './cfg-graphics-screen';

vi.mock(':hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
	mockUseConfig.mockReturnValue({
		...(await vi.importActual(':hooks/use_config')),
		graphicsConfig: new ConfigGraphics(),
	});

	render(<CfgGraphicsScreen />);
});
