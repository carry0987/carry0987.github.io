import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <Suspense>
            <Outlet />
        </Suspense>
    );
}
