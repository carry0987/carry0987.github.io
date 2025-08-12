import { BlackHole } from './blackhole';

interface ParticleOptions {
    x: number;
    y: number;
    r: number;
    color: string;
}

class Particle {
    private options: ParticleOptions;
    private vx: number = 0;
    private vy: number = 0;
    private ax: number = 0;
    private ay: number = 0;
    private oldx: number = 0;
    private oldy: number = 0;

    private canvas: HTMLCanvasElement = document.getElementById('cas') as HTMLCanvasElement;

    constructor(options: ParticleOptions) {
        this.options = options;
        this.init();
    }

    private init() {
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
        this.ax = 0;

        return (this.ay = 0);
    }

    public move() {
        let maxSpeed, ref, ref1;

        this.vx += this.ax;
        this.vy += this.ay;
        maxSpeed = 10;
        this.vx = Math.abs(this.vx) > maxSpeed ? (maxSpeed * Math.abs(this.vx)) / this.vx : this.vx;
        this.vy = Math.abs(this.vy) > maxSpeed ? (maxSpeed * Math.abs(this.vy)) / this.vy : this.vy;
        this.oldx = this.options.x;
        this.oldy = this.options.y;
        this.options.x += this.vx;
        this.options.y += this.vy;
        this.vx =
            0 <= (ref = this.options.x) && ref <= this.canvas.width + this.options.r * 2 ? this.vx : -this.vx * 0.98;

        return (this.vy =
            0 <= (ref1 = this.options.y) && ref1 <= this.canvas.height + this.options.r * 2
                ? this.vy
                : -this.vy * 0.98);
    }

    public attract(blackholes: BlackHole[]) {
        let angle, bh, cx, cy, k, lax, lay, len, power, results;

        this.ax = this.ay = 0;
        results = [];
        for (k = 0, len = blackholes.length; k < len; k++) {
            bh = blackholes[k];
            cx = bh.options.x - this.options.x;
            cy = bh.options.y - this.options.y;
            angle = Math.atan(cx / cy);
            power = bh.options.power * 0.1;
            lax = Math.abs(power * Math.sin(angle));
            lay = Math.abs(power * Math.cos(angle));
            this.ax += cx > 0 ? lax : -lax;
            results.push((this.ay += cy > 0 ? lay : -lay));
        }

        return results;
    }

    public draw(bufferCtx: CanvasRenderingContext2D) {
        bufferCtx.save();
        bufferCtx.strokeStyle = this.options.color;
        bufferCtx.lineCap = bufferCtx.lineJoin = 'round';
        bufferCtx.lineWidth = this.options.r;
        bufferCtx.beginPath();
        bufferCtx.moveTo(this.oldx - this.options.r, this.oldy - this.options.r);
        bufferCtx.lineTo(this.options.x - this.options.r, this.options.y - this.options.r);
        bufferCtx.stroke();

        return bufferCtx.restore();
    }
}

export { Particle };
