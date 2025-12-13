import React, { useRef, useEffect, useState } from 'react';
import { getContrastColor } from '../utils/color';
import type { NipponColor } from '../types';
import { hexToCmyk } from '../types';

interface ColorListProps {
    colors: NipponColor[];
    activeColor: NipponColor;
    onSelect: (color: NipponColor) => void;
    textColor: string;
    borderColor: string;
}

const CMYKDonut: React.FC<{ value: number; color: string }> = ({ value, color }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width="28" height="28" className="-rotate-90">
            <circle cx="14" cy="14" r={radius} fill="transparent" stroke={color} strokeOpacity="0.2" strokeWidth="6" />
            <circle
                cx="14"
                cy="14"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="butt"
            />
        </svg>
    );
};

const ColorList: React.FC<ColorListProps> = ({ colors, activeColor, onSelect, textColor, borderColor }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [hoveredColorId, setHoveredColorId] = useState<number | null>(null);

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

                    // Determine if this item is being hovered
                    const isHovered = hoveredColorId === color.id;

                    // Determine accent color for the ID and Bar.
                    // If the item is active (bg matches item color), we use the text color for visibility.
                    // If inactive, we use the item's own hex color to make it pop against the global background.
                    const accentColor = isActive ? textColor : color.hex;

                    // Determine the display color for text elements
                    // On hover (when not active), use the item's own hex color
                    const displayColor = isActive ? textColor : isHovered ? color.hex : textColor;

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
                            onMouseEnter={() => setHoveredColorId(color.id)}
                            onMouseLeave={() => setHoveredColorId(null)}
                            className={`
                                group relative flex w-full text-left transition-all duration-300 outline-none
                                ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
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
                                            className="font-serif text-sm md:text-base font-bold transition-colors duration-300"
                                            style={{ color: displayColor }}>
                                            {color.ja}
                                        </span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        {cmykValues.map((val, i) => (
                                            <CMYKDonut key={i} value={val} color={displayColor} />
                                        ))}
                                    </div>
                                </div>

                                {/* Right Section: Romaji, RGB Lines, Hex */}
                                <div className="flex flex-col items-start flex-1">
                                    <span
                                        className="font-roman text-sm md:text-base tracking-widest mb-2 transition-colors duration-300"
                                        style={{ color: displayColor }}>
                                        {color.en}
                                    </span>
                                    <div
                                        className="flex flex-col w-full mb-1 space-y-1 transition-colors duration-300"
                                        style={{ color: displayColor }}>
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
                                        className="text-xs font-sans tracking-widest opacity-70 uppercase transition-colors duration-300"
                                        style={{ color: displayColor }}>
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
