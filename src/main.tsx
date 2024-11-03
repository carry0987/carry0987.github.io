import { App } from './app';
import { NotFound } from '@/view/error/notfound';
import { GameList } from '@/view/game/gameList';
import { BlackHoleMain } from '@/view/game/blackhole';
import { ShotBallMain } from '@/view/game/shotball';
import { DarkMode } from '@carry0987/darkmode';
import { LocationProvider, Router, Route } from 'preact-iso';
import { render } from 'preact';

// Import the global styles
import './index.scss';

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
                <Route path="/games" component={GameList} />
                <Route path="/games/blackhole" component={BlackHoleMain} />
                <Route path="/games/shotball" component={ShotBallMain} />
                <Route default component={NotFound} />
            </Router>
        </LocationProvider>
    );
};

render(<Main />, container);
