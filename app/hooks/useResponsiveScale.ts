import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

interface UseResponsiveScaleOptions {
    /** Minimum scale factor (default: 0.5) */
    minScale?: number;
    /** Maximum scale factor (default: 1) */
    maxScale?: number;
    /** Padding to account for in available width calculation (default: 0) */
    padding?: number;
    /** Whether scaling is enabled (default: true) */
    enabled?: boolean;
}

interface UseResponsiveScaleResult {
    /** Ref to attach to the wrapper element */
    wrapperRef: RefObject<HTMLDivElement | null>;
    /** Ref to attach to the content element that will be scaled */
    contentRef: RefObject<HTMLDivElement | null>;
    /** Current scale factor */
    scale: number;
    /** Style object for the wrapper element (includes calculated height) */
    wrapperStyle: React.CSSProperties;
    /** Style object for the content element (includes transform) */
    contentStyle: React.CSSProperties;
    /** Manually trigger a recalculation */
    recalculate: () => void;
}

/**
 * Hook to handle responsive scaling of content with dynamic height adjustment.
 * Prevents empty space below scaled content by adjusting wrapper height based on
 * the actual scaled dimensions.
 *
 * @example
 * ```tsx
 * const { wrapperRef, contentRef, wrapperStyle, contentStyle } = useResponsiveScale({
 *   minScale: 0.5,
 *   maxScale: 1,
 *   padding: 32
 * });
 *
 * return (
 *   <div ref={wrapperRef} style={wrapperStyle}>
 *     <div ref={contentRef} style={contentStyle}>
 *       {content}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useResponsiveScale(options: UseResponsiveScaleOptions = {}): UseResponsiveScaleResult {
    const { minScale = 0.5, maxScale = 1, padding = 0, enabled = true } = options;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(maxScale);
    const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);

    const recalculate = useCallback(() => {
        const wrapper = wrapperRef.current;
        const content = contentRef.current;
        if (!wrapper || !content || !enabled) {
            setScale(maxScale);
            setWrapperHeight(undefined);
            return;
        }

        // Get the available width of the wrapper's parent
        const containerWidth = wrapper.parentElement?.clientWidth ?? wrapper.clientWidth;
        const availableWidth = containerWidth - padding;

        // Get the natural width of the content
        const contentWidth = content.scrollWidth;

        // Calculate scale to fit content within available width
        const calculatedScale = availableWidth / contentWidth;
        const newScale = Math.max(minScale, Math.min(maxScale, calculatedScale));
        setScale(newScale);

        // Calculate the scaled height to eliminate empty space
        const contentHeight = content.scrollHeight;
        const scaledHeight = contentHeight * newScale;
        setWrapperHeight(scaledHeight);
    }, [enabled, minScale, maxScale, padding]);

    useEffect(() => {
        if (!enabled) {
            setScale(maxScale);
            setWrapperHeight(undefined);
            return;
        }

        const wrapper = wrapperRef.current;
        const content = contentRef.current;
        if (!wrapper || !content) return;

        // Initial calculation
        recalculate();

        // Observe wrapper and parent for size changes
        const resizeObserver = new ResizeObserver(() => {
            recalculate();
        });

        resizeObserver.observe(wrapper);
        if (wrapper.parentElement) {
            resizeObserver.observe(wrapper.parentElement);
        }

        // Also observe content for size changes (e.g., when content is added/removed)
        resizeObserver.observe(content);

        return () => {
            resizeObserver.disconnect();
        };
    }, [enabled, recalculate]);

    const wrapperStyle: React.CSSProperties = {
        height: wrapperHeight !== undefined ? `${wrapperHeight}px` : 'auto',
        position: 'relative'
    };

    const contentStyle: React.CSSProperties = {
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
    };

    return {
        wrapperRef,
        contentRef,
        scale,
        wrapperStyle,
        contentStyle,
        recalculate
    };
}
