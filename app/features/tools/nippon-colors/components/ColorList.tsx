import React, { useRef, useEffect } from 'react';
import type { NipponColor } from '../types';

interface ColorListProps {
    colors: NipponColor[];
    activeColor: NipponColor;
    onSelect: (color: NipponColor) => void;
    textColor: string;
    borderColor: string;
}

// Helper to determine text contrast (matches App.tsx logic)
// Returns the ideal text color for a given background hex
const getContrastColor = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#1a1a1a' : '#f5f5f5';
};

const ColorList: React.FC<ColorListProps> = ({ colors, activeColor, onSelect, textColor, borderColor }) => {
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll active color into view smoothly
    useEffect(() => {
        if (listRef.current) {
            const activeEl = listRef.current.querySelector(`[data-id="${activeColor.id}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeColor.id]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const isArrowUp = e.key === 'ArrowUp';
        const isArrowDown = e.key === 'ArrowDown';

        if (isArrowUp || isArrowDown) {
            e.preventDefault();
            const buttons = Array.from(listRef.current?.querySelectorAll('button') || []) as HTMLButtonElement[];
            if (buttons.length === 0) return;

            const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
            let nextIndex = 0;

            if (currentIndex !== -1) {
                if (isArrowDown) {
                    nextIndex = (currentIndex + 1) % buttons.length;
                } else {
                    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                }
            } else {
                // If focus is lost or on container, try to start from the active color
                const activeBtnIndex = buttons.findIndex((btn) => btn.dataset.id === String(activeColor.id));
                nextIndex = activeBtnIndex !== -1 ? activeBtnIndex : 0;
            }

            const targetBtn = buttons[nextIndex] as HTMLButtonElement;
            targetBtn.focus({ preventScroll: true });
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    return (
        <div
            className="absolute right-0 top-0 bottom-0 w-32 md:w-48 overflow-y-auto no-scrollbar z-20 py-10 outline-none"
            ref={listRef}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Make container focusable to catch initial key events
            aria-label="Color list">
            <div className="flex flex-col items-end pr-4 md:pr-8 space-y-1">
                {colors.map((color) => {
                    const isActive = color.id === activeColor.id;

                    // Determine if the current global text color works well with this specific color swatch
                    const idealColorForSwatch = getContrastColor(color.hex);
                    const hasGoodContrast = idealColorForSwatch === textColor;

                    return (
                        <button
                            key={color.id}
                            data-id={color.id}
                            onClick={() => onSelect(color)}
                            className={`
                group flex items-center justify-end w-full transition-all duration-300 outline-none
                ${isActive ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80 focus:opacity-80'}
              `}
                            aria-label={`Select color ${color.ja}`}>
                            <span
                                className={`mr-3 text-xs md:text-sm font-roman tracking-wider transition-colors duration-500`}
                                style={{ color: textColor }}>
                                {color.en}
                            </span>
                            <div
                                className={`
                  h-px bg-current transition-all duration-500 
                  ${isActive ? 'w-8 md:w-12' : 'w-4 md:w-6 group-hover:w-8 group-focus:w-8'}
                `}
                                style={{ backgroundColor: borderColor }}
                            />
                            <div
                                className={`
                  w-8 h-8 md:w-10 md:h-10 ml-2 flex items-center justify-center text-xs shadow-md transition-all duration-500
                  ${isActive ? 'rounded-none' : 'rounded-sm'}
                  hover:scale-110
                `}
                                style={{
                                    backgroundColor: color.hex,
                                    // We use the 'ideal' color for the icon so it is always visible against the swatch
                                    color: idealColorForSwatch
                                }}
                                title={
                                    hasGoodContrast
                                        ? 'Good contrast with current text theme'
                                        : 'Poor contrast with current text theme'
                                }>
                                {hasGoodContrast ? (
                                    // Animated flourish for good contrast: Layered pulsing diamond ripples
                                    <div className="relative flex items-center justify-center w-full h-full">
                                        {/* Core Steady Diamond */}
                                        <div className="relative z-10 w-1.5 h-1.5 bg-current rotate-45 shadow-[0_0_6px_currentColor]"></div>

                                        {/* First Ripple */}
                                        <div className="absolute w-2 h-2 border-[0.5px] border-current rotate-45 opacity-60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>

                                        {/* Delayed Trail Ripple */}
                                        <div
                                            className="absolute w-2 h-2 border-[0.5px] border-current rotate-45 opacity-40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                                            style={{ animationDelay: '0.6s' }}></div>
                                    </div>
                                ) : (
                                    // Static X for poor contrast
                                    <svg
                                        className="w-3 h-3 opacity-50"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorList;
