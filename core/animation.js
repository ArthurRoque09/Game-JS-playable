export class Animation {

    constructor(sprite, frames, frameDuration = 100) {

        this.sprite = sprite;

        // Lista dos frames do spritesheet
        this.frames = frames;

        // Tempo de cada frame em milissegundos
        this.frameDuration = frameDuration;

        this.currentFrame = 0;
        this.timer = 0;

        this.playing = false;
    }

    play() {
        this.playing = true;
    }

    stop() {
        this.playing = false;
        this.currentFrame = 0;
        this.timer = 0;
    }

    update(deltaTime) {

        if (!this.playing)
            return;

        this.timer += deltaTime;

        if (this.timer >= this.frameDuration) {

            this.timer -= this.frameDuration;

            this.currentFrame++;

            if (this.currentFrame >= this.frames.length) {
                this.currentFrame = 0;
            }

        }

    }

    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }

}