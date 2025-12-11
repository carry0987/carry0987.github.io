import { useState, useEffect, useRef, type RefObject } from 'react';

interface ScaledPreviewResult {
    wrapperRef: RefObject<HTMLDivElement | null>;
    contentRef: RefObject<HTMLDivElement | null>;
    scale: number;
    wrapperStyle: React.CSSProperties;
}

/**
 * Hook to handle scaled preview with dynamic height adjustment
 * Prevents empty space below scaled content by adjusting wrapper height
 */
export function useScaledPreview(): ScaledPreviewResult {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const content = contentRef.current;
        if (!wrapper || !content) return;

        const updateScale = () => {
            // Get the available width of the wrapper's parent
            const containerWidth = wrapper.parentElement?.clientWidth ?? wrapper.clientWidth;
            const containerPadding = 32; // Account for padding (p-4 = 16px * 2)
            const availableWidth = containerWidth - containerPadding;

            // Get the natural width of the content
            const contentWidth = content.scrollWidth;

            // Calculate scale to fit content within available width
            // Max scale is 1, min scale is 0.5
            const newScale = Math.max(0.5, Math.min(1, availableWidth / contentWidth));
            setScale(newScale);

            // Calculate the scaled height to eliminate empty space
            const contentHeight = content.scrollHeight;
            const scaledHeight = contentHeight * newScale;
            setWrapperHeight(scaledHeight);
        };

        // Initial calculation
        updateScale();

        // Observe wrapper for size changes
        const resizeObserver = new ResizeObserver(() => {
            updateScale();
        });

        resizeObserver.observe(wrapper);
        if (wrapper.parentElement) {
            resizeObserver.observe(wrapper.parentElement);
        }

        // Also observe content for size changes (e.g., when messages are added)
        const contentObserver = new ResizeObserver(() => {
            updateScale();
        });
        contentObserver.observe(content);

        return () => {
            resizeObserver.disconnect();
            contentObserver.disconnect();
        };
    }, []);

    const wrapperStyle: React.CSSProperties = {
        height: wrapperHeight !== undefined ? `${wrapperHeight}px` : 'auto',
        position: 'relative'
    };

    return {
        wrapperRef,
        contentRef,
        scale,
        wrapperStyle
    };
}
