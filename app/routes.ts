import { type RouteConfig, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
    route('/games/blackhole', './features/games/blackhole/index.tsx'),
    route('/games/shotball', './features/games/shotball/index.tsx'),
    route('/games/zenvoid', './features/games/zenvoid/index.tsx'),
    ...(await flatRoutes({
        ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.scss']
    }))
] satisfies RouteConfig;
