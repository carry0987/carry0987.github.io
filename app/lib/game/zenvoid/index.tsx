import { ZenVoid } from './zenvoid';
import { useEffect, useRef, useState } from 'react';

// Import CSS
import './style.css';

export function meta() {
    return [
        { title: 'ZenVoid: Slap Edition' },
        {
            property: 'og:title',
            content: 'ZenVoid: Slap Edition'
        },
        {
            name: 'description',
            content: 'ZenVoid - A relaxing slap game set in a cyberpunk universe.'
        }
    ];
}

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export default function ZenVoidGame() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<ZenVoid | null>(null);
    const [logs, setLogs] = useState<string[]>(['SYSTEM: SLOW_MOTION', 'SLAP_MODULE: READY']);
    const [themeName, setThemeName] = useState<string>('THEME: CYBERPUNK');
    const [themeColor, setThemeColor] = useState<string>('#00ffff');

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize game
        const game = new ZenVoid();
        gameRef.current = game;

        // Setup callbacks
        game.setLogCallback((msg: string) => {
            setLogs((prev) => [msg, ...prev].slice(0, 6));
        });

        game.setThemeCallback((name: string) => {
            setThemeName(`THEME: ${name}`);
            // Update theme color when theme changes
            const currentTheme = game.getCurrentTheme();
            setThemeColor(`#${currentTheme.main.toString(16).padStart(6, '0')}`);
        });

        // Set initial theme color
        const initialTheme = game.getCurrentTheme();
        setThemeColor(`#${initialTheme.main.toString(16).padStart(6, '0')}`);

        // Append canvas to container
        containerRef.current.appendChild(game.getCanvas());

        // Start animation after a short delay to ensure DOM is ready
        // Use requestAnimationFrame to ensure the canvas is properly mounted
        requestAnimationFrame(() => {
            game.start();
        });

        // Cleanup
        return () => {
            if (gameRef.current) {
                gameRef.current.dispose();
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <>
            <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
            <div id="ui-layer" style={{ color: themeColor }}>
                <div id="log-console" className="tech-text">
                    <div>SYSTEM: SLOW_MOTION</div>
                    <div>SLAP_MODULE: READY</div>
                    <div id="dynamic-log">
                        {logs.map((log, idx) => (
                            <div key={idx}>&gt; {log}</div>
                        ))}
                    </div>
                </div>
                <div id="status-bar" className="tech-text">
                    <div>ENERGY</div>
                    <div className="bar-box">
                        <div
                            className="bar-fill"
                            style={{ boxShadow: `0 0 10px ${themeColor}`, background: themeColor }}></div>
                    </div>
                    <div id="theme-name">{themeName}</div>
                </div>
                <div id="controls-hint" className="tech-text">
                    <span className="key">滑鼠</span> 慵懶轉向 •{' '}
                    <span className="key" style={{ color: themeColor }}>
                        左鍵
                    </span>{' '}
                    巨型巴掌 • <span className="key">C</span> 換色 • <span className="key">Space</span> 稍微快一點
                </div>
            </div>
        </>
    );
}
