export class Sprite {
    constructor(src, width, height) {
        this.image = new Image();
        this.image.src = src;
        this.width = width;
        this.height = height;
        this.loaded = false;
        this.error = false;

        this.image.onload = () => {
            this.loaded = true;
        };

        this.image.onerror = () => {
            this.error = true;
            console.warn(`Sprite não encontrado: ${src}`)
        }
    }

    drawFrame(ctx, frame, x, y, angle = 0) {

        ctx.save();
    
        // Altura que o personagem terá na tela
        const targetHeight = 64;
    
        // Mantém a proporção original do sprite
        const scale = targetHeight / frame.height;
    
        const drawWidth = frame.width * scale;
        const drawHeight = targetHeight;
    
        // Centro do personagem
        const centerX = x + this.width / 2;
        const centerY = y + this.height / 2;
    
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
    
        if (this.loaded) {
    
            ctx.drawImage(
                this.image,
    
                // Recorte do spritesheet
                frame.x,
                frame.y,
                frame.width,
                frame.height,
    
                // Desenho proporcional
                -drawWidth / 2,
                -drawHeight / 2,
                drawWidth,
                drawHeight
            );
    
        } else {
    
            ctx.fillStyle = "green";
    
            ctx.fillRect(
                -32,
                -32,
                64,
                64
            );
    
            ctx.strokeStyle = "black";
    
            ctx.strokeRect(
                -32,
                -32,
                64,
                64
            );
    
        }
    
        ctx.restore();
    }
}