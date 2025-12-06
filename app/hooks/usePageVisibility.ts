import { useState, useEffect, useRef } from 'react';

interface UsePageVisibilityOptions {
    /**
     * If true, also considers window focus state (clicking outside window).
     * Default: false (only considers tab visibility)
     */
    considerFocus?: boolean;
}

interface UsePageVisibilityReturn {
    /** Whether the page is currently visible */
    isVisible: boolean;
    /** Ref that always has the current visibility state (useful in loops/callbacks) */
    isVisibleRef: React.RefObject<boolean>;
}

/**
 * Hook that tracks page visibility state using the Page Visibility API.
 * Useful for pausing animations, video processing, or other resource-intensive tasks
 * when the user is not actively viewing the page.
 *
 * @param options - Configuration options
 * @returns Object containing visibility state and a ref for use in callbacks
 *
 * @example
 * // Basic usage - only track tab visibility
 * const { isVisible } = usePageVisibility();
 *
 * @example
 * // Track both tab visibility and window focus
 * const { isVisible } = usePageVisibility({ considerFocus: true });
 *
 * @example
 * // Use ref in animation loops or callbacks
 * const { isVisibleRef } = usePageVisibility();
 * useEffect(() => {
 *   const loop = () => {
 *     if (isVisibleRef.current) {
 *       // do processing
 *     }
 *     requestAnimationFrame(loop);
 *   };
 *   loop();
 * }, []);
 */
export const usePageVisibility = (options: UsePageVisibilityOptions = {}): UsePageVisibilityReturn => {
    const { considerFocus = false } = options;
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const isVisibleRef = useRef<boolean>(true);

    useEffect(() => {
        const updateVisibility = (visible: boolean) => {
            isVisibleRef.current = visible;
            setIsVisible(visible);
        };

        // Handler for document visibility (tab switching/minimizing)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                updateVisibility(false);
            } else if (considerFocus) {
                // If considering focus, check if window has focus
                updateVisibility(document.hasFocus());
            } else {
                updateVisibility(true);
            }
        };

        // Handler for window focus (clicking inside the window)
        const handleFocus = () => {
            if (!document.hidden) {
                updateVisibility(true);
            }
        };

        // Handler for window blur (clicking outside the window/dual monitor usage)
        const handleBlur = () => {
            updateVisibility(false);
        };

        // Initial check
        const initialVisible = considerFocus ? !document.hidden && document.hasFocus() : !document.hidden;
        updateVisibility(initialVisible);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (considerFocus) {
            window.addEventListener('focus', handleFocus);
            window.addEventListener('blur', handleBlur);
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (considerFocus) {
                window.removeEventListener('focus', handleFocus);
                window.removeEventListener('blur', handleBlur);
            }
        };
    }, [considerFocus]);

    return { isVisible, isVisibleRef };
};
