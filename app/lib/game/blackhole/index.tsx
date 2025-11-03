import { BlackHole } from './blackhole';
import { Particle } from './particle';
import { Stats } from '@adakrei/stats';
import { useEffect } from 'react';

// Import CSS
import './style.css';

class Main {
    private blackholes: BlackHole[] = [];
    private particles: Particle[] = [];
    private target: BlackHole | null = null;
    private canvas?: HTMLCanvasElement;
    private bufferCanvas?: HTMLCanvasElement;

    // Constants
    private readonly BH_SIZE = 15;

    // Stats
    private stats: Stats;

    constructor() {
        this.stats = new Stats();
        this.stats.setMode(0);
        // Render Stats Panel
        this.renderStats();
        this.init();
    }

    private renderStats() {
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.left = 'unset';
        this.stats.dom.style.right = '0';
        this.stats.dom.style.top = '0';
        document.body.appendChild(this.stats.dom);
    }

    private init() {
        // Create Black Hole
        this.canvas = this.createCanvas();
        this.windowResize();
        this.execAnimate();
    }

    private windowResize() {
        if (!this.canvas) {
            throw new Error('Canvas is not initialized');
        }

        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = this.canvas.width = document.body.offsetWidth;
        this.bufferCanvas.height = this.canvas.height = document.body.offsetHeight;

        window.addEventListener('resize', () => {
            if (!this.canvas || !this.bufferCanvas) {
                return;
            }

            this.bufferCanvas.width = this.canvas.width = document.body.offsetWidth;

            return (this.bufferCanvas.height = this.canvas.height = document.body.offsetHeight);
        });
    }

    // Pre-render black hole image
    private bhImage: HTMLCanvasElement = (() => {
        const bhCas: HTMLCanvasElement = document.createElement('canvas');
        bhCas.width = bhCas.height = 50;

        const bhCtx = bhCas.getContext('2d');
        if (!bhCtx) {
            throw new Error('Canvas is not supported');
        }

        let opacity = 0;
        for (let i = 0; i < 20; i++) {
            opacity += 0.05;
            bhCtx.beginPath();
            bhCtx.fillStyle = `rgba(188,186,187,${opacity})`;
            bhCtx.arc(bhCas.width / 2, bhCas.height / 2, 25 - i, 0, Math.PI * 2);
            bhCtx.fill();
        }

        return bhCas;
    })();

    // Animation loop encapsulation
    private RAF: (callback: FrameRequestCallback) => number = (() => {
        return (
            window.requestAnimationFrame ||
            function (callback: FrameRequestCallback): number {
                return window.setTimeout(callback, 1000 / 60);
            }
        ).bind(window);
    })();

    private createCanvas() {
        const canvas = document.querySelector<HTMLCanvasElement>('#cas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Bind events
        canvas.addEventListener('mousedown', (e) => {
            let bh, cx, cy, i, k, len, x, y;

            x = e.clientX - canvas.offsetLeft;
            y = e.clientY - canvas.offsetTop;
            for (i = k = 0, len = this.blackholes.length; k < len; i = ++k) {
                bh = this.blackholes[i];
                cx = bh.options.x - x;
                cy = bh.options.y - y;
                if (cx * cx + cy * cy <= bh.options.r * bh.options.r) {
                    this.target = bh;
                    break;
                }
            }

            // Create black hole
            const createFixed = e.ctrlKey || e.metaKey;
            if (!this.target && e.button === 0 && this.bhImage) {
                const newBlackHole = new BlackHole({
                    x: x,
                    y: y,
                    r: this.BH_SIZE,
                    power: 2
                });
                newBlackHole.fixed = createFixed;

                return this.blackholes.push(newBlackHole);
            } else if (bh && e.button === 2) {
                bh.destory = true;
                bh.animate(bh.options.r);

                return (bh.options.r += 5);
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            let x, y;

            if (this.target) {
                x = e.clientX - canvas.offsetLeft;
                y = e.clientY - canvas.offsetTop;
                this.target.options.x = x;

                return (this.target.options.y = y);
            }
        });

        canvas.addEventListener('mouseup', () => {
            return (this.target = null);
        });

        canvas.addEventListener('mouseout', () => {
            return (this.target = null);
        });

        return canvas;
    }

    // Animation frame logic
    private animate = () => {
        let deleArray: Array<false | BlackHole>, delebh: false | BlackHole;
        let bh, bh2, i, j, k, l, len, len1, len2, len3, len4, m, n, o, p;

        if (!this.canvas || !this.bufferCanvas) {
            throw new Error('Canvas is not initialized');
        }

        const bufferCanvas = this.bufferCanvas;
        const bufferCtx = bufferCanvas.getContext('2d');
        const ctx = this.canvas.getContext('2d');

        if (!bufferCtx || !ctx) {
            throw new Error('Canvas is not supported');
        }

        bufferCtx.save();
        bufferCtx.globalCompositeOperation = 'destination-out';
        bufferCtx.globalAlpha = 0.3;
        bufferCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        bufferCtx.restore();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (i = k = 0, len = this.blackholes.length; k < len; i = ++k) {
            bh = this.blackholes[i];
            if (bh) {
                bh.drawLight(ctx, this.bhImage, this.blackholes);
            }
        }
        // Draw black hole
        deleArray = [];
        for (i = l = 0, len1 = this.blackholes.length; l < len1; i = ++l) {
            bh = this.blackholes[i];
            if (bh) {
                bh.draw(ctx);
            }
            for (j = m = 0, len2 = this.blackholes.length; m < len2; j = ++m) {
                bh2 = this.blackholes[j];
                if (!bh || !bh2 || bh === bh2) {
                    continue;
                }
                bh.attract(bh2); // Black hole attracts each other
                if (j > i && (delebh = bh.check(bh2))) {
                    // Check collision, return the swallowed black hole object if there is a collision
                    deleArray.push(delebh);
                }
            }
        }
        for (n = 0, len3 = deleArray.length; n < len3; n++) {
            delebh = deleArray[n];
            if (!(delebh instanceof BlackHole)) {
                continue;
            }
            // Delete the black hole that collides and add the newly generated black hole
            this.blackholes.splice(this.blackholes.indexOf(delebh), 1);
        }
        for (o = 0, len4 = this.particles.length; o < len4; o++) {
            p = this.particles[o];
            p.attract(this.blackholes);
            p.move();
            p.draw(bufferCtx);
        }
        ctx.drawImage(bufferCanvas, 0, 0);

        // Update stats
        this.stats.update();

        return this.RAF(this.animate);
    };

    // Execute animation
    private execAnimate() {
        if (!this.canvas) {
            throw new Error('Canvas is not initialized');
        }

        for (let i = 0; i < 4000; i++) {
            this.particles.push(
                new Particle({
                    x: this.canvas.width * Math.random(),
                    y: this.canvas.height * Math.random(),
                    r: Math.random() * 2 + 1,
                    color: 'rgba(255,255,255,.5)'
                })
            );
        }

        return this.animate();
    }
}

export default function BlackHoleMain() {
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
            <span className="tips">Left click to build one hole, right click to delete a hole</span>
            <canvas id="cas" className="bg-[#0A3136]" />
        </>
    );
}
