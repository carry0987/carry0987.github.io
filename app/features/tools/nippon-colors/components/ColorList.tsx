import React, { useRef, useEffect } from 'react';
import type { NipponColor } from '../types';
import { hexToCmyk } from '../types';

interface ColorListProps {
    colors: NipponColor[];
    activeColor: NipponColor;
    onSelect: (color: NipponColor) => void;
    textColor: string;
    borderColor: string;
}

// Helper to determine text contrast
const getContrastColor = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? '#1a1a1a' : '#f5f5f5';
};

const CMYKDonut: React.FC<{ value: number; color: string }> = ({ value, color }) => {
    const radius = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width="22" height="22" className="-rotate-90">
            <circle cx="11" cy="11" r={radius} fill="transparent" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
            <circle
                cx="11"
                cy="11"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

const ColorList: React.FC<ColorListProps> = ({ colors, activeColor, onSelect, textColor, borderColor }) => {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current) {
            const activeEl = listRef.current.querySelector(`[data-id="${activeColor.id}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeColor.id]);

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
            className="absolute right-0 top-0 bottom-0 w-80 md:w-104 overflow-y-auto no-scrollbar z-20 py-10 outline-none"
            ref={listRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-label="Color list">
            <div className="flex flex-col items-end space-y-4 pb-20">
                {colors.map((color) => {
                    const isActive = color.id === activeColor.id;
                    const contrastColor = getContrastColor(color.hex);

                    // Determine accent color for the ID and Bar.
                    // If the item is active (bg matches item color), we use the text color for visibility.
                    // If inactive, we use the item's own hex color to make it pop against the global background.
                    const accentColor = isActive ? textColor : color.hex;

                    // Parse CMYK for the donuts (calculate from hex)
                    const cmykValues = hexToCmyk(color.hex)
                        .split(',')
                        .map((v) => parseInt(v.trim()));

                    // Parse RGB values for the bars
                    const r = parseInt(color.hex.substring(1, 3), 16);
                    const g = parseInt(color.hex.substring(3, 5), 16);
                    const b = parseInt(color.hex.substring(5, 7), 16);

                    return (
                        <button
                            key={color.id}
                            data-id={color.id}
                            onClick={() => onSelect(color)}
                            className={`
                                group relative flex w-full text-left transition-all duration-300 outline-none
                                ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'}
                            `}
                            aria-label={`Select color ${color.ja}`}>
                            {/* Active/Selection Indicator Bar */}
                            <div
                                className={`w-1.5 md:w-2 mr-3 md:mr-4 transition-all duration-300 shrink-0`}
                                style={{ backgroundColor: accentColor }}
                            />

                            <div className="flex w-full pr-4 md:pr-8 gap-2">
                                {/* Left Section: ID, Kanji, CMYK */}
                                <div className="flex flex-col items-start min-w-24 md:min-w-28">
                                    <div className="flex items-baseline justify-between w-full mb-2">
                                        <span
                                            className="font-serif text-sm tracking-widest opacity-80"
                                            style={{ color: accentColor }}>
                                            {String(color.id).padStart(3, '0')}
                                        </span>
                                        <span
                                            className="font-serif text-sm md:text-base font-bold"
                                            style={{ color: textColor }}>
                                            {color.ja}
                                        </span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        {cmykValues.map((val, i) => (
                                            <CMYKDonut key={i} value={val} color={textColor} />
                                        ))}
                                    </div>
                                </div>

                                {/* Right Section: Romaji, RGB Lines, Hex */}
                                <div className="flex flex-col items-start flex-1">
                                    <span
                                        className="font-roman text-lg md:text-xl tracking-widest mb-2"
                                        style={{ color: textColor }}>
                                        {color.en}
                                    </span>
                                    <div className="flex flex-col w-full mb-1 space-y-1" style={{ color: textColor }}>
                                        <div className="relative h-px w-full">
                                            <div className="absolute inset-0 bg-current opacity-25"></div>
                                            <div
                                                className="absolute top-0 left-0 h-full bg-current opacity-80"
                                                style={{ width: `${(r / 255) * 100}%` }}></div>
                                        </div>
                                        <div className="relative h-px w-full">
                                            <div className="absolute inset-0 bg-current opacity-25"></div>
                                            <div
                                                className="absolute top-0 left-0 h-full bg-current opacity-80"
                                                style={{ width: `${(g / 255) * 100}%` }}></div>
                                        </div>
                                        <div className="relative h-px w-full">
                                            <div className="absolute inset-0 bg-current opacity-25"></div>
                                            <div
                                                className="absolute top-0 left-0 h-full bg-current opacity-80"
                                                style={{ width: `${(b / 255) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <span
                                        className="text-xs font-sans tracking-widest opacity-70 uppercase"
                                        style={{ color: textColor }}>
                                        {color.hex}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorList;
