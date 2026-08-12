export class Bullet {

    constructor(x, y, dx, dy, damage) {

        this.x = x;
        this.y = y;

        this.dx = dx;
        this.dy = dy;

        this.radius = 5;

        this.damage = damage;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {

        ctx.fillStyle = "yellow";

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}