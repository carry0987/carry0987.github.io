import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
// Import the CSS file
import './app.css';

export const links: Route.LinksFunction = () => [
    { rel: 'dns-prefetch', href: 'https://carry0987.github.io' },
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'alternate', href: 'https://carry0987.github.io', hrefLang: 'zh-Hant' }
];

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'carry0987 (@carry0987)' },
        { name: 'description', content: 'carry0987 (@carry0987) Personal Website' },
        { author: 'carry0987 (@carry0987)' },
        // Open Graph / Facebook
        { property: 'fb:admins', content: 'carry0987' },
        { property: 'fb:app_id', content: '602636090125252' },
        { property: 'og:title', content: 'carry0987 (@carry0987)' },
        { property: 'og:site_name', content: 'carry0987 (@carry0987)' },
        { property: 'og:description', content: 'carry0987 (@carry0987) Personal Website' },
        { property: 'og:type', content: 'blog' },
        { property: 'og:url', content: 'https://carry0987.github.io' },
        { property: 'og:image', content: 'https://carry0987.github.io/static/icon/carry0987.jpg' }
    ];
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="bg-gray-100">
                {children}
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
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
