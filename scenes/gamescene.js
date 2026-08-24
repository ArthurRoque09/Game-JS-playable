import { Enemy } from "../entities/enemy.js";
import { Player } from "../entities/player.js";

import { GroundWeapon } from "../weapons/groundWeapon.js";
import { WEAPONS } from "../weapons/weaponsData.js";

import { MAP_WALLS, SPAWN_SOFA } from "../world/mapWalls.js";

import { NavigationGrid } from "../systems/navigationGrid.js";
import { Pathfinder } from "../systems/pathfinder.js";

// =========================
// INIMIGOS - BUILDING 3
// COORDENADAS NA ESCALA ORIGINAL
// =========================

const FLOOR_3_ENEMIES = [

    // Primeiro inimigo fixo.
    // Fica de costas para o player.

    {
        id: "TUTORIAL",

        x: 570,
        y: 280,

        weapon: "PISTOLA",

        facingDegrees: 90
    },


    {
        id: "UPPER_HALL_LEFT",

        x: 760,
        y: 310,

        weapon: "PISTOLA",

        facingDegrees: 0
    },

    {
        id: "UPPER_OFFICE",

        x: 850,
        y: 150,

        weapon: "PISTOLA",

        facingDegrees: 90
    },


    // Corredor central.

    {
        id: "CENTER_HALL",

        x: 850,
        y: 550,

        weapon: "PISTOLA",

        facingDegrees: 90
    },


    // Corredor lateral direito.

    {
        id: "RIGHT_HALL",

        x: 1370,
        y: 450,

        weapon: "DOZE",

        facingDegrees: 270
    },


    // Setor esquerdo inferior.

    {
        id: "LOWER_LEFT",

        x: 450,
        y: 780,

        weapon: "FACAO",

        facingDegrees: 270
    },


    // Corredor entre as fileiras de mesas.

    {
        id: "LOWER_CENTER_LEFT",

        x: 830,
        y: 745,

        weapon: "PISTOLA",

        facingDegrees: 0
    },


    {
        id: "LOWER_CENTER_RIGHT",

        x: 1145,
        y: 745,

        weapon: "DOZE",

        facingDegrees: 180
    }
];


// =========================
// GAME SCENE
// =========================

export class GameScene extends Phaser.Scene {

    constructor() {

        super(
            "GameScene"
        );
    }


    // =========================
    // PRELOAD
    // =========================

    preload() {

        this.load.on(
            "loaderror",

            (file) => {

                console.error(
                    "ÁUDIO OU ASSET NÃO ENCONTRADO:",
                    file.key,
                    file.src
                );
            }
        );

        this.load.audio(
            "deathSound",
            "./assets/sounds/Death.mp3"
        );

        this.load.audio(
            "pistolShot",
            "./assets/sounds/pistol-shot.mp3"
        );

        this.load.audio(
            "shotgunShot",
            "./assets/sounds/shotgun-shot.mp3"
        );

        this.load.audio(
            "rifleShot",
            "./assets/sounds/rifle-shot.mp3"
        );

        this.load.audio(
            "macheteSwing",
            "./assets/sounds/machete-slice.mp3"
        );

        this.load.image(
            "building3",
            "./assets/maps-menu/predio 3.png"
        );

        this.load.image(
            "building2",
            "./assets/maps-menu/predio 2.png"
        );

        this.load.image(
            "building1",
            "./assets/maps-menu/predio 1.png"
        );

        this.load.image(
            "lab",
            "./assets/maps-menu/laboratorio.png"
        );

        this.load.image(
            "rpd",
            "./assets/maps-menu/delegacia.png"
        );


        this.load.image(
            "playerSheet",
            "./assets/spritesheets/spritesheet-player.png"
        );

        this.load.image(
            "enemySheet",
            "./assets/spritesheets/spritesheet-enemy.png"
        );

        this.load.image(
            "weaponSheet",
            "./assets/spritesheets/weapon-spritesheet.png"
        );
    }


    // =========================
    // CREATE
    // =========================

    create() {

        // =========================
        // ENTRADA DA FASE
        // =========================

        this.isRestarting =
            false;


        this.cameras.main.fadeIn(
            120,
            0,
            0,
            0
        );

        this.gameWon =
            false;

        // =========================
        // SOM APÓS A MORTE
        // =========================

        if (
            this.registry.get(
                "playerDied"
            ) === true
        ) {

            if (
                this.cache.audio.exists(
                    "deathSound"
                )
            ) {

                this.sound.play(
                    "deathSound",
                    {
                        seek: 1.2,
                        volume: 1
                    }
                );
            }


            this.registry.set(
                "playerDied",
                false
            );
        }

        // =========================
        // CONFIGURAÇÕES
        // =========================

        this.MAP_SCALE =
            2;


        this.DEBUG_COLLIDERS =
            false;

        // =========================
        // TESTE DE POSICIONAMENTO
        // =========================

        this.ENEMY_AI_ENABLED =
            true;


        this.DEBUG_ENEMY_POSITIONS =
            false;


        // Exibe os cones durante o teste.

        this.DEBUG_ENEMY_VISION =
            false;


        this.ENEMY_COUNT =
            FLOOR_3_ENEMIES.length;

        // Distância mínima entre
        // spawn do player e inimigo.

        this.MIN_ENEMY_SPAWN_DISTANCE =
            500;


        // =========================
        // MAPA
        // =========================

        this.createMap();


        // =========================
        // PAREDES
        // =========================

        this.createWalls();


        // =========================
        // NAVEGAÇÃO
        // =========================

        this.createNavigation();


        // =========================
        // PLAYER
        // =========================

        this.player =
            new Player(
                this,

                SPAWN_SOFA.playerSpawnX *
                this.MAP_SCALE,

                SPAWN_SOFA.playerSpawnY *
                this.MAP_SCALE,

                this.walls
            );


        // =========================
        // BALAS
        // =========================

        this.createBullets();


        // =========================
        // ARMAS NO CHÃO
        // TEMPORARIAMENTE VAZIO
        // =========================

        this.createGroundWeapons();


        // =========================
        // INIMIGOS
        // TEMPORARIAMENTE VAZIO
        // =========================

        this.createEnemies();


        // =========================
        // COLISÕES
        // =========================

        this.createCollisions();

        // =========================
        // CÂMERA
        // =========================

        this.createCamera();


        // =========================
        // INPUT
        // =========================

        this.createInput();


        // =========================
        // HUD
        // =========================

        this.createHUD();

        // =========================
        // HUD DA MISSÃO
        // =========================

        this.createMissionHUD();

        // =========================
        // ESCADAS ESPECIAIS
        // =========================

        this.createSpecialStairSystem();
    }

    // =========================
    // DROP DE ARMA DO INIMIGO
    // =========================

    dropEnemyWeapon(
        x,
        y,
        weaponKey,
        enemyWeapon,
        enemyAngle
    ) {

        if (
            weaponKey === "FACAO"
        ) {

            return;
        }


        const weaponData =
            WEAPONS[
            weaponKey
            ];


        if (
            !weaponData
        ) {

            return;
        }


        // =========================
        // MUNIÇÃO DA ARMA DROPADA
        // =========================

        let ammo =
            weaponData.magazineSize;


        if (
            enemyWeapon &&
            typeof enemyWeapon.ammo === "number"
        ) {

            ammo =
                enemyWeapon.ammo;
        }


        // =========================
        // CRIA ARMA NO CHÃO
        // =========================

        const groundWeapon =
            new GroundWeapon(
                this,
                x,
                y,
                weaponKey,
                weaponData,
                ammo
            );


        this.groundWeapons.add(
            groundWeapon
        );

        groundWeapon.dropFromEnemy(
            enemyAngle,
            this.walls
        );
    }


    // =========================
    // CRIA MAPA
    // =========================

    createMap() {

        this.map =
            this.add.image(
                0,
                0,
                "building3"
            );


        this.map.setOrigin(
            0,
            0
        );


        this.map.setScale(
            this.MAP_SCALE
        );


        this.mapWidth =
            this.map.displayWidth;


        this.mapHeight =
            this.map.displayHeight;


        this.physics.world.setBounds(
            0,
            0,
            this.mapWidth,
            this.mapHeight
        );


        console.log(
            "MAPA:",
            this.mapWidth,
            this.mapHeight
        );
    }


    // =========================
    // CRIA PAREDES
    // =========================

    createWalls() {

        this.walls =
            this.physics.add.staticGroup();


        for (
            const wallData
            of MAP_WALLS
        ) {

            const x =
                wallData.x *
                this.MAP_SCALE;


            const y =
                wallData.y *
                this.MAP_SCALE;


            const width =
                wallData.width *
                this.MAP_SCALE;


            const height =
                wallData.height *
                this.MAP_SCALE;


            this.createWall(
                wallData.id,

                x +
                width / 2,

                y +
                height / 2,

                width,
                height
            );
        }


        this.createSpawnSofaCollision();
    }

    // =========================
    // COLISÃO DO SOFÁ INICIAL
    // =========================

    createSpawnSofaCollision() {

        const scale =
            this.MAP_SCALE;


        const x =
            SPAWN_SOFA.x *
            scale;


        const y =
            SPAWN_SOFA.y *
            scale;


        const width =
            SPAWN_SOFA.width *
            scale;


        const height =
            SPAWN_SOFA.height *
            scale;


        this.spawnSofa =
            this.createWall(
                SPAWN_SOFA.id,

                x +
                width / 2,

                y +
                height / 2,

                width,
                height
            );


        // O player começa sobre o sofá.
        // Portanto, o corpo sólido começa desligado.

        this.spawnSofa.body.enable =
            false;


        const padding =
            SPAWN_SOFA.exitPadding *
            scale;


        // Área ligeiramente maior usada
        // apenas para detectar a saída.

        this.spawnSofaExitArea =
            new Phaser.Geom.Rectangle(
                x - padding,
                y - padding,

                width +
                padding * 2,

                height +
                padding * 2
            );


        this.playerLeftSpawnSofa =
            false;
    }


    // =========================
    // SISTEMA DE NAVEGAÇÃO
    // =========================

    createNavigation() {

        this.navigationGrid =
            new NavigationGrid(
                this.mapWidth,
                this.mapHeight,
                this.walls,

                {
                    cellSize: 32,

                    padding: 20
                }
            );


        this.pathfinder =
            new Pathfinder(
                this.navigationGrid
            );
    }


    // =========================
    // CRIA UMA PAREDE
    // =========================

    createWall(
        id,
        x,
        y,
        width,
        height
    ) {

        const alpha =
            this.DEBUG_COLLIDERS
                ? 0.35
                : 0;


        const wall =
            this.add.rectangle(
                x,
                y,
                width,
                height,
                0xff0000,
                alpha
            );


        this.physics.add.existing(
            wall,
            true
        );


        this.walls.add(
            wall
        );


        // =========================
        // DEBUG VISUAL
        // =========================

        if (
            this.DEBUG_COLLIDERS
        ) {

            const label =
                this.add.text(
                    x,
                    y,

                    `W${id}`,

                    {
                        fontSize:
                            "18px",

                        color:
                            "#ffff00",

                        backgroundColor:
                            "#000000"
                    }
                );


            label.setOrigin(
                0.5
            );
        }


        return wall;
    }


    // =========================
    // BALAS
    // =========================

    createBullets() {

        this.bullets =
            this.physics.add.group();
    }

    // =========================
    // VERIFICA VITÓRIA
    // =========================

    checkVictory() {

        if (
            this.gameWon
        ) {

            return;
        }


        let enemiesAlive =
            0;


        this.enemies.children.iterate(
            (enemy) => {

                if (
                    enemy &&
                    enemy.active &&
                    !enemy.dead
                ) {

                    enemiesAlive++;
                }
            }
        );


        if (
            enemiesAlive === 0
        ) {

            this.showVictoryScreen();
        }
    }


    // =========================
    // ARMAS NO CHÃO
    // =========================

    createGroundWeapons() {

        this.groundWeapons =
            this.physics.add.group();


        const macheteData =
            WEAPONS.FACAO;


        if (
            !macheteData
        ) {

            console.warn(
                "Dados do FACAO não encontrados."
            );

            return;
        }


        // Centro da restCoffeeTable.
        // Coordenadas na escala original:
        // x: 219
        // y: 239

        const tableMachete =
            new GroundWeapon(
                this,

                219 *
                this.MAP_SCALE,

                239 *
                this.MAP_SCALE,

                "FACAO",
                macheteData,
                0
            );


        tableMachete.setRotation(
            -0.35
        );


        this.groundWeapons.add(
            tableMachete
        );
    }

    // =========================
    // PROCURA SPAWN DA ARMA
    // =========================

    findGroundWeaponSpawn() {

        const reachableCells =
            this.navigationGrid
                .getReachableCellsFrom(
                    this.player.x,
                    this.player.y
                );


        if (
            !reachableCells ||
            reachableCells.length === 0
        ) {

            return null;
        }


        const validCells =
            reachableCells.filter(
                (cell) => {

                    const position =
                        this.navigationGrid
                            .gridToWorld(
                                cell.col,
                                cell.row
                            );


                    const distance =
                        Phaser.Math.Distance.Between(
                            this.player.x,
                            this.player.y,
                            position.x,
                            position.y
                        );


                    // Não nasce em cima
                    // do player, mas também
                    // queremos encontrar ela
                    // facilmente no teste.

                    return (
                        distance >= 150 &&
                        distance <= 400
                    );
                }
            );


        if (
            validCells.length === 0
        ) {

            return null;
        }


        const cell =
            Phaser.Utils.Array.GetRandom(
                validCells
            );


        return (
            this.navigationGrid
                .gridToWorld(
                    cell.col,
                    cell.row
                )
        );
    }


    // =========================
    // CRIA INIMIGOS
    // =========================

    createEnemies() {

        this.enemies =
            this.physics.add.group();


        for (
            const enemyData
            of FLOOR_3_ENEMIES
        ) {

            const enemy =
                this.spawnEnemy(
                    enemyData.x *
                    this.MAP_SCALE,

                    enemyData.y *
                    this.MAP_SCALE,

                    enemyData.weapon,

                    enemyData.facingDegrees
                );


            enemy.spawnId =
                enemyData.id;


            // =========================
            // IDENTIFICAÇÃO VISUAL
            // =========================

            if (
                this.DEBUG_ENEMY_POSITIONS
            ) {

                const label =
                    this.add.text(
                        enemy.x,
                        enemy.y - 45,

                        `${enemyData.id}\n${enemyData.weapon}`,

                        {
                            fontSize:
                                "15px",

                            color:
                                "#ffff00",

                            backgroundColor:
                                "#000000",

                            align:
                                "center",

                            padding: {
                                x: 4,
                                y: 3
                            }
                        }
                    );


                label.setOrigin(
                    0.5
                );


                label.setDepth(
                    100
                );
            }
        }
    }

    // =========================
    // PROCURA SPAWN ALEATÓRIO
    // =========================

    findRandomEnemySpawn() {

        if (
            !this.enemySpawnCells ||
            this.enemySpawnCells.length === 0
        ) {

            return null;
        }


        const maxAttempts =
            200;


        for (
            let attempt = 0;
            attempt < maxAttempts;
            attempt++
        ) {

            const cell =
                Phaser.Utils.Array.GetRandom(
                    this.enemySpawnCells
                );


            const position =
                this.navigationGrid
                    .gridToWorld(
                        cell.col,
                        cell.row
                    );


            // =========================
            // DISTÂNCIA DO PLAYER
            // =========================

            const distanceFromPlayer =
                Phaser.Math.Distance.Between(
                    position.x,
                    position.y,
                    this.player.x,
                    this.player.y
                );


            if (
                distanceFromPlayer <
                this.MIN_ENEMY_SPAWN_DISTANCE
            ) {

                continue;
            }


            // =========================
            // DISTÂNCIA DE OUTRO INIMIGO
            // =========================

            let tooClose =
                false;


            this.enemies.children.iterate(
                (enemy) => {

                    if (
                        tooClose ||
                        !enemy ||
                        !enemy.active
                    ) {

                        return;
                    }


                    const distance =
                        Phaser.Math.Distance.Between(
                            position.x,
                            position.y,
                            enemy.x,
                            enemy.y
                        );


                    if (
                        distance <
                        80
                    ) {

                        tooClose =
                            true;
                    }
                }
            );


            if (
                tooClose
            ) {

                continue;
            }


            return {

                x:
                    position.x,

                y:
                    position.y
            };
        }


        return null;
    }


    // =========================
    // SPAWN DE INIMIGO
    // =========================

    spawnEnemy(
        x,
        y,
        weaponKey = null,
        facingDegrees = 0
    ) {

        const selectedWeapon =
            weaponKey ??
            this.getRandomEnemyWeapon();


        const enemy =
            new Enemy(
                this,
                x,
                y,
                selectedWeapon
            );


        enemy.angle =
            Phaser.Math.DegToRad(
                facingDegrees
            );


        enemy.updateRotation();


        this.enemies.add(
            enemy
        );


        return enemy;
    }

    // =========================
    // ARMA ALEATÓRIA DO INIMIGO
    // =========================

    getRandomEnemyWeapon() {

        const roll =
            Phaser.Math.Between(
                1,
                100
            );


        // 50% pistola
        if (
            roll <= 50
        ) {

            return "PISTOLA";
        }


        // 25% doze
        if (
            roll <= 75
        ) {

            return "DOZE";
        }


        // 15% rifle
        if (
            roll <= 90
        ) {

            return "RIFLE";
        }


        // 10% facão
        return "FACAO";
    }


    // =========================
    // COLISÕES
    // =========================

    createCollisions() {

        // =========================
        // BALAS x PAREDES
        // =========================

        this.physics.add.collider(
            this.bullets,
            this.walls,

            (bullet) => {

                if (
                    bullet.active
                ) {

                    bullet.destroy();
                }
            }
        );


        // =========================
        // INIMIGOS x PAREDES
        // =========================

        this.physics.add.collider(
            this.enemies,
            this.walls
        );


        // =========================
        // INIMIGOS x INIMIGOS
        // =========================

        this.physics.add.collider(
            this.enemies,
            this.enemies
        );


        // =========================
        // BALAS x INIMIGOS
        // =========================

        this.physics.add.overlap(
            this.bullets,
            this.enemies,

            (
                bullet,
                enemy
            ) => {

                this.hitEnemy(
                    bullet,
                    enemy
                );
            }
        );


        // =========================
        // BALAS x PLAYER
        // =========================

        this.physics.add.overlap(
            this.bullets,
            this.player.body,

            (
                object1,
                object2
            ) => {

                const bullet =
                    object1.owner !==
                        undefined

                        ? object1
                        : object2;


                this.hitPlayer(
                    bullet
                );
            }
        );
    }


    // =========================
    // DANO NO PLAYER
    // =========================

    hitPlayer(
        bullet
    ) {

        if (
            !bullet ||
            !bullet.active
        ) {

            return;
        }


        if (
            bullet.owner !==
            "enemy"
        ) {

            return;
        }


        const damage =
            bullet.damage;


        bullet.destroy();


        this.player.takeDamage(
            damage
        );
    }


    // =========================
    // DANO NO INIMIGO
    // =========================

    hitEnemy(
        bullet,
        enemy
    ) {

        if (
            !bullet.active ||
            !enemy.active
        ) {

            return;
        }


        // Bala de inimigo não
        // acerta outros inimigos.

        if (
            bullet.owner !==
            "player"
        ) {

            return;
        }


        const damage =
            bullet.damage;


        bullet.destroy();


        enemy.takeDamage(
            damage
        );
    }


    // =========================
    // CÂMERA
    // =========================

    createCamera() {

        this.cameras.main.setBounds(
            0,
            0,
            this.mapWidth,
            this.mapHeight
        );


        this.cameras.main.startFollow(
            this.player.body,
            true,
            0.1,
            0.1
        );

        this.cameras.main.setZoom(
            0.85
        );
    }

    // =========================
    // MORTE DO PLAYER
    // =========================

    handlePlayerDeath() {

        if (
            this.isRestarting
        ) {

            return;
        }


        this.isRestarting =
            true;


        // =========================
        // PARA INIMIGOS
        // =========================

        if (
            this.enemies
        ) {

            this.enemies.children.iterate(
                (enemy) => {

                    if (
                        !enemy ||
                        !enemy.active
                    ) {

                        return;
                    }


                    if (
                        typeof enemy.stop ===
                        "function"
                    ) {

                        enemy.stop();
                    }


                    if (
                        enemy.body
                    ) {

                        enemy.body.setVelocity(
                            0,
                            0
                        );
                    }
                }
            );
        }


        // =========================
        // PARA BALAS
        // =========================

        if (
            this.bullets
        ) {

            this.bullets.children.iterate(
                (bullet) => {

                    if (
                        !bullet ||
                        !bullet.active ||
                        !bullet.body
                    ) {

                        return;
                    }


                    bullet.body.setVelocity(
                        0,
                        0
                    );
                }
            );
        }


        // =========================
        // ESPERA NO CADÁVER
        // =========================

        this.time.delayedCall(
            900,

            () => {

                // =========================
                // FADE PRETO
                // =========================

                this.cameras.main.fadeOut(
                    250,
                    0,
                    0,
                    0
                );


                // =========================
                // TERMINOU FADE
                // =========================

                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events
                        .FADE_OUT_COMPLETE,

                    () => {

                        this.registry.set(
                            "playerDied",
                            true
                        );


                        this.scene.restart();
                    }
                );
            }
        );
    }
    // =========================
    // AVISA INIMIGOS PRÓXIMOS
    // =========================

    emitNoise(
        x,
        y,
        radius,
        source = null
    ) {

        if (
            !this.enemies ||
            !Number.isFinite(radius) ||
            radius <= 0
        ) {

            return;
        }


        let enemiesAlerted =
            0;


        this.enemies.children.iterate(
            (enemy) => {

                if (
                    !enemy ||
                    !enemy.active ||
                    enemy.dead
                ) {

                    return;
                }


                // Caso futuramente seja enviado
                // o próprio objeto do inimigo.

                if (
                    enemy === source
                ) {

                    return;
                }


                const distance =
                    Phaser.Math.Distance.Between(
                        x,
                        y,
                        enemy.x,
                        enemy.y
                    );


                if (
                    distance > radius
                ) {

                    return;
                }


                if (
                    typeof enemy.hearNoise !==
                    "function"
                ) {

                    return;
                }


                const acceptedNoise =
                    enemy.hearNoise(
                        x,
                        y
                    );


                if (
                    acceptedNoise
                ) {

                    enemiesAlerted++;


                    if (
                        this.alertedEnemies
                    ) {

                        this.alertedEnemies.add(
                            enemy
                        );
                    }
                }
            }
        );


        const sourceName =
            source === "enemy"
                ? "INIMIGO"
                : this.player?.currentWeapon ??
                "DESCONHECIDO";


        console.log(
            "BARULHO EMITIDO:",
            sourceName,
            "RAIO:",
            radius,
            "INIMIGOS ALERTADOS:",
            enemiesAlerted
        );
    }

    // =========================
    // TIRO AUTOMÁTICO
    // =========================

    updateAutomaticFire() {

        if (
            !this.player ||
            !this.player.weapon ||
            this.player.dead
        ) {

            return;
        }


        if (
            !this.player.weapon.automatic
        ) {

            return;
        }


        const pointer =
            this.input.activePointer;


        if (
            !pointer.isDown
        ) {

            return;
        }


        this.player.shoot(
            this.bullets
        );
    }

    // =========================
    // TELA DE VITÓRIA
    // =========================

    showVictoryScreen() {

        if (
            this.gameWon
        ) {

            return;
        }


        this.gameWon =
            true;


        // =========================
        // PARA O PLAYER
        // =========================

        this.player.body.setVelocity(
            0,
            0
        );


        // =========================
        // FUNDO ESCURO
        // =========================

        const background =
            this.add.rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.82
            );


        background
            .setOrigin(
                0,
                0
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                2000
            );


        // =========================
        // TÍTULO
        // =========================

        const title =
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 45,
                "SALA LIMPA",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "54px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff"
                }
            );


        title
            .setOrigin(
                0.5
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                2001
            );


        // =========================
        // SUBTÍTULO
        // =========================

        const subtitle =
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 25,
                "Todos os inimigos foram eliminados",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "22px",

                    color:
                        "#cccccc"
                }
            );


        subtitle
            .setOrigin(
                0.5
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                2001
            );
    }

    // =========================
    // SISTEMA DAS ESCADAS
    // =========================

    createSpecialStairSystem() {

        this.demoFinished =
            false;


        this.wrongStairWarningLocked =
            false;


        // Guarda cada inimigo uma única vez,
        // mesmo que seja alertado várias vezes.

        this.alertedEnemies =
            new Set();


        // =========================
        // SENSOR DA ESCADA ERRADA
        // =========================

        this.wrongStairTrigger =
            this.createWallTrigger(
                "lowerStairsInnerLeft",
                26
            );


        if (
            this.wrongStairTrigger
        ) {

            this.physics.add.overlap(
                this.player.body,
                this.wrongStairTrigger,
                () => {

                    this.showWrongStairWarning();
                }
            );
        }


        // =========================
        // SENSOR DO FIM DA DEMO
        // =========================

        this.demoEndTrigger =
            this.createWallTrigger(
                "stairsInnerTop",
                26
            );


        if (
            this.demoEndTrigger
        ) {

            this.physics.add.overlap(
                this.player.body,
                this.demoEndTrigger,
                () => {

                    this.showDemoEndScreen();
                }
            );
        }


        // =========================
        // HUD DA ESCADA ERRADA
        // =========================

        const warningBackground =
            this.add.rectangle(
                0,
                0,
                590,
                72,
                0x280000,
                0.94
            );


        warningBackground.setStrokeStyle(
            3,
            0xff3333,
            1
        );


        const warningText =
            this.add.text(
                0,
                0,
                "Escada errada! DESÇA!!",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "30px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff",

                    align:
                        "center"
                }
            );


        warningText.setOrigin(
            0.5
        );


        this.wrongStairHud =
            this.add.container(
                this.cameras.main.width / 2,
                65,

                [
                    warningBackground,
                    warningText
                ]
            );


        this.wrongStairHud
            .setScrollFactor(
                0
            )
            .setDepth(
                3000
            )
            .setAlpha(
                0
            )
            .setVisible(
                false
            );
    }


    // =========================
    // CRIA SENSOR SOBRE UMA PAREDE
    // =========================

    createWallTrigger(
        wallId,
        padding = 20
    ) {

        const wallData =
            MAP_WALLS.find(
                (wall) => {

                    return (
                        wall.id ===
                        wallId
                    );
                }
            );


        if (
            !wallData
        ) {

            console.warn(
                "Parede especial não encontrada:",
                wallId
            );

            return null;
        }


        const scale =
            this.MAP_SCALE;


        const triggerPadding =
            padding *
            scale;


        const x =
            (
                wallData.x +
                wallData.width / 2
            ) *
            scale;


        const y =
            (
                wallData.y +
                wallData.height / 2
            ) *
            scale;


        const width =
            wallData.width *
            scale +
            triggerPadding * 2;


        const height =
            wallData.height *
            scale +
            triggerPadding * 2;


        const trigger =
            this.add.zone(
                x,
                y,
                width,
                height
            );


        this.physics.add.existing(
            trigger,
            true
        );


        trigger.body.setSize(
            width,
            height
        );


        trigger.body.updateFromGameObject();


        return trigger;
    }


    // =========================
    // AVISO DA ESCADA ERRADA
    // =========================

    showWrongStairWarning() {

        if (
            this.demoFinished ||
            this.wrongStairWarningLocked
        ) {

            return;
        }


        this.wrongStairWarningLocked =
            true;


        this.tweens.killTweensOf(
            this.wrongStairHud
        );


        this.wrongStairHud
            .setVisible(
                true
            )
            .setAlpha(
                0
            );


        this.tweens.add({

            targets:
                this.wrongStairHud,

            alpha:
                1,

            duration:
                150,

            hold:
                1400,

            yoyo:
                true,

            onComplete:
                () => {

                    this.wrongStairHud.setVisible(
                        false
                    );


                    this.wrongStairWarningLocked =
                        false;
                }
        });
    }


    // =========================
    // ESTATÍSTICAS DA DEMO
    // =========================

    getDemoStatistics() {

        let remainingEnemies =
            0;


        if (
            this.enemies
        ) {

            this.enemies.children.iterate(
                (enemy) => {

                    if (
                        enemy &&
                        enemy.active &&
                        !enemy.dead
                    ) {

                        remainingEnemies++;
                    }
                }
            );
        }


        return {

            remainingEnemies:
                remainingEnemies,

            alertedEnemies:
                this.alertedEnemies
                    ? this.alertedEnemies.size
                    : 0
        };
    }


    // =========================
    // TELA DO FIM DA DEMO
    // =========================

    showDemoEndScreen() {

        if (
            this.demoFinished
        ) {

            return;
        }


        this.demoFinished =
            true;


        const statistics =
            this.getDemoStatistics();


        // =========================
        // PARA O JOGO
        // =========================

        if (
            this.player &&
            this.player.body
        ) {

            this.player.body.setVelocity(
                0,
                0
            );
        }


        this.physics.pause();


        // Evita que um reinício normal
        // reproduza o áudio de morte.

        this.registry.set(
            "playerDied",
            false
        );


        const screenWidth =
            this.cameras.main.width;


        const screenHeight =
            this.cameras.main.height;


        const centerX =
            screenWidth / 2;


        const centerY =
            screenHeight / 2;


        // =========================
        // FUNDO ESCURO
        // =========================

        const background =
            this.add.rectangle(
                0,
                0,
                screenWidth,
                screenHeight,
                0x000000,
                0.88
            );


        background
            .setOrigin(
                0,
                0
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                4000
            )
            .setInteractive();


        // =========================
        // PAINEL
        // =========================

        const panel =
            this.add.rectangle(
                centerX,
                centerY,
                720,
                470,
                0x171717,
                0.98
            );


        panel
            .setStrokeStyle(
                4,
                0xffffff,
                0.9
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                4001
            );


        // =========================
        // TÍTULO
        // =========================

        const title =
            this.add.text(
                centerX,
                centerY - 145,
                "FIM DA DEMO!",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "62px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff",

                    align:
                        "center"
                }
            );


        title
            .setOrigin(
                0.5
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                4002
            );


        // =========================
        // ESTATÍSTICAS
        // =========================

        const statisticsText =
            this.add.text(
                centerX,
                centerY - 25,

                `Inimigos restantes: ${statistics.remainingEnemies}\n` +
                `Inimigos alertados: ${statistics.alertedEnemies}`,

                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "28px",

                    color:
                        "#dddddd",

                    align:
                        "center",

                    lineSpacing:
                        14
                }
            );


        statisticsText
            .setOrigin(
                0.5
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                4002
            );


        // =========================
        // BOTÃO REINICIAR
        // =========================

        const restartButton =
            this.add.rectangle(
                centerX,
                centerY + 135,
                310,
                72,
                0x9d1f1f,
                1
            );


        restartButton
            .setStrokeStyle(
                3,
                0xffffff,
                1
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                4002
            )
            .setInteractive({
                useHandCursor:
                    true
            });


        const restartText =
            this.add.text(
                centerX,
                centerY + 135,
                "REINICIAR",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "28px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff"
                }
            );


        restartText
            .setOrigin(
                0.5
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                4003
            );


        restartButton.on(
            "pointerover",

            () => {

                restartButton.setFillStyle(
                    0xc42a2a,
                    1
                );
            }
        );


        restartButton.on(
            "pointerout",

            () => {

                restartButton.setFillStyle(
                    0x9d1f1f,
                    1
                );
            }
        );


        restartButton.on(
            "pointerdown",

            () => {

                if (
                    this.isRestarting
                ) {

                    return;
                }


                this.isRestarting =
                    true;


                this.registry.set(
                    "playerDied",
                    false
                );


                this.physics.resume();


                this.scene.restart();
            }
        );
    }

    // =========================
    // HUD DA MISSÃO
    // =========================

    createMissionHUD() {

        const hudWidth =
            380;


        const hudHeight =
            86;


        const marginTop =
            -60;


        const marginRight =
            -80;


        const hudX =
            this.cameras.main.width -
            hudWidth -
            marginRight;


        const hudY =
            marginTop;


        // =========================
        // FUNDO
        // =========================

        this.missionHudBackground =
            this.add.rectangle(
                hudX,
                hudY,
                hudWidth,
                hudHeight,
                0x050505,
                0.82
            );


        this.missionHudBackground
            .setOrigin(
                0,
                0
            )
            .setStrokeStyle(
                2,
                0xe6bd00,
                0.85
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                1200
            );


        // =========================
        // TÍTULO PEQUENO
        // =========================

        this.missionTitleText =
            this.add.text(
                hudX + 18,
                hudY + 11,
                "OBJETIVO",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "15px",

                    fontStyle:
                        "bold",

                    color:
                        "#b7b7b7"
                }
            );


        this.missionTitleText
            .setScrollFactor(
                0
            )
            .setDepth(
                1201
            );


        // =========================
        // TEXTO DA MISSÃO
        // =========================

        this.missionText =
            this.add.text(
                hudX + 18,
                hudY + 38,
                "FUJA DO PRÉDIO!",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "27px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffd900"
                }
            );


        this.missionText
            .setScrollFactor(
                0
            )
            .setDepth(
                1201
            );
    }


    // =========================
    // ALTERA A MISSÃO ATUAL
    // =========================

    updateMission(
        newMission
    ) {

        if (
            !this.missionText
        ) {

            return;
        }


        this.missionText.setText(
            newMission
        );


        // Pequeno efeito visual quando
        // um novo objetivo é recebido.

        this.tweens.killTweensOf(
            this.missionHudBackground
        );


        this.missionHudBackground.setAlpha(
            1
        );


        this.tweens.add({

            targets:
                this.missionHudBackground,

            alpha:
                0.82,

            duration:
                550,

            ease:
                "Quad.Out"
        });
    }


    // =========================
    // INPUT
    // =========================

    createInput() {

        this.interactKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            );


        // =========================
        // CLIQUE ÚNICO
        // =========================

        this.input.on(
            "pointerdown",

            (pointer) => {

                if (
                    !pointer.leftButtonDown()
                ) {

                    return;
                }

                if (
                    this.demoFinished ||
                    !this.player ||
                    !this.player.weapon ||
                    this.player.dead
                ) {

                    return;
                }


                // Armas automáticas serão
                // controladas pelo update.

                if (
                    this.player.weapon.automatic
                ) {

                    return;
                }


                this.player.shoot(
                    this.bullets
                );
            }
        );

    }
    // =========================
    // ARMA PRÓXIMA DO PLAYER
    // =========================

    getNearbyGroundWeapon() {

        if (
            !this.groundWeapons
        ) {

            return null;
        }


        let closestWeapon =
            null;


        let closestDistance =
            Infinity;


        const pickupRange =
            120;


        this.groundWeapons.children.iterate(
            (weapon) => {

                if (
                    !weapon ||
                    !weapon.active
                ) {

                    return;
                }


                const distance =
                    Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        weapon.x,
                        weapon.y
                    );


                if (
                    distance <= pickupRange &&
                    distance < closestDistance
                ) {

                    closestWeapon =
                        weapon;


                    closestDistance =
                        distance;
                }
            }
        );


        return closestWeapon;
    }

    // =========================
    // INTERAGE COM ARMA NO CHÃO
    // =========================

    interactWithGroundWeapon() {

        const groundWeapon =
            this.getNearbyGroundWeapon();


        if (
            !groundWeapon
        ) {

            return;
        }


        const newWeaponKey =
            groundWeapon.getWeaponKey();


        const newWeaponData =
            groundWeapon.getWeaponData();


        const newWeaponAmmo =
            groundWeapon.getAmmo();


        // =========================
        // FACÃO PERMANENTE
        // =========================

        if (
            newWeaponKey ===
            "FACAO"
        ) {

            groundWeapon.destroy();


            this.player.unlockMachete();


            return;
        }


        // =========================
        // ARMA PRINCIPAL ATUAL
        // =========================

        const hadOldWeapon =
            Boolean(
                this.player.currentWeapon &&
                this.player.weapon
            );


        const oldWeaponKey =
            hadOldWeapon
                ? this.player.currentWeapon
                : null;


        const oldWeaponData =
            hadOldWeapon
                ? WEAPONS[
                oldWeaponKey
                ]
                : null;


        const oldWeaponAmmo =
            hadOldWeapon
                ? this.player.weapon.ammo
                : null;


        const dropX =
            groundWeapon.x;


        const dropY =
            groundWeapon.y;


        groundWeapon.destroy();


        // =========================
        // EQUIPA ARMA PRINCIPAL
        // =========================

        this.player.equipWeapon(
            newWeaponKey,
            newWeaponData,
            newWeaponAmmo
        );


        // =========================
        // DERRUBA ARMA PRINCIPAL ANTIGA
        // =========================

        if (
            !hadOldWeapon ||
            !oldWeaponData
        ) {

            return;
        }


        const droppedWeapon =
            new GroundWeapon(
                this,
                dropX,
                dropY,
                oldWeaponKey,
                oldWeaponData,
                oldWeaponAmmo
            );


        this.groundWeapons.add(
            droppedWeapon
        );
    }

    // =========================
    // ATUALIZA INTERAÇÃO
    // =========================

    updateInteraction() {

        const weapon =
            this.getNearbyGroundWeapon();


        if (
            !weapon
        ) {

            this.interactText.setText(
                ""
            );

            return;
        }


        this.interactText.setText(
            `E - PEGAR ${weapon.getWeaponData().name}`
        );
    }


    // =========================
    // HUD
    // =========================

    createHUD() {

        const hudWidth =
            220;

        const hudHeight =
            90;

        const marginRight =
            25;

        const marginBottom =
            25;


        const hudX =
            this.cameras.main.width -
            hudWidth -
            marginRight;


        const hudY =
            this.cameras.main.height -
            hudHeight -
            marginBottom;


        // =========================
        // FUNDO
        // =========================

        this.hudBackground =
            this.add.rectangle(
                hudX,
                hudY,
                hudWidth,
                hudHeight,
                0x303030,
                0.75
            );


        this.hudBackground.setOrigin(
            0,
            0
        );


        this.hudBackground.setStrokeStyle(
            3,
            0x777777,
            1
        );


        // =========================
        // ARMA
        // =========================

        this.weaponText =
            this.add.text(
                hudX + 15,
                hudY + 12,
                "",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "20px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff"
                }
            );


        // =========================
        // MUNIÇÃO
        // =========================

        this.ammoText =
            this.add.text(
                hudX + 15,
                hudY + 42,
                "",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "30px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff"
                }
            );

        // =========================
        // TEXTO DE INTERAÇÃO
        // =========================

        this.interactText =
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height - 120,
                "",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "22px",

                    fontStyle:
                        "bold",

                    color:
                        "#ffffff",

                    backgroundColor:
                        "#000000"
                }
            );


        this.interactText
            .setOrigin(
                0.5
            )
            .setScrollFactor(
                0
            )
            .setDepth(
                1001
            );


        // =========================
        // FIXA NA TELA
        // =========================

        this.hudBackground
            .setScrollFactor(0)
            .setDepth(1000);


        this.weaponText
            .setScrollFactor(0)
            .setDepth(1001);


        this.ammoText
            .setScrollFactor(0)
            .setDepth(1001);


        this.updateHUD();
    }

    // =========================
    // ATUALIZA HUD
    // =========================

    updateHUD() {

        if (
            !this.player
        ) {

            return;
        }


        if (
            !this.player.weapon ||
            !this.player.currentWeapon
        ) {

            this.weaponText.setText(
                "DESARMADO"
            );


            this.ammoText.setText(
                ""
            );


            return;
        }


        const weapon =
            this.player.weapon;


        this.weaponText.setText(
            weapon.name
        );


        this.ammoText.setText(
            `${weapon.ammo} / ${weapon.magazineSize}`
        );
    }


    // =========================
    // UPDATE DOS INIMIGOS
    // =========================

    updateEnemies(
        delta
    ) {

        this.enemies.children.iterate(
            (enemy) => {

                if (
                    !enemy ||
                    !enemy.active
                ) {

                    return;
                }


                enemy.update(
                    this.player,
                    this.walls,
                    this.pathfinder,
                    this.bullets,
                    this.cameras.main,
                    delta
                );

                // Registra o inimigo na primeira vez
                // em que ele sai do estado idle.

                if (
                    this.alertedEnemies &&
                    enemy.state !== "idle"
                ) {

                    this.alertedEnemies.add(
                        enemy
                    );
                }
            }
        );
    }

    // =========================
    // ATIVA O SOFÁ APÓS A SAÍDA
    // =========================

    updateSpawnSofaCollision() {

        if (
            this.playerLeftSpawnSofa ||
            !this.player ||
            !this.player.body ||
            !this.spawnSofa ||
            !this.spawnSofa.body ||
            !this.spawnSofaExitArea
        ) {

            return;
        }


        const playerBounds =
            new Phaser.Geom.Rectangle(
                this.player.body.x,
                this.player.body.y,
                this.player.body.width,
                this.player.body.height
            );


        const stillOnSofa =
            Phaser.Geom.Intersects
                .RectangleToRectangle(
                    playerBounds,
                    this.spawnSofaExitArea
                );


        if (
            stillOnSofa
        ) {

            return;
        }


        this.playerLeftSpawnSofa =
            true;


        this.spawnSofa.body.enable =
            true;


        this.spawnSofa.body
            .updateFromGameObject();


        console.log(
            "COLISÃO DO SOFÁ ATIVADA"
        );
    }


    // =========================
    // UPDATE
    // =========================

    update(
        time,
        delta
    ) {

        if (
            this.gameWon ||
            this.demoFinished
        ) {

            return;
        }


        // =========================
        // PLAYER
        // =========================

        this.player.update();

        this.updateSpawnSofaCollision();

        // =========================
        // TIRO AUTOMÁTICO
        // =========================

        this.updateAutomaticFire();


        // =========================
        // INIMIGOS
        // Grupo vazio por enquanto.
        // =========================

        // IA desligada durante o teste
        // de posicionamento.

        if (
            this.ENEMY_AI_ENABLED
        ) {

            this.updateEnemies(
                delta
            );
        }


        // =========================
        // ARMAS NO CHÃO
        // Grupo vazio por enquanto.
        // =========================

        this.updateInteraction();


        if (
            Phaser.Input.Keyboard.JustDown(
                this.interactKey
            )
        ) {

            this.interactWithGroundWeapon();
        }


        // =========================
        // HUD
        // =========================

        this.updateHUD();


        // TEMPORARIAMENTE DESATIVADO.
        // Um grupo vazio seria interpretado
        // como todos os inimigos eliminados.

        // this.checkVictory();
    }
}
