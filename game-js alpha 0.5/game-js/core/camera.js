export class Camera {

    constructor(width, height) {
        this.x = 0;
        this.y = 0;

        this.width = width;
        this.height = height;
    }

    follow(player) {

        this.x = player.x - this.width / 2 + 23;
        this.y = player.y - this.height / 2 + 32;
    
        // Limite esquerdo
        this.x = Math.max(0, this.x);
    
        // Limite superior
        this.y = Math.max(0, this.y);
    
        // Limite direito
        this.x = Math.min(
            6020 - this.width,
            this.x
        );
    
        // Limite inferior
        this.y = Math.min(
            3360 - this.height,
            this.y
        );
    
    }

}