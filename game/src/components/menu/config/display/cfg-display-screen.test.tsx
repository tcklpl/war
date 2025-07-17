import { ConfigDisplay } from ':engine/config/cfg-display';
import { useConfig } from ':hooks/use-config';
import { render } from '@testing-library/react';
import CfgDisplayScreen from './cfg-display-screen';

vi.mock(':hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
	mockUseConfig.mockReturnValue({
		...(await vi.importActual(':hooks/use_config')),
		displayConfig: new ConfigDisplay(),
	});

	render(<CfgDisplayScreen />);
});
