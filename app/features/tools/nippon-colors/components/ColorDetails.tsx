import React, { useState, useEffect } from 'react';
import type { NipponColor } from '../types';
import { hexToRgb, hexToCmyk } from '../types';

interface ColorDetailsProps {
    color: NipponColor;
    textColor: string;
    duration: number;
}

// CMYK Donut Chart with label and centered value
const CMYKDonutLarge: React.FC<{ label: string; value: number; color: string; textColor: string }> = ({
    label,
    value,
    color,
    textColor
}) => {
    return (
        <div className="flex flex-col items-center">
            <span
                className="text-[10px] md:text-[12px] font-sans tracking-widest opacity-60 mb-0.5 md:mb-1 border-b pb-0.5"
                style={{ color: textColor, borderColor: `${textColor}40` }}>
                {label}
            </span>
            {/* Mobile size */}
            <div className="relative block md:hidden" style={{ width: 38, height: 38 }}>
                <svg width={38} height={38} className="-rotate-90">
                    <circle
                        cx={19}
                        cy={19}
                        r={14}
                        fill="transparent"
                        stroke={textColor}
                        strokeOpacity="0.2"
                        strokeWidth={5}
                    />
                    <circle
                        cx={19}
                        cy={19}
                        r={14}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={5}
                        strokeDasharray={2 * Math.PI * 14}
                        strokeDashoffset={2 * Math.PI * 14 - (value / 100) * 2 * Math.PI * 14}
                        strokeLinecap="butt"
                        className="transition-all duration-500"
                    />
                </svg>
                <span
                    className="absolute inset-0 flex items-center justify-center text-xs font-serif"
                    style={{ color }}>
                    {value}
                </span>
            </div>
            {/* Desktop size */}
            <div className="relative hidden md:block" style={{ width: 50, height: 50 }}>
                <svg width={50} height={50} className="-rotate-90">
                    <circle
                        cx={25}
                        cy={25}
                        r={20}
                        fill="transparent"
                        stroke={textColor}
                        strokeOpacity="0.2"
                        strokeWidth={6}
                    />
                    <circle
                        cx={25}
                        cy={25}
                        r={20}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={6}
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 - (value / 100) * 2 * Math.PI * 20}
                        strokeLinecap="butt"
                        className="transition-all duration-500"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm" style={{ color }}>
                    {value}
                </span>
            </div>
        </div>
    );
};

// RGB Value Display with label
const RGBValue: React.FC<{ label: string; value: number; textColor: string }> = ({ label, value, textColor }) => {
    return (
        <div className="flex flex-col items-center">
            <span
                className="text-[10px] md:text-[12px] font-sans tracking-widest opacity-60 mb-0.5 md:mb-1 border-b pb-0.5"
                style={{ color: textColor, borderColor: `${textColor}40` }}>
                {label}
            </span>
            <span className="text-lg md:text-xl" style={{ color: textColor }}>
                {value}
            </span>
        </div>
    );
};

const CopyableValue = ({ label, value, textColor }: { label: string; value: string; textColor: string }) => {
    const [copied, setCopied] = useState(false);

    // Reset copied state when value changes (e.g. user selects different color)
    useEffect(() => {
        setCopied(false);
    }, [value]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);

        // Reset after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="group">
            <span className="block text-xs opacity-60">{label}</span>
            <div className="flex items-center gap-2 h-6">
                <span>{value}</span>
                <button
                    onClick={handleCopy}
                    className={`
            opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300
            p-1 rounded hover:bg-white/20 outline-none
          `}
                    style={{ color: textColor }}
                    aria-label={`Copy ${label} value`}
                    title="Copy to clipboard">
                    {copied ? (
                        <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </button>
                <span
                    className={`
            text-[10px] tracking-wider font-sans transition-all duration-300
            ${copied ? 'opacity-70 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
          `}>
                    COPIED
                </span>
            </div>
        </div>
    );
};

// Copyable wrapper for visual elements (CMYK donuts, RGB values)
const CopyableVisual = ({
    label,
    value,
    textColor,
    children
}: {
    label: string;
    value: string;
    textColor: string;
    children: React.ReactNode;
}) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setCopied(false);
    }, [value]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group">
            <div className="flex items-center gap-2 mb-2">
                <span className="block text-xs opacity-60">{label}</span>
                <button
                    onClick={handleCopy}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 p-1 rounded hover:bg-white/20 outline-none"
                    style={{ color: textColor }}
                    aria-label={`Copy ${label} value`}
                    title="Copy to clipboard">
                    {copied ? (
                        <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </button>
                <span
                    className={`text-[10px] tracking-wider font-sans transition-all duration-300 ${copied ? 'opacity-70 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
                    COPIED
                </span>
            </div>
            {children}
        </div>
    );
};

const ColorDetails: React.FC<ColorDetailsProps> = ({ color, textColor, duration }) => {
    const [displayedKanji, setDisplayedKanji] = useState(color.ja);
    const [kanjiOpacity, setKanjiOpacity] = useState(1);

    // Handle kanji transition with fade effect
    useEffect(() => {
        if (color.ja !== displayedKanji) {
            // Fade out
            setKanjiOpacity(0);
            // After fade out, change text and fade in
            const timeout = setTimeout(() => {
                setDisplayedKanji(color.ja);
                setKanjiOpacity(1);
            }, duration / 2); // Half of transition duration for fade out
            return () => clearTimeout(timeout);
        }
    }, [color.ja, displayedKanji, duration]);

    // Parse CMYK values
    const cmykValues = hexToCmyk(color.hex)
        .split(',')
        .map((v) => parseInt(v.trim()));
    const [c, m, y, k] = cmykValues;

    // Parse RGB values
    const r = parseInt(color.hex.substring(1, 3), 16);
    const g = parseInt(color.hex.substring(3, 5), 16);
    const b = parseInt(color.hex.substring(5, 7), 16);

    // CMYK colors
    const cmykColors = ['#00BFFF', '#FF1493', '#FFD700', '#333333'];

    return (
        <div className="relative z-10 flex flex-col h-full pl-6 md:pl-16 pt-10 md:pt-20 pb-10 justify-between pointer-events-none">
            {/* Top Left: Color Codes */}
            <div className="pointer-events-auto transition-colors duration-1000" style={{ color: textColor }}>
                <div className="flex items-center gap-3 md:gap-5 mb-6">
                    {/* Hinomaru (Japanese Sun Circle) */}
                    <div className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-[#bc002d] shadow-sm shrink-0" />
                    <h1 className="text-2xl md:text-6xl font-serif font-black tracking-tight leading-none">
                        NIPPON <br /> COLORS
                    </h1>
                </div>

                <div
                    className="space-y-4 font-roman text-sm md:text-base tracking-widest border-l-2 pl-4"
                    style={{ borderColor: textColor }}>
                    <CopyableValue label="ROMAN" value={color.en} textColor={textColor} />
                    <CopyableValue label="HEX" value={color.hex} textColor={textColor} />

                    {/* CMYK Visual */}
                    <CopyableVisual label="CMYK" value={hexToCmyk(color.hex)} textColor={textColor}>
                        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                            <div className="flex gap-2 md:gap-3">
                                <CMYKDonutLarge label="C" value={c} color={cmykColors[0]} textColor={textColor} />
                                <CMYKDonutLarge label="M" value={m} color={cmykColors[1]} textColor={textColor} />
                            </div>
                            <div className="flex gap-2 md:gap-3">
                                <CMYKDonutLarge label="Y" value={y} color={cmykColors[2]} textColor={textColor} />
                                <CMYKDonutLarge label="K" value={k} color={cmykColors[3]} textColor={textColor} />
                            </div>
                        </div>
                    </CopyableVisual>

                    {/* RGB Visual */}
                    <CopyableVisual label="RGB" value={hexToRgb(color.hex)} textColor={textColor}>
                        <div className="flex gap-4 md:gap-6">
                            <RGBValue label="R" value={r} textColor={textColor} />
                            <RGBValue label="G" value={g} textColor={textColor} />
                            <RGBValue label="B" value={b} textColor={textColor} />
                        </div>
                    </CopyableVisual>
                </div>
            </div>

            {/* Center/Right: Giant Kanji Background Watermark-like */}
            <div
                className={`absolute inset-0 flex items-center justify-center md:justify-end md:pr-[15%] pointer-events-none`}>
                <div
                    className="vertical-text font-serif font-black text-[15vh] md:text-[40vh] select-none leading-none transition-all ease-in-out"
                    style={{ color: textColor, opacity: kanjiOpacity * 0.2, transitionDuration: `${duration / 2}ms` }}>
                    {displayedKanji}
                </div>
            </div>
        </div>
    );
};

export default ColorDetails;
