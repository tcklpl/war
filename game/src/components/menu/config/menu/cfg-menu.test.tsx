import { useConfig } from ':hooks/use-config';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CfgMenu from './cfg-menu';

vi.mock(':hooks/use-config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
	mockUseConfig.mockReturnValue({
		...(await vi.importActual(':hooks/use-config')),
		async saveConfig() {},
	});

	render(
		<MemoryRouter>
			<CfgMenu />
		</MemoryRouter>,
	);
});
