import tailwindConfig from './tailwind.config';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
    plugins: [tailwindcss(tailwindConfig), autoprefixer()]
};
