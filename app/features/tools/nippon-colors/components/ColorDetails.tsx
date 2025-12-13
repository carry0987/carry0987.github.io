import React, { useState, useEffect } from 'react';
import type { NipponColor } from '../types';
import { hexToRgb, hexToCmyk } from '../types';

interface ColorDetailsProps {
    color: NipponColor;
    textColor: string;
}

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

const ColorDetails: React.FC<ColorDetailsProps> = ({ color, textColor }) => {
    const [animateIn, setAnimateIn] = useState(false);

    // Reset animation when color changes
    useEffect(() => {
        setAnimateIn(false);
        // Small delay to trigger animation
        const timer = setTimeout(() => setAnimateIn(true), 50);
        return () => clearTimeout(timer);
    }, [color]);

    return (
        <div className="relative z-10 flex flex-col h-full pl-6 md:pl-16 pt-10 md:pt-20 pb-10 justify-between pointer-events-none">
            {/* Top Left: Color Codes */}
            <div
                className={`pointer-events-auto transition-opacity duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ color: textColor }}>
                <h1 className="text-4xl md:text-6xl font-serif font-black mb-6 tracking-tight">
                    NIPPON <br /> COLORS
                </h1>

                <div
                    className="space-y-4 font-roman text-sm md:text-base tracking-widest border-l-2 pl-4"
                    style={{ borderColor: textColor }}>
                    <CopyableValue label="ROMAN" value={color.en} textColor={textColor} />
                    <CopyableValue label="RGB" value={hexToRgb(color.hex)} textColor={textColor} />
                    <CopyableValue label="CMYK" value={hexToCmyk(color.hex)} textColor={textColor} />
                    <CopyableValue label="HEX" value={color.hex} textColor={textColor} />
                </div>
            </div>

            {/* Center/Right: Giant Kanji Background Watermark-like */}
            <div
                className={`absolute top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-in-out`}>
                <div
                    className="vertical-text font-serif font-black text-[25vh] md:text-[40vh] opacity-20 select-none leading-none"
                    style={{ color: textColor }}>
                    {color.ja}
                </div>
            </div>
        </div>
    );
};

export default ColorDetails;
