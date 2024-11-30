import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainMenu from './main_menu';

it('renders', () => {
    render(
        <MemoryRouter>
            <MainMenu />
        </MemoryRouter>,
    );
});
