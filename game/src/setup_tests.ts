import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { afterEach, beforeEach, expect, Mock } from 'vitest';

expect.extend(matchers);

vi.mock('react-i18next');

beforeEach(() => {
    (useTranslation as Mock).mockReturnValue({ t: (key: string) => key });
});

afterEach(() => {
    cleanup();
});
