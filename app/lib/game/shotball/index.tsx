import { ShotBall } from './shotball';
import { Stats } from '@adakrei/stats';
import { useEffect } from 'react';

// Import CSS
import './style.css';

class Main {
    private balls: ShotBall[] = [];
    private canvas?: HTMLCanvasElement;

    // Stats
    private stats: Stats;

    constructor() {
        this.stats = new Stats();
        this.stats.setMode(0);

        // Render Stats Panel
        this.renderStats();

        // Initialize
        this.init();

        // Start animation
        this.animate();

        // Set listener
        this.setListener();
    }

    private renderStats() {
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.left = 'unset';
        this.stats.dom.style.right = '0';
        this.stats.dom.style.top = '0';
        document.body.appendChild(this.stats.dom);
    }

    private init() {
        const canvas = document.querySelector<HTMLCanvasElement>('#cas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Set size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.canvas = canvas;

        const ballRadius = 12;
        for (let i = 0; i < 100; i++) {
            let ball = new ShotBall({
                x: this.getRandom(ballRadius, canvas.width - ballRadius),
                y: this.getRandom(ballRadius, canvas.height - ballRadius),
                r: ballRadius,
                color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`
            });
            this.balls.push(ball);
        }
    }

    // Animation loop encapsulation
    private RAF: (callback: FrameRequestCallback) => number = (() => {
        return (
            window.requestAnimationFrame ||
            function (callback: FrameRequestCallback): number {
                return window.setTimeout(callback, 1000 / 60);
            }
        ).bind(window);
    })();

    private animate = () => {
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context is null');
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        let t = 16 / 1000;
        this.collision();
        this.balls.forEach((b) => {
            b.run(canvas, t);
        });

        // Update stats
        this.stats.update();

        return this.RAF(this.animate);
    };

    private collision() {
        const balls = this.balls;
        const collarg = 0.8;

        for (let i = 0; i < balls.length; i++) {
            for (let j = 0; j < balls.length; j++) {
                let b1 = balls[i],
                    b2 = balls[j];
                if (b1 !== b2) {
                    let rc = Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
                    if (Math.ceil(rc) < b1.radius + b2.radius + 2) {
                        // Get the increment of velocity after collision
                        let ax =
                            ((b1.vx - b2.vx) * Math.pow(b1.x - b2.x, 2) +
                                (b1.vy - b2.vy) * (b1.x - b2.x) * (b1.y - b2.y)) /
                            Math.pow(rc, 2);
                        let ay =
                            ((b1.vy - b2.vy) * Math.pow(b1.y - b2.y, 2) +
                                (b1.vx - b2.vx) * (b1.x - b2.x) +
                                (b1.y - b2.y)) /
                            Math.pow(rc, 2);

                        // Give new velocity to balls
                        b1.vx = (b1.vx - ax) * collarg;
                        b1.vy = (b1.vy - ay) * collarg;
                        b2.vx = (b2.vx + ax) * collarg;
                        b2.vy = (b2.vy + ay) * collarg;

                        // Get the tangent position of two balls and force twist
                        let clength = (b1.radius + b2.radius + 2 - rc) / 2;
                        let cx = (clength * (b1.x - b2.x)) / rc;
                        let cy = (clength * (b1.y - b2.y)) / rc;
                        b1.x = b1.x + cx;
                        b1.y = b1.y + cy;
                        b2.x = b2.x - cx;
                        b2.y = b2.y - cy;
                    }
                }
            }
        }
    }

    private setListener() {
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        const canvas = this.canvas;

        canvas.addEventListener('click', (event) => {
            let x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft;
            let y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop;

            this.balls.forEach(function (b) {
                // Initial velocity m/s
                b.vx = (x - b.x) / 40;
                b.vy = (y - b.y) / 40;
            });
        });
    }

    private getRandom(a: number, b: number) {
        return Math.random() * (b - a) + a;
    }
}

export default function ShotBallMain() {
    useEffect(() => {
        // Set oncontextmenu to prevent right click for body
        const handler = (e: MouseEvent) => {
            e.preventDefault();
        };
        document.body.addEventListener('contextmenu', handler);

        // Render the game
        new Main();

        return () => {
            document.body.removeEventListener('contextmenu', handler);
        };
    }, []);

    return (
        <>
            <span className="tips">Left click to create a gravity point</span>
            <canvas id="cas" className="bg-[#0A3136]" />
        </>
    );
}
