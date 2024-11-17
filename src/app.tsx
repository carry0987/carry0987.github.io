import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';

// Import the CSS file
import './app.scss';

const Layout = React.lazy(() => import('./layout'));

export const routes: RouteRecord[] = [
    {
        path: '/',
        Component: Layout,
        ErrorBoundary: React.lazy(() => import('@/view/error/notfound')),
        children: [
            {
                index: true,
                Component: React.lazy(() => import('@/view/home'))
            },
            {
                path: 'games',
                Component: React.lazy(() => import('@/view/game/gameList'))
            },
            {
                path: 'games/blackhole',
                Component: React.lazy(() => import('@/view/game/blackhole'))
            },
            {
                path: 'games/shotball',
                Component: React.lazy(() => import('@/view/game/shotball'))
            },
            {
                path: 'cydia',
                Component: React.lazy(() => import('@/view/cydia'))
            }
        ]
    }
];
