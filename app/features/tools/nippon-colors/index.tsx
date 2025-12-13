import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { NIPPON_COLORS } from './constants';
import { getContrastColor } from './utils/color';
import { saveManager } from './utils/saveManager';
import { hashManager } from './utils/hashManager';
import ColorList from './components/ColorList';
import ColorDetails from './components/ColorDetails';
import ParticlesBackground from './components/ParticlesBackground';

// Import relevant styles
import './style.css';

const DEFAULT_DURATION = 1500;

const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState(() => {
        // Check URL hash on initial load (client-side only)
        return hashManager.getColor() || NIPPON_COLORS[0];
    });
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [isReady, setIsReady] = useState(false);

    // Load saved duration on mount and handle hash changes
    useEffect(() => {
        const saved = saveManager.getTransitionDuration();
        setDuration(saved);

        // Handle initial hash on client-side
        const colorFromHash = hashManager.getColor();
        if (colorFromHash) setActiveColor(colorFromHash);

        setIsReady(true);

        // Listen for hash changes (e.g., browser back/forward)
        const handleHashChange = () => {
            const newColor = hashManager.getColor();
            if (newColor) {
                setActiveColor(newColor);
            } else {
                setActiveColor(NIPPON_COLORS[0]);
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
                className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                style={{ color: textColor }}>
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Tools</span>
            </Link>

            {/* Background Texture Overlay to give it a paper feel */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

            <main className="relative z-20 w-full h-full max-w-7xl mx-auto">
                <ColorDetails color={activeColor} textColor={textColor} />

                <ColorList
                    colors={NIPPON_COLORS}
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
