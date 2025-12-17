import { type RouteConfig, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
    /* Games */
    route('/games/blackhole', './features/games/blackhole/index.tsx'),
    route('/games/shotball', './features/games/shotball/index.tsx'),
    route('/games/zenvoid', './features/games/zenvoid/index.tsx'),
    route('/games/sky-metropolis', './features/games/sky-metropolis/index.tsx'),
    route('/games/gesture-flow', './features/games/gesture-flow/index.tsx'),
    route('/games/3d-motion-capture', './features/games/3d-motion-capture/index.tsx'),
    route('/games/perlin-noise', './features/games/perlin-noise/index.tsx'),
    route('/games/neon-gyro-maze', './features/games/neon-gyro-maze/index.tsx'),
    route('/games/fruit-crush', './features/games/fruit-crush/index.tsx'),
    /* Tools */
    route('/tools/nippon-colors', './features/tools/nippon-colors/index.tsx'),
    route('/tools/svg-generator', './features/tools/svg-generator/index.tsx'),
    route('/tools/focusflow-widget', './features/tools/focusflow-widget/index.tsx'),
    route('/tools/imgur-drop', './features/tools/imgur-drop/index.tsx'),
    route('/tools/fakechat', './features/tools/fakechat/index.tsx'),
    /* Other Routes */
    ...(await flatRoutes({
        ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.scss']
    }))
] satisfies RouteConfig;
