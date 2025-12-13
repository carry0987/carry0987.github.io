import { useState, useEffect, useRef } from 'react';

const MOBILE_BREAKPOINT = 768; // md breakpoint in Tailwind

/**
 * Hook to detect if the current viewport is mobile using ResizeObserver.
 * Uses the md breakpoint (768px) as the threshold.
 * Returns null initially until device detection is complete.
 */
export function useIsMobile(): boolean | null {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const observerRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        // Initial check
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

        // Create ResizeObserver to watch document body
        observerRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setIsMobile(width < MOBILE_BREAKPOINT);
            }
        });

        // Observe document body
        observerRef.current.observe(document.body);

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    return isMobile;
}
