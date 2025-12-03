import React, { useEffect, useRef, useMemo } from 'react';
import type { Dot, WArea } from '@/types/background';

interface BackgroundProps {
    /** Line color in RGB format, e.g., "56, 189, 248" for tech-400 */
    lineColor?: string;
    /** Dot color in RGB format */
    dotColor?: string;
    /** Dot size in pixels */
    dotSize?: number;
    /** Density divisor - lower = more particles (default: 6000) */
    density?: number;
    /** Maximum connection distance squared (default: 6000) */
    maxDistance?: number;
    /** Mouse interaction radius squared (default: 20000) */
    mouseRadius?: number;
    /** Mouse attraction strength (default: 0.03) */
    mouseStrength?: number;
    /** Particle speed multiplier (default: 1) */
    speed?: number;
    /** Enable mouse interaction (default: true) */
    interactive?: boolean;
    /** Base opacity for lines (default: 0.2) */
    baseOpacity?: number;
    /** Line width multiplier (default: 0.5) */
    lineWidth?: number;
    /** Z-index of the canvas (default: 0) */
    zIndex?: number;
}

const Background: React.FC<BackgroundProps> = ({
    lineColor = '56, 189, 248',
    dotColor = '56, 189, 248',
    dotSize = 1.5,
    density = 6000,
    maxDistance = 6000,
    mouseRadius = 20000,
    mouseStrength = 0.03,
    speed = 1,
    interactive = true,
    baseOpacity = 0.2,
    lineWidth = 0.5,
    zIndex = 0
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Memoize config to prevent unnecessary re-renders
    const config = useMemo(
        () => ({
            lineColor,
            dotColor,
            dotSize,
            density,
            maxDistance,
            mouseRadius,
            mouseStrength,
            speed,
            interactive,
            baseOpacity,
            lineWidth
        }),
        [
            lineColor,
            dotColor,
            dotSize,
            density,
            maxDistance,
            mouseRadius,
            mouseStrength,
            speed,
            interactive,
            baseOpacity,
            lineWidth
        ]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Store the animation frame id
        let animationId: number;
        // Check if the device is touch-enabled
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Calculate the number of dots dynamically based on canvas size
        const calculateDotCount = () => Math.floor((canvas.width * canvas.height) / config.density);

        // Initialize dots dynamically
        let dots: Dot[] = Array.from({ length: calculateDotCount() }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            xa: (Math.random() * 2 - 1) * config.speed,
            ya: (Math.random() * 2 - 1) * config.speed,
            max: config.maxDistance
        }));

        const resizeDots = () => {
            const targetCount = calculateDotCount();
            const currentCount = dots.length;

            if (targetCount > currentCount) {
                // Add new dots
                dots.push(
                    ...Array.from({ length: targetCount - currentCount }, () => ({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        xa: (Math.random() * 2 - 1) * config.speed,
                        ya: (Math.random() * 2 - 1) * config.speed,
                        max: config.maxDistance
                    }))
                );
            } else if (targetCount < currentCount) {
                // Remove excess dots
                dots.splice(targetCount);
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Adjust dot count smoothly instead of full recreation
            resizeDots();
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const warea: WArea = { x: null, y: null, max: config.mouseRadius };

        const onMouseMove = (e: MouseEvent) => {
            if (!config.interactive) return;
            if (isTouchDevice && e.type === 'mousemove') return;
            warea.x = e.clientX;
            warea.y = e.clientY;
        };

        const onMouseOut = () => {
            warea.x = null;
            warea.y = null;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseout', onMouseOut);

        const RAF = window.requestAnimationFrame || ((callback) => setTimeout(callback, 1000 / 60));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const ndots = config.interactive ? [warea, ...dots] : dots;

            dots.forEach((dot) => {
                dot.x += dot.xa;
                dot.y += dot.ya;

                // Reverse velocity when hitting canvas boundaries
                dot.xa *= dot.x > canvas.width || dot.x < 0 ? -1 : 1;
                dot.ya *= dot.y > canvas.height || dot.y < 0 ? -1 : 1;

                // Draw dot with configurable size and color
                ctx.fillStyle = `rgba(${config.dotColor}, 0.8)`;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, config.dotSize, 0, Math.PI * 2);
                ctx.fill();

                for (const d2 of ndots) {
                    if (dot === d2 || d2.x === null || d2.y === null) continue;

                    const dx = dot.x - d2.x;
                    const dy = dot.y - d2.y;
                    const distance = dx * dx + dy * dy;

                    if (distance < d2.max) {
                        // Mouse attraction effect
                        if (d2 === warea && distance > d2.max / 2) {
                            dot.x -= dx * config.mouseStrength;
                            dot.y -= dy * config.mouseStrength;
                        }

                        const ratio = (d2.max - distance) / d2.max;

                        ctx.beginPath();
                        ctx.lineWidth = ratio * config.lineWidth;
                        ctx.strokeStyle = `rgba(${config.lineColor}, ${ratio * (1 - config.baseOpacity) + config.baseOpacity})`;
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(d2.x, d2.y);
                        ctx.stroke();
                    }
                }
            });

            animationId = RAF(animate);
        };

        // Delay animation start
        setTimeout(() => animate(), 100);

        return () => {
            // Cleanup event listeners and animations
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseout', onMouseOut);

            // Cancel the animation frame
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [config]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex,
                pointerEvents: 'none'
            }}
        />
    );
};

export { Background };
export type { BackgroundProps };
