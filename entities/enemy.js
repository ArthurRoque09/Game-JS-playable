export class Enemy {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.width = 40;
        this.height = 40;

        this.health = 100;

        // IA
        this.state = "idle";

        this.speed = 2;

        this.visionRange = 2000;
        this.loseTargetRange = 2500;

        this.lastSeenX = null;
        this.lastSeenY = null;

        this.searchTimer = 0;
        this.searchDuration = 1500;

        this.attackRange = 50;

        this.attackCooldown = 800;
        this.lastAttackTime = 0;
    }


    update(player, colliders) {

        const dx = player.x - this.x;
        const dy = player.y - this.y;
    
        const distance = Math.sqrt(
            dx * dx + dy * dy
        );
    
        // Verifica se existe parede entre o inimigo e o player
        const canSeePlayer = this.hasLineOfSight(
            player,
            colliders
        );
    
        // Se estiver vendo o player, guarda a última posição dele
        if (canSeePlayer) {
    
            this.lastSeenX = player.x;
            this.lastSeenY = player.y;
    
            this.searchTimer = this.searchDuration;
        }
    
        this.chooseState(
            distance,
            canSeePlayer
        );
    
        if (this.state === "idle") {
            return;
        }
    
        if (this.state === "chase") {
            this.chasePlayer(player, colliders);
        }
    
        if (this.state === "attack") {
            this.attackPlayer(player);
        }
    }


    chooseState(distance, canSeePlayer) {

        if (
            distance <= this.attackRange &&
            canSeePlayer
        ) {
            this.state = "attack";
            return;
        }
    
        if (
            distance <= this.visionRange &&
            canSeePlayer
        ) {
            this.state = "chase";
            return;
        }
    
        this.state = "idle";
    }

    hasLineOfSight(player, colliders) {

        const startX = this.x + this.width / 2;
        const startY = this.y + this.height / 2;
    
        const endX = player.x + 32;
        const endY = player.y + 32;
    
        const dx = endX - startX;
        const dy = endY - startY;
    
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // testa vários pontos ao longo da linha
        const steps = Math.ceil(distance / 10);
    
        for (let i = 0; i <= steps; i++) {
    
            const t = i / steps;
    
            const pointX = startX + dx * t;
            const pointY = startY + dy * t;
    
            for (const wall of colliders) {
    
                if (
                    pointX >= wall.x &&
                    pointX <= wall.x + wall.width &&
                    pointY >= wall.y &&
                    pointY <= wall.y + wall.height
                ) {
                    return false;
                }
            }
        }
    
        return true;
    }


    chasePlayer(player, colliders) {

        let dx = player.x - this.x;
        let dy = player.y - this.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance === 0) {
            return;
        }

        // normaliza direção
        dx /= distance;
        dy /= distance;

        const oldX = this.x;
        const oldY = this.y;

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // colisão com paredes
        if (this.checkWallCollision(colliders)) {
            this.x = oldX;
            this.y = oldY;
        }
    }


    checkWallCollision(colliders) {

        for (const wall of colliders) {

            if (
                this.x < wall.x + wall.width &&
                this.x + this.width > wall.x &&
                this.y < wall.y + wall.height &&
                this.y + this.height > wall.y
            ) {
                return true;
            }
        }

        return false;
    }


    attackPlayer(player) {

        const now = Date.now();

        if (
            now - this.lastAttackTime <
            this.attackCooldown
        ) {
            return;
        }

        this.lastAttackTime = now;

        console.log("Inimigo atacou!");

        // Depois criaremos:
        //
        // player.takeDamage(10);
    }


    takeDamage(damage) {

        this.health -= damage;
    }


    draw(ctx) {

        ctx.fillStyle =
            this.state === "chase"
                ? "orange"
                : "red";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // barra de vida
        ctx.fillStyle = "black";

        ctx.fillRect(
            this.x,
            this.y - 10,
            this.width,
            5
        );

        ctx.fillStyle = "lime";

        ctx.fillRect(
            this.x,
            this.y - 10,
            this.width * (this.health / 100),
            5
        );
    }
}