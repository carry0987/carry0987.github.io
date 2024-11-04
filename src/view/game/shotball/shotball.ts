interface ShotBallOptions {
    x: number;
    y: number;
    r: number;
    color: string;
}

class ShotBall {
    public options: ShotBallOptions;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public radius: number;
    private color: string;
    private candrod: boolean;

    constructor(options: ShotBallOptions) {
        this.options = options;
        const { x, y, r, color } = options;

        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = r;
        this.color = color;
        this.candrod = true;
    }

    public paint(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    public run(canvas: HTMLCanvasElement, t: number) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context is null');
        }

        if (!this.candrod) {
            return this.paint(ctx);
        }

        const ballRadius = 12,
            g = 9.8,
            mocali = 0.5,
            collarg = 0.8;
        const pxpm = canvas.width / 20; // pixel per meter

        this.vx += this.vx > 0 ? -mocali * t : mocali * t;
        this.vy = this.vy + g * t;
        this.x += t * this.vx * pxpm;
        this.y += t * this.vy * pxpm;

        if (this.y > canvas.height - ballRadius || this.y < ballRadius) {
            this.y = this.y < ballRadius ? ballRadius : canvas.height - ballRadius;
            this.vy = -this.vy * collarg;
        }

        if (this.x > canvas.width - ballRadius || this.x < ballRadius) {
            this.x = this.x < ballRadius ? ballRadius : canvas.width - ballRadius;
            this.vx = -this.vx * collarg;
        }

        this.paint(ctx);
    }

    public setSpeed(vx: number, vy: number) {
        this.vx = vx;
        this.vy = vy;
    }
}

export { ShotBall };
