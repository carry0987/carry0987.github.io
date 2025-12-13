import React, { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
    color: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colorRef = useRef(color);

    // Update color ref when prop changes to keep animation loop efficient
    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Track mouse position
        let mouse = { x: -1000, y: -1000 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor(canvasWidth: number, canvasHeight: number) {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update(canvasWidth: number, canvasHeight: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceRadius = 200; // Increased radius for better interaction

                if (distance < forceRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;

                    // Normalized distance (0 to 1, where 1 is at the mouse)
                    const normalizedDist = (forceRadius - distance) / forceRadius;

                    // Non-linear force curve: effect increases drastically as mouse gets closer
                    const force = normalizedDist * normalizedDist;

                    // Stronger repulsion strength
                    const strength = 8.0;

                    this.vx -= forceDirectionX * force * strength * 0.1;
                    this.vy -= forceDirectionY * force * strength * 0.1;
                }

                // Apply friction to stabilize high speeds
                this.vx *= 0.96;
                this.vy *= 0.96;

                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                const maxSpeed = 5.0; // Allow faster bursts
                const minSpeed = 0.2; // Minimum drift speed

                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                } else if (speed < minSpeed) {
                    // Gently push them to keep moving if they slow down too much
                    this.vx += (Math.random() - 0.5) * 0.05;
                    this.vy += (Math.random() - 0.5) * 0.05;
                }

                // Screen wrapping
                if (this.x < 0) this.x = canvasWidth;
                if (this.x > canvasWidth) this.x = 0;
                if (this.y < 0) this.y = canvasHeight;
                if (this.y > canvasHeight) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = colorRef.current;
                ctx.globalAlpha = 0.3;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(window.innerWidth / 10, 80);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.update(canvas.width, canvas.height);
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Initial setup
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Run once on mount

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />;
};

export default ParticlesBackground;
