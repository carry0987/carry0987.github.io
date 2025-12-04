import { type RouteConfig, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
    /* Games */
    route('/games/blackhole', './features/games/blackhole/index.tsx'),
    route('/games/shotball', './features/games/shotball/index.tsx'),
    route('/games/zenvoid', './features/games/zenvoid/index.tsx'),
    route('/games/sky-metropolis', './features/games/sky-metropolis/index.tsx'),
    /* Tools */
    route('/tools/svg-generator', './features/tools/svg-generator/index.tsx'),
    ...(await flatRoutes({
        ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.scss']
    }))
] satisfies RouteConfig;
