import React, { useState, useEffect } from 'react';
import type { NipponColor, AiInsight } from '../types';
import { getColorInsight } from '../services/geminiService';

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
    const [insight, setInsight] = useState<AiInsight | null>(null);
    const [loading, setLoading] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // Reset insight when color changes
    useEffect(() => {
        setInsight(null);
        setAnimateIn(false);
        // Small delay to trigger animation
        const timer = setTimeout(() => setAnimateIn(true), 50);
        return () => clearTimeout(timer);
    }, [color]);

    const handleAiAnalysis = async () => {
        if (loading || insight) return;
        setLoading(true);
        const data = await getColorInsight(color.name, color.hex);
        setInsight(data);
        setLoading(false);
    };

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
                    <CopyableValue label="ROMAN" value={color.romaji} textColor={textColor} />
                    <CopyableValue label="RGB" value={color.rgb} textColor={textColor} />
                    <CopyableValue label="CMYK" value={color.cmyk} textColor={textColor} />
                    <CopyableValue label="HEX" value={color.hex} textColor={textColor} />
                </div>

                {/* AI Action */}
                <div className="mt-8">
                    <button
                        onClick={handleAiAnalysis}
                        disabled={loading}
                        className={`
              pointer-events-auto px-6 py-2 border border-current font-serif tracking-widest text-sm
              transition-all duration-300 hover:bg-white/20 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
            `}>
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>THINKING...</span>
                            </>
                        ) : insight ? (
                            <span>INSIGHT REVEALED</span>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                <span>ASK GEMINI</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Center/Right: Giant Kanji Background Watermark-like */}
            <div
                className={`absolute top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-in-out`}>
                <div
                    className="vertical-text font-serif font-black text-[25vh] md:text-[40vh] opacity-20 select-none leading-none"
                    style={{ color: textColor }}>
                    {color.name}
                </div>
            </div>

            {/* Bottom Left: AI Insight Display */}
            {insight && (
                <div
                    className="pointer-events-auto max-w-md mt-auto backdrop-blur-md bg-white/10 p-6 border-l-4 shadow-xl transition-all duration-500 animate-[fadeIn_0.5s_ease-out]"
                    style={{ borderColor: textColor, color: textColor }}>
                    <div className="font-serif italic mb-3 text-lg opacity-90">"{insight.haiku}"</div>
                    <p className="text-sm md:text-base leading-relaxed mb-3 opacity-90 font-light">{insight.history}</p>
                    <div className="text-xs tracking-widest uppercase opacity-70 border-t pt-2 border-current">
                        Vibe: {insight.emotionalVibe}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorDetails;
