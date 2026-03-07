import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Detects whether the app has been hydrated on the client.
 * Uses `useSyncExternalStore` to synchronously return `true` on the client
 * and `false` on the server, avoiding the extra re-render caused by
 * `useState(false)` + `useEffect(() => setState(true))`.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}
