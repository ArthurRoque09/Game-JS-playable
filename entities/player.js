import { Sprite } from "../core/sprite.js";
import { Animation } from "../core/animation.js";

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 6;

        this.isShooting = false;
        this.shootTimer = 0;
        this.shootDuration = 100;

        this.angle = 0;

        this.spriteFrente = new Sprite("./assets/Spritesheet-Player.png", 64, 64);

        this.walkAnimation = new Animation(
            this.spriteFrente,
        
            [
                { x: 6,   y: 311, width: 70, height: 38 },
            ],
        
            100
        );

        this.shootAnimation = new Animation(
            this.spriteFrente, 

            [
                { x: 81,  y: 311, width: 73, height: 36 },
                { x: 159, y: 306, width: 70, height: 38 }
            ],

            50
        );}

    update(keys, deltaTime) {

        let moving = false;
    
        if (keys["ArrowRight"] || keys["d"]) {
            this.x += this.speed;
            moving = true;
        }
    
        if (keys["ArrowLeft"] || keys["a"]) {
            this.x -= this.speed;
            moving = true;
        }
    
        if (keys["ArrowUp"] || keys["w"]) {
            this.y -= this.speed;
            moving = true;
        }
    
        if (keys["ArrowDown"] || keys["s"]) {
            this.y += this.speed;
            moving = true;
        }
    
        if (moving) {
            this.walkAnimation.play();
        } else {
            this.walkAnimation.stop();
        }
    
        this.walkAnimation.update(deltaTime);

        if(this.isShooting) {
            this.shootTimer -= deltaTime;

            this.shootAnimation.update(deltaTime);

            if(this.shootTimer <= 0) {
                this.shootTimer = 0;
                this.isShooting = false;

                this.shootAnimation.stop();
            }
        }

    }

    draw(ctx) {

        if (this.isShooting) {
    
            const frame = this.shootAnimation.getCurrentFrame();
    
            this.spriteFrente.drawFrame(
                ctx,
                frame,
                this.x,
                this.y,
                this.angle
            );
    
            return;
        }
    
        const frame = this.walkAnimation.getCurrentFrame();
    
        this.spriteFrente.drawFrame(
            ctx,
            frame,
            this.x,
            this.y,
            this.angle
        );
    
    }
    lookAt(mouseX, mouseY) {

        const centerX = this.x + this.spriteFrente.width / 2;
        const centerY = this.y + this.spriteFrente.height / 2;
    
        this.angle = Math.atan2(
            mouseY - centerY,
            mouseX - centerX
        );
    
    }

    getGunPosition() {

        const centerX = this.x + this.spriteFrente.width / 2;
        const centerY = this.y + this.spriteFrente.height / 2;

        const forward = 32;
        const side = 0;

        const gunX =
            centerX +
            Math.cos(this.angle) * forward -
            Math.sin(this.angle) * side;

        const gunY =
            centerY +
            Math.sin(this.angle) * forward +
            Math.cos(this.angle) * side;

        return {
            x: gunX,
            y: gunY
        };
    }

    startShooting() {

        this.isShooting = true;
        this.shootTimer = this.shootDuration;

        this.shootAnimation.play();
    }
}
