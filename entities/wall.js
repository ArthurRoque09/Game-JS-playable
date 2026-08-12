export class Wall {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    drawDebug(ctx) {

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}