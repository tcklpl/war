/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version } from './package.json';

export default defineConfig({
    base: './',
    plugins: [react(), svgr(), tsconfigPaths()],
    cacheDir: '../node_modules/.vite',
    envPrefix: 'WAR2_',
    build: {
        outDir: './build',
        chunkSizeWarningLimit: 5000,
    },
    define: {
        __APP_VERSION__: `"${version}"`,
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './src/setup_tests.ts',
        coverage: {
            provider: 'v8',
            reporter: ['json', 'html'],
        },
    },
});
