import { ConfigDisplay } from ':engine/config/cfg_display';
import { useConfig } from ':hooks/use_config';
import { render } from '@testing-library/react';
import CfgDisplayScreen from './cfg_display_screen';

vi.mock(':hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
    mockUseConfig.mockReturnValue({
        ...(await vi.importActual(':hooks/use_config')),
        displayConfig: new ConfigDisplay(),
    });

    render(<CfgDisplayScreen />);
});
