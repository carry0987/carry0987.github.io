import postcss from './postcss.config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import {} from 'vite-react-ssg';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [react()],
    css: {
        postcss: postcss
    },
    ssgOptions: {
        mock: true,
        crittersOptions: false
    },
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp'
        }
    }
});
