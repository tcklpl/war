import '@testing-library/jest-dom';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next');

global.beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({ t: (key: string) => key });
});
