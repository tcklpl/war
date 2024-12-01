import { ConfigGraphics } from ':engine/config/cfg_graphics';
import { useConfig } from ':hooks/use_config';
import { render } from '@testing-library/react';
import CfgGraphicsScreen from './cfg_graphics_screen';

vi.mock(':hooks/use_config');
const mockUseConfig = vi.mocked(useConfig);

it('renders', async () => {
    mockUseConfig.mockReturnValue({
        ...(await vi.importActual(':hooks/use_config')),
        graphicsConfig: new ConfigGraphics(),
    });

    render(<CfgGraphicsScreen />);
});
