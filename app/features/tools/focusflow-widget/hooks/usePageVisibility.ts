import { useState, useEffect } from 'react';

/**
 * Hook that returns true if the page is currently visible and focused.
 * Returns false if the user switches tabs, minimizes the window, or clicks outside.
 */
export const usePageVisibility = (): boolean => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        // Handler for document visibility (tab switching/minimizing)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsVisible(false);
            } else {
                // Even if tab is visible, check if window has focus
                setIsVisible(document.hasFocus());
            }
        };

        // Handler for window focus (clicking inside the window)
        const handleFocus = () => {
            setIsVisible(true);
        };

        // Handler for window blur (clicking outside the window/dual monitor usage)
        const handleBlur = () => {
            setIsVisible(false);
        };

        // Initial check
        setIsVisible(!document.hidden && document.hasFocus());

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return isVisible;
};
