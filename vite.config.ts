import postcss from './postcss.config';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [preact()],
    base: '/',
    css: {
        postcss: postcss
    }
});
