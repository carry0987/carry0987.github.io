import { App } from './app';
import { NotFound } from '@/view/error/notfound';
import { Home } from '@/view/home';
import { DarkMode } from '@carry0987/darkmode';
import { LocationProvider, Router, Route } from 'preact-iso';
import { render } from 'preact';

// Import the global styles
import './index.css';

const container = document.getElementById('app');
if (!container) {
    throw new Error('No container found');
}

const Main = () => {
    new DarkMode({
        autoDetect: true,
        preferSystem: false
    });

    return (
        <LocationProvider>
            <Router>
                <Route path="/" component={App} />
                <Route path="/test" component={Home} />
                <Route default component={NotFound} />
            </Router>
        </LocationProvider>
    );
};

render(<Main />, container);
