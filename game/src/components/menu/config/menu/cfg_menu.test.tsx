import { render } from '@testing-library/react';
import CfgMenu from './cfg_menu';
import { MemoryRouter } from 'react-router-dom';
import { useConfig } from '../../../../hooks/use_config';

jest.mock('../../../../hooks/use_config');
const mockUseConfig = jest.mocked(useConfig);

it('renders', () => {
    mockUseConfig.mockReturnValue({
        ...jest.requireActual('../../../../hooks/use_config'),
        async saveConfig() {},
    });

    render(
        <MemoryRouter>
            <CfgMenu />
        </MemoryRouter>,
    );
});
