import { routes } from './app';
import { ViteReactSSG } from 'vite-react-ssg';

// Import the global styles
import './index.scss';

export const createRoot = ViteReactSSG({ routes });
