import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { version } from './package.json';

export default defineConfig({
    base: '/',
    plugins: [react(), svgr()],
    cacheDir: '../node_modules/.vite',
    envPrefix: 'WAR2_',
    build: {
        outDir: './build',
        chunkSizeWarningLimit: 5000,
    },
    define: {
        __APP_VERSION__: `"${version}"`,
    },
});
