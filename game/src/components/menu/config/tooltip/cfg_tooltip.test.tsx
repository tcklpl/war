import { render, screen } from '@testing-library/react';
import CfgTooltip from './cfg_tooltip';

it('renders', () => {
    render(<CfgTooltip />);
});

it('render with info', () => {
    const title = 'Test title';
    const content = 'Test description';
    render(
        <CfgTooltip
            currentTooltip={{
                title,
                content,
            }}
        />,
    );
    expect(screen.getByText(title));
    expect(screen.getByText(content));
});
