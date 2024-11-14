import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useConfig } from '../../../../hooks/use_config';
import CfgScreen from './cfg_screen';

vi.mock('../../../../hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
    mockUseConfig.mockReturnValue({
        ...(await vi.importActual('../../../../hooks/use_config')),
        async saveConfig() {},
    });

    render(
        <MemoryRouter>
            <CfgScreen />
        </MemoryRouter>,
    );
});
