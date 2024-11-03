interface BlackHoleOptions {
    x: number;
    y: number;
    r: number;
    power: number;
}

class BlackHole {
    public options: BlackHoleOptions;
    public destory: boolean = false;
    public fixed: boolean = false;
    private step: number;
    private bigger: number;
    private isAdd: boolean = false;
    private ir: number = 0;

    constructor(options: BlackHoleOptions) {
        this.options = options;
        this.step = 2;
        this.bigger = 5;
        this.animate(0);
    }

    // Draw light
    public drawLight(ctx: CanvasRenderingContext2D, bhImage: HTMLCanvasElement, blackholes: BlackHole[]) {
        let imgr;

        if (this.isAdd) {
            if ((this.ir += this.step) > this.options.r + this.bigger) {
                this.isAdd = false;
            }
        } else {
            this.ir = this.ir <= this.options.r ? this.options.r : this.ir - this.step;
            if (this.destory && this.ir === this.options.r) {
                blackholes.splice(blackholes.indexOf(this), 1);
            }
        }
        imgr = this.ir * 1.4;

        return ctx.drawImage(bhImage, this.options.x - imgr, this.options.y - imgr, imgr * 2, imgr * 2);
    }

    // Draw black hole
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(this.options.x, this.options.y, this.ir, 0, Math.PI * 2);

        return ctx.fill();
    }

    public animate(ir: number) {
        this.ir = ir;

        return (this.isAdd = true);
    }

    public attract(bh: BlackHole) {
        if (this.fixed || bh.fixed) return;

        let cx, cy, jl, lax, lay, power;

        if (bh.options.r >= this.options.r) {
            cx = bh.options.x - this.options.x;
            cy = bh.options.y - this.options.y;
            jl = Math.sqrt(cx * cx + cy * cy);
            power = ((bh.options.r - this.options.r) * 10) / jl + 0.5;
            lax = Math.abs((power * cx) / jl);
            lay = Math.abs((power * cy) / jl);
            this.options.x += cx > 0 ? lax : -lax;

            return (this.options.y += cy > 0 ? lay : -lay);
        }
    }

    public check(bh: BlackHole) {
        let cr, cx, cy, lbh, nbh;

        if (!(bh instanceof BlackHole) || this.destory || bh.destory) {
            return false;
        }

        cx = bh.options.x - this.options.x;
        cy = bh.options.y - this.options.y;
        cr = bh.ir + this.ir;
        cx = Math.abs(cx);
        cy = Math.abs(cy);

        if (cx < cr && cy < cr && Math.sqrt(cx * cx + cy * cy) <= Math.abs(bh.options.r - this.options.r) + 3) {
            if (bh.options.r > this.options.r) {
                [nbh, lbh] = [bh, this];
            } else {
                [nbh, lbh] = [this, bh];
            }
            // '~~' is a bitwise operator that is used to convert a number to an integer.
            nbh.options.r = ~~Math.sqrt(bh.options.r * bh.options.r + this.options.r * this.options.r);
            nbh.options.power = bh.options.power + this.options.power;
            nbh.animate(Math.max(bh.options.r, this.options.r));
            if (nbh.options.r > 50) {
                nbh.destory = true;
            }

            return lbh;
        }

        return false;
    }
}

export { BlackHole };
