import React, { useRef, useEffect, useMemo } from 'react';
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

// Helper to parse hex to RGB values
const hexToRgbValues = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
};

// Helper to convert RGB to CMYK values (0-100)
const rgbToCmykValues = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
    const kPercent = Math.round(k * 100);

    return { c, m, y, k: kPercent };
};

// CMYK Ring Component - displays a donut chart style ring
const CmykRing: React.FC<{ value: number; size?: number; strokeWidth?: number; color: string }> = ({
    value,
    size = 16,
    strokeWidth = 3,
    color
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                opacity={0.2}
            />
            {/* Value arc */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                opacity={0.8}
            />
        </svg>
    );
};

// RGB Bar Component - displays a horizontal bar
const RgbBar: React.FC<{ value: number; maxWidth?: number; height?: number; color: string }> = ({
    value,
    maxWidth = 32,
    height = 2,
    color
}) => {
    const width = (value / 255) * maxWidth;

    return (
        <div className="relative" style={{ width: maxWidth, height }}>
            {/* Background bar */}
            <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: color }} />
            {/* Value bar */}
            <div
                className="absolute left-0 top-0 bottom-0 rounded-full opacity-80"
                style={{ backgroundColor: color, width }}
            />
        </div>
    );
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
            className="absolute right-0 top-0 bottom-0 w-52 md:w-96 overflow-y-auto no-scrollbar z-20 py-10 outline-none"
            ref={listRef}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Make container focusable to catch initial key events
            aria-label="Color list">
            <div className="flex flex-col items-end pr-4 md:pr-10 space-y-4">
                {colors.map((color) => {
                    const isActive = color.id === activeColor.id;
                    const rgb = hexToRgbValues(color.hex);
                    const cmyk = rgbToCmykValues(rgb.r, rgb.g, rgb.b);

                    return (
                        <button
                            key={color.id}
                            data-id={color.id}
                            onClick={() => onSelect(color)}
                            className={`
                group flex flex-col items-end w-full transition-all duration-300 outline-none
                ${isActive ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80 focus:opacity-80'}
              `}
                            aria-label={`Select color ${color.ja}`}>
                            {/* Top row: Color code, Kanji, English name */}
                            <div className="flex items-center justify-end w-full mb-1">
                                <span className="mr-2 text-[10px] font-mono opacity-60" style={{ color: textColor }}>
                                    {color.code.replace('col', '')}
                                </span>
                                <span className="mr-2 text-xs font-serif opacity-80" style={{ color: textColor }}>
                                    {color.ja}
                                </span>
                                <span
                                    className="text-xs md:text-sm font-roman tracking-wider font-medium"
                                    style={{ color: textColor }}>
                                    {color.en}
                                </span>
                            </div>

                            {/* Bottom row: CMYK circles + RGB bars + Color swatch + HEX */}
                            <div className="flex items-center gap-2">
                                {/* CMYK Rings */}
                                <div className="hidden md:flex items-center gap-1">
                                    <CmykRing value={cmyk.c} color={textColor} />
                                    <CmykRing value={cmyk.m} color={textColor} />
                                    <CmykRing value={cmyk.y} color={textColor} />
                                    <CmykRing value={cmyk.k} color={textColor} />
                                </div>

                                {/* RGB Bars */}
                                <div className="hidden md:flex flex-col gap-0.5">
                                    <RgbBar value={rgb.r} color={textColor} />
                                    <RgbBar value={rgb.g} color={textColor} />
                                    <RgbBar value={rgb.b} color={textColor} />
                                </div>

                                {/* Color swatch */}
                                <div
                                    className={`
                      w-6 h-6 md:w-8 md:h-8 shadow-md transition-all duration-500
                      ${isActive ? 'rounded-none' : 'rounded-sm'}
                    `}
                                    style={{ backgroundColor: color.hex }}
                                />

                                {/* HEX code */}
                                <span
                                    className="text-[10px] font-mono w-14 text-left opacity-70"
                                    style={{ color: textColor }}>
                                    {color.hex}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorList;
