import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { NIPPON_COLORS } from './constants';
import ColorList from './components/ColorList';
import ColorDetails from './components/ColorDetails';
import ParticlesBackground from './components/ParticlesBackground';

// Import relevant styles
import './style.css';

// Helper to determine text contrast (simple version)
const getContrastColor = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#1a1a1a' : '#f5f5f5'; // Dark text for light bg, Light text for dark bg
};

const App: React.FC = () => {
    const [activeColor, setActiveColor] = useState(NIPPON_COLORS[0]);
    const [duration, setDuration] = useState(1500);

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
                    onSelect={setActiveColor}
                    textColor={textColor}
                    borderColor={borderColor}
                />
            </main>

            {/* Duration Slider Control */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 group">
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
                    onChange={(e) => setDuration(Number(e.target.value))}
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
