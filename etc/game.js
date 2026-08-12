import { Player } from "../entities/player.js";
import { Enemy } from "../entities/enemy.js";
import { Bullet } from "../weapons/bullet.js";
import { Map } from "./mapa.js";
import { Camera } from "../core/camera.js"
import { Wall } from "../entities/wall.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};
const bullets = [];

const camera = new Camera (canvas.width, canvas.height);

const map = new Map("./assets/Mapa.png")

const MAP_SCALE = 2.5;

const MAP_WIDTH = 1248 * MAP_SCALE;
const MAP_HEIGHT = 864 * MAP_SCALE;

const player = new Player(
    230 * MAP_SCALE, 
    55 * MAP_SCALE
);

function wall(x, y, width, height) {

    return new Wall(
        x * MAP_SCALE,
        y * MAP_SCALE,
        width * MAP_SCALE,
        height * MAP_SCALE
    );

}

const walls = [

    // =========================
    // SALA INICIAL - TOPO
    // =========================

    wall(175,   0, 10, 120),   // esquerda
    wall(315,   0, 10, 120),   // direita
    wall(175,   0, 150, 10),   // topo

    // parte inferior, deixando abertura da porta
    wall(175, 110, 40, 10),
    wall(270, 110, 55, 10),


    // =========================
    // PAREDES EXTERNAS
    // =========================

    wall(0, 120, 205, 12),        // topo esquerdo
    wall(315, 120, 385, 12),      // topo central
    wall(700, 120, 530, 12),      // topo direito

    wall(0, 120, 12, 690),        // lateral esquerda

    wall(1220, 100, 12, 760),     // lateral direita inferior

    wall(0, 805, 1200, 12),      // inferior direita


    // =========================
    // SALA SUPERIOR ESQUERDA
    // =========================

    wall(160, 120, 12, 170),      // vertical direita

    wall(160, 280, 220, 12),      // parede inferior


    // =========================
    // CORREDOR CENTRAL SUPERIOR
    // =========================

    // esquerda do corredor
    wall(375, 280, 12, 50),
    wall(375, 385, 12, 65),

    // direita do corredor
    wall(525, 280, 12, 50),
    wall(525, 385, 12, 65),


    // =========================
    // SALA SUPERIOR DIREITA
    // =========================

    wall(695, 120, 12, 170),      // parede superior vertical

    wall(530, 280, 170, 12),      // topo esquerdo
    wall(700, 280, 105, 12),      // topo direito

    wall(795, 280, 12, 50),
    wall(795, 385, 12, 65),       // direita

    wall(530, 440, 110, 12),      // parte inferior esquerda
    wall(640, 440, 165, 12),      // parte inferior direita


    // =========================
    // GRANDE SALA CREME ESQUERDA
    // =========================

    wall(80, 435, 12, 65),        // pequeno recuo esquerdo

    wall(0, 490, 385, 12),        // inferior da sala


    // =========================
    // SALA VERDE CENTRAL
    // =========================

    wall(375, 440, 50, 12),
    wall(480, 440, 165, 12),

    wall(375, 440, 12, 165),      // esquerda
    wall(635, 440, 12, 165),      // direita

    wall(375, 595, 150, 12),
    wall(590, 595, 55, 12),       // inferior, deixando passagem


    // =========================
    // SALA BRANCA SUPERIOR
    // =========================

    wall(0, 490, 385, 12),        // topo

    wall(375, 490, 12, 115),      // direita

    wall(160, 650, 220, 12),      // inferior


    // =========================
    // SALA BRANCA INFERIOR
    // =========================

    wall(375, 650, 12, 55),
    wall(375, 760, 12, 50),       // direita, com abertura


    // =========================
    // SALA DE TIJOLOS INFERIOR
    // =========================

    wall(375, 595, 150, 12),
    wall(590, 595, 55, 12),

    wall(640, 650, 165, 12),      // topo direita

    wall(795, 650, 12, 55),
    wall(795, 760, 12, 55),       // direita, abertura no meio

    wall(375, 805, 155, 12),
    wall(640, 805, 165, 12),      // inferior


    // =========================
    // DIVISÃO PARA ÁREA CINZA
    // =========================

    wall(640, 440, 12, 60),
    wall(640, 595, 12, 65),

    wall(640, 650, 165, 12),
];

const obstacles = [

    // Bancadas superiores
    wall(955, 245, 135, 38),
    wall(1090, 245, 130, 38),

    wall(955, 335, 135, 38),
    wall(1090, 335, 130, 38),

    // Bancadas inferiores
    wall(935, 625, 40, 135),
    wall(1095, 625, 40, 135)

];

const colliders = [
    ...walls,
    ...obstacles
];

let mouseX = 0;
let mouseY = 0;
let mousePressed = false;

canvas.addEventListener("mousemove", (e) => {

    const rect = canvas.getBoundingClientRect();

    mouseX = e.clientX - rect.left + camera.x;
    mouseY = e.clientY - rect.top + camera.y;

});

const enemies = [];

const enemySpawnPoints = [

    // Sala grande esquerda
    { x: 80, y: 200 },
    { x: 120, y: 350 },
    { x: 280, y: 400 },

    // Corredor central
    { x: 440, y: 200 },
    { x: 450, y: 350 },

    // Sala superior direita
    { x: 600, y: 200 },
    { x: 720, y: 350 },

    // Sala verde
    { x: 450, y: 520 },

    // Salas inferiores
    { x: 200, y: 570 },
    { x: 200, y: 720 },

    // Tijolos inferiores
    { x: 480, y: 700 },
    { x: 700, y: 730 },

    // Área cinza
    { x: 850, y: 180 },
    { x: 900, y: 450 },
    { x: 1050, y: 500 },
    { x: 1150, y: 700 }
];

function spawnEnemies(amount) {

    const availableSpawns = [...enemySpawnPoints];

    for (let i = 0; i < amount; i++) {

        if (availableSpawns.length === 0) {
            break;
        }

        const randomIndex = Math.floor(
            Math.random() * availableSpawns.length
        );

        const spawn = availableSpawns[randomIndex];

        enemies.push(
            new Enemy(
                spawn.x * MAP_SCALE,
                spawn.y * MAP_SCALE
            )
        );

        // Remove esse spawn das possibilidades
        availableSpawns.splice(randomIndex, 1);
    }
}

function updateEnemies() {

    for (let i = 0; i < enemies.length; i++) {

        enemies[i].update(
            player,
            colliders
        );

        if (enemies[i].health <= 0) {

            enemies.splice(i, 1);
            i--;
        }
    }
}

function drawEnemies() {

    for (const enemy of enemies) {
        enemy.draw(ctx);
    }

}

// controle de tiro
let lastShotTime = 0;

const weapons = {
    PISTOLA: {
        automatic: false,
        shotCooldown: 400,
        shootDuration: 180,
        bulletSpeed: 20,
        damage: 100
    }
};

let ammo = 30;
let maxAmmo = 30;

let currentWeapon = "PISTOLA";




window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

canvas.addEventListener("mousedown", () => {

    mousePressed = true;

    shoot();

});

canvas.addEventListener("mouseup", () => {
    mousePressed = false;
});

canvas.addEventListener("mouseleave", () => {
    mousePressed = false;
});

function shoot() {

    const now = Date.now();
    const weapon = weapons[currentWeapon];

    if (now - lastShotTime < weapon.shotCooldown) {
        return;
    }

    if (ammo <= 0) {
        return;
    }

    const gunPosition = player.getGunPosition();

    const startX = gunPosition.x;
    const startY = gunPosition.y;

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
        return;
    }

    dx /= distance;
    dy /= distance;

    bullets.push(
        new Bullet(
            startX,
            startY,
            dx * weapon.bulletSpeed,
            dy * weapon.bulletSpeed,
            weapon.damage
        )
    );

    ammo--;

    lastShotTime = now;

    player.startShooting(weapon.shootDuration);
}

function updateBullets() {

    for (let i = 0; i < bullets.length; i++) {

        const bullet = bullets[i];

        bullet.update();

        let hitWall = false;

        for (const wall of colliders) {

            if (
                bullet.x + bullet.radius > wall.x &&
                bullet.x - bullet.radius < wall.x + wall.width &&
                bullet.y + bullet.radius > wall.y &&
                bullet.y - bullet.radius < wall.y + wall.height
            ) {

                hitWall = true;
                break;
            }
        }

        if (
            hitWall ||
            bullet.x < 0 ||
            bullet.x > MAP_WIDTH ||
            bullet.y < 0 ||
            bullet.y > MAP_HEIGHT
        ) {

            bullets.splice(i, 1);
            i--;

        }
    }
}

function drawBullets(){

    for(const bullet of bullets){

        bullet.draw(ctx);

    }

}

function checkBulletCollision() {

    for (let i = 0; i < bullets.length; i++) {

        const bullet = bullets[i];

        for (let j = 0; j < enemies.length; j++) {

            const enemy = enemies[j];

            if (

                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemy.height

            ) {

                enemy.takeDamage(bullet.damage);

                bullets.splice(i, 1);

                i--;

                break;

            }

        }

    }

}

function drawHUD() {

    const boxWidth = 180;
    const boxHeight = 90;

    const boxX = canvas.width - boxWidth - 25;
    const boxY = canvas.height - boxHeight - 25;

    // Fundo da caixa
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Borda
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Munição
    ctx.fillStyle = ammo <= 5 ? "red" : "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        ammo,
        boxX + boxWidth / 2,
        boxY + 48
    );

    // Nome da arma
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";

    ctx.fillText(
        currentWeapon,
        boxX + boxWidth / 2,
        boxY + 73
    );

    // Volta o alinhamento normal
    ctx.textAlign = "left";

    if (enemies.length === 0) {

        ctx.fillStyle = "white";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
    
        ctx.fillText(
            "ÁREA LIMPA",
            canvas.width / 2,
            canvas.height / 2
        );
    
    }

}

function update(deltaTime) {

    const oldX = player.x;
    const oldY = player.y;

    player.update(keys, deltaTime);

    checkPlayerWallCollision(oldX, oldY);

    player.lookAt(mouseX, mouseY);


    if (
    mousePressed &&
    weapons[currentWeapon].automatic
) {
    shoot();
}

    camera.follow(player);

    updateBullets();

    updateEnemies();

    checkBulletCollision();

}

function checkPlayerWallCollision(oldX, oldY) {

    for (const wall of colliders){

        if (
            player.x < wall.x + wall.width &&
            player.x + 64 > wall.x &&
            player.y < wall.y + wall.height &&
            player.y + 64 > wall.y
        ) {

            player.x = oldX;
            player.y = oldY;

            return;
        }

    }

}

function checkCollision(entity) {

    for (const wall of colliders) {

        if (
            entity.x < wall.x + wall.width &&
            entity.x + 64 > wall.x &&
            entity.y < wall.y + wall.height &&
            entity.y + 64 > wall.y
        ) {
            return true;
        }

    }

    return false;
}

function render(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.save();

    ctx.translate(-camera.x,-camera.y);

    map.draw(ctx);
    
    /*for (const wall of colliders) {
    wall.drawDebug(ctx);
    }*/

    player.draw(ctx);

    drawBullets();

    drawEnemies();

    ctx.restore();

    drawHUD();

}

let lastTime = 0;

function gameLoop(timestamp) {

    const deltaTime = timestamp - lastTime;

    lastTime = timestamp;

    update(deltaTime);

    render();

    requestAnimationFrame(gameLoop);

}

spawnEnemies(8);

requestAnimationFrame(gameLoop);
