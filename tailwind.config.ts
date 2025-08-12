import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './app/**/*.{ts,tsx}'],
    theme: {
        extend: {}
    },
    plugins: []
} satisfies Config;
