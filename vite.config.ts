import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    resolve: {
        tsconfigPaths: true
    },
    plugins: [tailwindcss(), reactRouter()],
    build: {
        cssMinify: true,
        ssr: false
    },
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp'
        }
    }
});
