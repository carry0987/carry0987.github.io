import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
// Import type definitions for routes
import type { Route } from './+types/root';
// Import the CSS file
import './app.css';
// Import components
import { Navbar, Footer } from '@/component/ui';
import { Background } from '@/component/background';

// Game routes that should be fullscreen (no navbar, footer, background)
const FULLSCREEN_ROUTES = ['/games/blackhole', '/games/shotball', '/games/zenvoid'];

export const links: Route.LinksFunction = () => [
    { rel: 'dns-prefetch', href: 'https://carry0987.github.io' },
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'alternate', href: 'https://carry0987.github.io', hrefLang: 'zh-Hant' }
];

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Carry's Profile | Developer Portfolio" },
        { name: 'description', content: 'carry0987 (@carry0987) Personal Website - Developer Portfolio' },
        { author: 'carry0987 (@carry0987)' },
        // Open Graph / Facebook
        { property: 'fb:admins', content: 'carry0987' },
        { property: 'fb:app_id', content: '602636090125252' },
        { property: 'og:title', content: "Carry's Profile | Developer Portfolio" },
        { property: 'og:site_name', content: 'carry0987 (@carry0987)' },
        { property: 'og:description', content: 'carry0987 (@carry0987) Personal Website - Developer Portfolio' },
        { property: 'og:type', content: 'blog' },
        { property: 'og:url', content: 'https://carry0987.github.io' },
        { property: 'og:image', content: 'https://carry0987.github.io/static/icon/carry0987.jpg' }
    ];
}

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isFullscreenRoute = FULLSCREEN_ROUTES.includes(location.pathname);

    // Fullscreen layout for games (no navbar, footer, background)
    if (isFullscreenRoute) {
        return (
            <html lang="zh-TW">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <Meta />
                    <Links />
                </head>
                <body className="m-0 overflow-hidden bg-black">
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                </body>
            </html>
        );
    }

    // Default layout with navbar, footer, and background
    return (
        <html lang="zh-TW" className="scroll-smooth">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="min-h-screen flex flex-col bg-dark-bg text-slate-200 selection:bg-tech-500/30 selection:text-tech-100">
                {/* Particle Background Animation */}
                <Background
                    lineColor="56, 189, 248"
                    dotColor="56, 189, 248"
                    density={8000}
                    dotSize={1.2}
                    maxDistance={8000}
                    baseOpacity={0.15}
                    lineWidth={0.4}
                    speed={0.6}
                />
                {/* Grid Background */}
                <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-20" />
                {/* Glow Effects */}
                <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tech-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
                <Navbar />
                <main className="grow pt-32 px-6 max-w-5xl mx-auto w-full relative z-10 pb-20">{children}</main>
                <Footer />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto text-white">
            <h1 className="text-4xl font-bold text-tech-400">{message}</h1>
            <p className="text-slate-400 mt-4">{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto bg-dark-card rounded-lg mt-4 text-sm">
                    <code className="text-slate-300">{stack}</code>
                </pre>
            )}
        </main>
    );
}
