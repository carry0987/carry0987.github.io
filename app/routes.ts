import { type RouteConfig, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
    route('/games/blackhole', './lib/game/blackhole/index.tsx'),
    route('/games/shotball', './lib/game/shotball/index.tsx'),
    ...(await flatRoutes({
        ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.scss']
    }))
] satisfies RouteConfig;
