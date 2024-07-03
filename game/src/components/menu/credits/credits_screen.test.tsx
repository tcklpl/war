import { render } from '@testing-library/react';
import CreditsScreen from './credits_screen';
import { MemoryRouter } from 'react-router-dom';

it('renders', () => {
    render(
        <MemoryRouter>
            <CreditsScreen />
        </MemoryRouter>,
    );
});
