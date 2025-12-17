import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Filter } from 'lucide-react';
import { NIPPON_COLORS } from './constants';
import { getContrastColor, getContrastRatio } from './utils/color';
import { saveManager } from './utils/saveManager';
import { hashManager } from './utils/hashManager';
import ColorList from './components/ColorList';
import ColorDetails from './components/ColorDetails';
import ParticlesBackground from './components/ParticlesBackground';

// Import relevant styles
import './style.css';

const DEFAULT_DURATION = 1500;

// Helper function to get a random color
const getRandomColor = () => NIPPON_COLORS[Math.floor(Math.random() * NIPPON_COLORS.length)];

const App: React.FC = () => {
    // Always start with a random color (client-only, no SSR)
    const [activeColor, setActiveColor] = useState(getRandomColor);
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [isReady, setIsReady] = useState(false);
    const [showHighContrastOnly, setShowHighContrastOnly] = useState(false);

    // Load saved duration on mount and handle hash changes
    useEffect(() => {
        const saved = saveManager.getTransitionDuration();
        setDuration(saved);

        setIsReady(true);

        // If there's a hash color, transition to it after initial render
        const colorFromHash = hashManager.getColor();
        if (colorFromHash) {
            // Use requestAnimationFrame to ensure the initial render is complete
            // then apply the hash color with transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setActiveColor(colorFromHash);
                });
            });
        }

        // Listen for hash changes (e.g., browser back/forward)
        const handleHashChange = () => {
            const newColor = hashManager.getColor();
            if (newColor) {
                setActiveColor(newColor);
            } else {
                setActiveColor(getRandomColor());
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Update URL hash when color changes
    const handleColorSelect = useCallback((color: (typeof NIPPON_COLORS)[0]) => {
        setActiveColor(color);
        hashManager.setColor(color);
    }, []);

    const handleDurationChange = useCallback((value: number) => {
        setDuration(value);
        saveManager.save(value);
    }, []);

    const textColor = useMemo(() => getContrastColor(activeColor.hex), [activeColor.hex]);

    // Filter colors based on contrast ratio with current background
    const filteredColors = useMemo(() => {
        if (!showHighContrastOnly) return NIPPON_COLORS;
        return NIPPON_COLORS.filter((color) => {
            // Always include the active color
            if (color.id === activeColor.id) return true;
            // Check contrast ratio >= 4.5 (WCAG AA)
            return getContrastRatio(color.hex, activeColor.hex) >= 4.5;
        });
    }, [showHighContrastOnly, activeColor]);

    const borderColor = useMemo(() => {
        // A slightly more transparent version of text color for borders
        return textColor === '#1a1a1a' ? 'rgba(26, 26, 26, 0.3)' : 'rgba(245, 245, 245, 0.3)';
    }, [textColor]);

    return (
        <div
            className="relative w-full h-screen overflow-hidden transition-colors ease-in-out"
            style={{
                backgroundColor: activeColor.hex,
                transitionDuration: `${duration}ms`
            }}>
            {/* Interactive Particles Layer */}
            <ParticlesBackground color={textColor} />

            {/* Back to Tools Button */}
            <Link
                to="/tools"
                className="fixed top-4 left-4 md:top-6 md:left-6 z-50 inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                style={{ color: textColor }}>
                <ArrowLeft size={14} className="md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs md:text-sm font-medium">Back</span>
            </Link>

            {/* Background Texture Overlay to give it a paper feel */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

            <main className="relative z-20 w-full h-full max-w-7xl mx-auto">
                <ColorDetails color={activeColor} textColor={textColor} duration={duration} />

                <ColorList
                    colors={filteredColors}
                    activeColor={activeColor}
                    onSelect={handleColorSelect}
                    textColor={textColor}
                    borderColor={borderColor}
                />
            </main>

            {/* Duration Slider Control */}
            <div
                className={`fixed bottom-6 left-6 md:left-1/2 md:-translate-x-1/2 z-40 flex flex-col items-start md:items-center gap-2 group transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
                <label
                    className="text-[10px] uppercase tracking-[0.2em] font-roman opacity-40 group-hover:opacity-100 transition-opacity duration-300 select-none"
                    style={{ color: textColor }}>
                    Transition: {(duration / 1000).toFixed(1)}s
                </label>
                <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={duration}
                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                    className="w-32 h-1 bg-current opacity-30 hover:opacity-100 rounded-lg appearance-none cursor-pointer transition-opacity duration-300"
                    style={{ color: textColor, accentColor: textColor }}
                />
            </div>

            {/* High Contrast Filter Toggle */}
            <button
                onClick={() => setShowHighContrastOnly(!showHighContrastOnly)}
                className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md transition-all duration-300 ${isReady ? 'opacity-100' : 'opacity-0'} ${
                    showHighContrastOnly ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                }`}
                style={{ color: textColor }}
                title={showHighContrastOnly ? 'Show all colors' : 'Show high contrast colors only'}>
                <Filter size={14} className={showHighContrastOnly ? 'fill-current' : ''} />
                <span className="text-[10px] uppercase tracking-widest font-roman">
                    {showHighContrastOnly ? `AA (${filteredColors.length})` : 'All'}
                </span>
            </button>

            {/* Floating Vertical Kanji of Current Color (Foreground element) */}
            <div
                className="fixed top-12 md:top-24 right-32 md:right-56 z-30 hidden md:block select-none"
                style={{ color: textColor }}>
                <div className="vertical-text text-2xl md:text-4xl font-serif tracking-[1rem] opacity-80 transition-transform duration-700 ease-in-out hover:-translate-y-4 hover:rotate-3 cursor-default">
                    日本の色
                </div>
            </div>
        </div>
    );
};

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

// Disable SSR for this route to avoid hydration mismatch with random colors
export const clientLoader = async () => {
    // Deliberately delay 1 second for testing loading screen
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return null;
};
export const HydrateFallback = () => (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden relative">
        {/* Japanese wave pattern background */}
        <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="seigaiha" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 40 Q20 20 40 40 Q60 20 80 40" stroke="#fff" strokeWidth="0.5" fill="none" />
                        <path d="M0 30 Q20 10 40 30 Q60 10 80 30" stroke="#fff" strokeWidth="0.5" fill="none" />
                        <path d="M0 20 Q20 0 40 20 Q60 0 80 20" stroke="#fff" strokeWidth="0.5" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#seigaiha)" />
            </svg>
        </div>

        {/* Vertical Japanese text */}
        <div className="relative flex flex-col items-center gap-8">
            {/* Main vertical kanji */}
            <div className="vertical-text text-4xl md:text-6xl font-serif tracking-[0.5em] text-[#d4a574] opacity-90 animate-pulse">
                日本の色
            </div>

            {/* Animated ink brush stroke */}
            <div className="relative w-48 h-1 overflow-hidden mt-4 rounded">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#d4a574] to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
            </div>

            {/* Loading dots with traditional feel */}
            <div className="flex items-center gap-3 mt-6">
                <span
                    className="w-2 h-2 rounded-full bg-[#d4a574] animate-[bounce_1s_ease-in-out_infinite]"
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-[#d4a574] animate-[bounce_1s_ease-in-out_infinite]"
                    style={{ animationDelay: '200ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-[#d4a574] animate-[bounce_1s_ease-in-out_infinite]"
                    style={{ animationDelay: '400ms' }}
                />
            </div>

            {/* Subtitle */}
            <div className="text-[#8b8b8b] text-xs tracking-[0.3em] uppercase mt-2 font-light">伝統色を読み込み中</div>
        </div>

        {/* Decorative corner elements - top left */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#d4a574]/30" />
        {/* Bottom right */}
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#d4a574]/30" />

        {/* Floating kanji decorations */}
        <div className="absolute top-1/4 left-12 text-[#d4a574]/10 text-8xl font-serif select-none animate-[float_6s_ease-in-out_infinite]">
            色
        </div>
        <div className="absolute bottom-1/4 right-12 text-[#d4a574]/10 text-8xl font-serif select-none animate-[float_6s_ease-in-out_infinite_reverse]">
            彩
        </div>
    </div>
);

export function meta() {
    return [
        { title: 'Nippon Colors | 日本の伝統色' },
        {
            property: 'og:title',
            content: 'Nippon Colors | 日本の伝統色'
        },
        {
            name: 'description',
            content: 'Browse traditional Japanese colors (日本の伝統色), search by name, and copy HEX/RGB/CMYK values.'
        }
    ];
}

export default App;
