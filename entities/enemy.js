import { Weapon } from "../weapons/Weapon.js";
import { WEAPONS } from "../weapons/weaponsData.js";


export class Enemy extends Phaser.GameObjects.Rectangle {

    constructor(
        scene,
        x,
        y,
        weaponKey = "PISTOLA"
    ) {

        // =========================
        // CORPO LÓGICO
        // =========================

        super(
            scene,
            x,
            y,
            40,
            40,
            0xff0000,
            0
        );


        this.scene =
            scene;


        scene.add.existing(
            this
        );


        scene.physics.add.existing(
            this
        );


        this.setVisible(
            false
        );


        // =========================
        // FRAMES / ANIMAÇÕES
        // =========================

        this.createFrames();

        this.createAnimations();


        // =========================
        // VIDA
        // =========================

        this.health =
            100;


        this.dead =
            false;


        // =========================
        // IA
        // =========================

        this.state =
            "idle";


        this.speed =
            260;

        // =========================
        // CAMPO DE VISÃO
        // =========================

        // Como o mapa está em escala 2,
        // 650 no mundo equivale a cerca
        // de 325 px na imagem original.

        this.visionRange =
            650;


        // Abertura total do cone.

        this.visionAngle =
            Phaser.Math.DegToRad(
                80
            );


        // =========================
        // ARMA ATUAL
        // =========================

        // IMPORTANTE:
        // precisa existir ANTES de
        // reactionDelay, alcance etc.

        this.currentWeapon =
            weaponKey;


        // =========================
        // TEMPO DE REAÇÃO
        // =========================

        this.reactionDelay =
            this.currentWeapon === "RIFLE"
                ? 500
                : 350;


        this.reactionTimer =
            0;


        this.wasSeeingPlayer =
            false;


        // =========================
        // ARMA DE FOGO
        // =========================

        if (
            this.currentWeapon ===
            "FACAO"
        ) {

            // Facão usa sistema melee,
            // não Weapon.js.

            this.weapon =
                null;

        } else {

            const weaponData =
                WEAPONS[
                this.currentWeapon
                ] ??
                WEAPONS.PISTOLA;


            this.weapon =
                new Weapon(
                    scene,
                    weaponData
                );


            // =========================
            // COOLDOWN DO INIMIGO
            // =========================

            this.weapon.shotCooldown =
                this.getEnemyShotCooldown();
        }


        // =========================
        // FACÃO
        // =========================

        this.meleeRange =
            75;


        this.meleeDamage =
            100;


        this.meleeCooldown =
            900;


        this.meleeTimer =
            0;


        this.isMeleeAttacking =
            false;


        // =========================
        // ALCANCE
        // =========================

        this.maxShootRange =
            this.getEnemyShootRange();


        // =========================
        // ROTAÇÃO / ANIMAÇÃO
        // =========================

        this.angle =
            0;


        this.isShooting =
            false;


        // =========================
        // SPRITE VISUAL
        // =========================

        this.sprite =
            scene.add.sprite(
                x,
                y,
                "enemySheet",
                this.getIdleFrame()
            );


        this.sprite.setDepth(
            10
        );


        this.sprite.setScale(
            1.10
        );

        // =========================
        // DEBUG DO CONE DE VISÃO
        // =========================

        this.visionGraphics =
            null;


        if (
            scene.DEBUG_ENEMY_VISION
        ) {

            this.visionGraphics =
                scene.add.graphics();


            this.visionGraphics.setDepth(
                8
            );
        }


        // =========================
        // MEMÓRIA
        // =========================

        this.lastSeenX =
            null;


        this.lastSeenY =
            null;


        // =========================
        // BUSCA PELO PLAYER
        // =========================

        this.searchingArea =
            false;


        this.searchDuration =
            5000;


        this.searchTimer =
            0;


        this.searchRadius =
            220;


        this.searchTargetX =
            null;


        this.searchTargetY =
            null;

        // =========================
        // PATH
        // =========================

        this.path =
            [];


        this.pathIndex =
            0;


        this.pathTimer =
            0;


        this.pathUpdateInterval =
            600;


        // =========================
        // FÍSICA
        // =========================

        this.body.setSize(
            40,
            40
        );


        this.body.setCollideWorldBounds(
            true
        );


        this.setDepth(
            9
        );
    }


    // =========================
    // ALCANCE POR ARMA
    // =========================

    getEnemyShootRange() {

        switch (
        this.currentWeapon
        ) {

            case "RIFLE":

                return 600;


            case "DOZE":

                return 260;


            case "FACAO":

                return this.meleeRange;


            case "PISTOLA":
            default:

                return 420;
        }
    }


    // =========================
    // COOLDOWN POR ARMA
    // =========================

    getEnemyShotCooldown() {

        switch (
        this.currentWeapon
        ) {

            case "RIFLE":

                return 220;


            case "DOZE":

                return 1100;


            case "PISTOLA":
            default:

                return 750;
        }
    }


    // =========================
    // FRAMES
    // =========================

    createFrames() {

        const texture =
            this.scene.textures.get(
                "enemySheet"
            );


        if (
            texture.has(
                "enemyWalk1"
            )
        ) {

            return;
        }


        // =========================
        // 1.1 CAMINHADA
        // =========================

        texture.add(
            "enemyWalk1",
            0,
            20,
            20,
            65,
            100
        );


        texture.add(
            "enemyWalk2",
            0,
            98,
            20,
            65,
            100
        );


        // =========================
        // 1.2 FACÃO
        // =========================

        texture.add(
            "enemyMachetePrepare",
            0,
            262,
            30,
            66,
            92
        );


        texture.add(
            "enemyMacheteAttack",
            0,
            330,
            38,
            88,
            86
        );


        texture.add(
            "enemyMacheteRecover",
            0,
            437,
            39,
            84,
            78
        );


        // =========================
        // 2.1 RIFLE
        // =========================

        texture.add(
            "enemyRifleIdle",
            0,
            21,
            152,
            73,
            78
        );


        texture.add(
            "enemyRifleShoot",
            0,
            101,
            152,
            85,
            78
        );


        // =========================
        // 2.2 DOZE
        // =========================

        texture.add(
            "enemyShotgunIdle",
            0,
            243,
            150,
            74,
            84
        );


        texture.add(
            "enemyShotgunShoot",
            0,
            315,
            149,
            51,
            86
        );


        // =========================
        // 2.3 PISTOLA
        // =========================

        texture.add(
            "enemyPistolIdle",
            0,
            450,
            146,
            56,
            74
        );


        texture.add(
            "enemyPistolShoot",
            0,
            517,
            150,
            54,
            77
        );


        // =========================
        // 3. MORTE
        // =========================

        texture.add(
            "enemyDeath",
            0,
            247,
            282,
            99,
            74
        );
    }


    // =========================
    // ANIMAÇÕES
    // =========================

    createAnimations() {

        // =========================
        // CAMINHADA
        // =========================

        if (
            !this.scene.anims.exists(
                "enemy-walk"
            )
        ) {

            this.scene.anims.create({

                key:
                    "enemy-walk",

                frames: [

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyWalk1"
                    },

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyWalk2"
                    }
                ],

                frameRate:
                    7,

                repeat:
                    -1
            });
        }


        // =========================
        // PISTOLA
        // =========================

        if (
            !this.scene.anims.exists(
                "enemy-pistol-shoot"
            )
        ) {

            this.scene.anims.create({

                key:
                    "enemy-pistol-shoot",

                frames: [

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyPistolShoot",

                        duration:
                            90
                    },

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyPistolIdle",

                        duration:
                            100
                    }
                ],

                repeat:
                    0
            });
        }


        // =========================
        // DOZE
        // =========================

        if (
            !this.scene.anims.exists(
                "enemy-shotgun-shoot"
            )
        ) {

            this.scene.anims.create({

                key:
                    "enemy-shotgun-shoot",

                frames: [

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyShotgunShoot",

                        duration:
                            130
                    },

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyShotgunIdle",

                        duration:
                            170
                    }
                ],

                repeat:
                    0
            });
        }


        // =========================
        // RIFLE
        // =========================

        if (
            !this.scene.anims.exists(
                "enemy-rifle-shoot"
            )
        ) {

            this.scene.anims.create({

                key:
                    "enemy-rifle-shoot",

                frames: [

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyRifleShoot",

                        duration:
                            60
                    },

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyRifleIdle",

                        duration:
                            60
                    }
                ],

                repeat:
                    0
            });
        }


        // =========================
        // FACÃO
        // =========================

        if (
            !this.scene.anims.exists(
                "enemy-machete-attack"
            )
        ) {

            this.scene.anims.create({

                key:
                    "enemy-machete-attack",

                frames: [

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyMachetePrepare",

                        duration:
                            130
                    },

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyMacheteAttack",

                        duration:
                            90
                    },

                    {
                        key:
                            "enemySheet",

                        frame:
                            "enemyMacheteRecover",

                        duration:
                            150
                    }
                ],

                repeat:
                    0
            });
        }
    }


    // =========================
    // UPDATE
    // =========================

    update(
        player,
        walls,
        pathfinder,
        bullets,
        camera,
        delta
    ) {

        if (
            this.dead ||
            !this.active ||
            !player
        ) {

            if (
                this.visionGraphics
            ) {

                this.visionGraphics.clear();
            }


            return;
        }


        this.updateVisualPosition();


        // =========================
        // DISTÂNCIA
        // =========================

        const dx =
            player.x -
            this.x;


        const dy =
            player.y -
            this.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // =========================
        // VISÃO
        // =========================

        const onScreen =
            this.isOnScreen(
                camera
            );


        const canSeePlayer =
            this.hasLineOfSight(
                player,
                walls
            );


        // =========================
        // TEMPO DE REAÇÃO
        // =========================

        if (
            canSeePlayer &&
            !this.wasSeeingPlayer
        ) {

            this.reactionTimer =
                this.reactionDelay;
        }


        this.wasSeeingPlayer =
            canSeePlayer;


        if (
            this.reactionTimer > 0
        ) {

            this.reactionTimer -=
                delta;
        }


        // =========================
        // COOLDOWN DO FACÃO
        // =========================

        if (
            this.meleeTimer > 0
        ) {

            this.meleeTimer -=
                delta;
        }


        // =========================
        // ESCOLHE ESTADO
        // =========================

        this.chooseState(
            distance,
            canSeePlayer,
            player
        );


        // =========================
        // EXECUTA ESTADO
        // =========================

        switch (
        this.state
        ) {

            // =========================
            // PERSEGUIÇÃO
            // =========================

            case "chase":

                // Enquanto enxerga o player, segue em linha
                // direta. A visão já confirmou que não existe
                // uma parede entre os dois.

                this.moveDirectlyTo(
                    player.x,
                    player.y
                );

                break;


            // =========================
            // BUSCA
            // =========================

            case "search":

                this.updateSearch(
                    pathfinder,
                    delta,
                    walls
                );

                break;


            // =========================
            // TIRO
            // =========================

            case "shoot":

                this.stop();


                this.angle =
                    Phaser.Math.Angle.Between(
                        this.x,
                        this.y,
                        player.x,
                        player.y
                    );


                this.updateRotation();


                // Proteção adicional:
                // inimigo de facão jamais
                // tenta usar Weapon.js.

                if (
                    !this.weapon
                ) {

                    break;
                }


                if (
                    onScreen &&
                    this.reactionTimer <= 0
                ) {

                    const fired =
                        this.weapon.shoot(
                            this,
                            player.x,
                            player.y,
                            bullets,
                            "enemy"
                        );


                    if (
                        fired
                    ) {

                        this.playShootAnimation();
                    }
                }


                break;


            // =========================
            // FACÃO
            // =========================

            case "melee":

                this.updateMelee(
                    player
                );

                break;


            // =========================
            // IDLE
            // =========================

            default:

                this.stop();

                break;
        }


        // =========================
        // VISUAL
        // =========================

        this.updateVisualState();

        this.updateVisionDebug(
            canSeePlayer
        );
    }


    // =========================
    // ESCOLHE ESTADO
    // =========================

    chooseState(
        distance,
        canSeePlayer,
        player
    ) {

        // =========================
        // VÊ O PLAYER
        // =========================

        if (
            canSeePlayer
        ) {

            this.searchingArea =
                false;


            this.searchTimer =
                0;


            this.searchTargetX =
                null;


            this.searchTargetY =
                null;


            this.lastSeenX =
                player.x;


            this.lastSeenY =
                player.y;


            // =========================
            // FACÃO
            // =========================

            if (
                this.currentWeapon ===
                "FACAO"
            ) {

                if (
                    distance <=
                    this.meleeRange
                ) {

                    this.state =
                        "melee";


                    this.clearPath();

                    return;
                }


                this.state =
                    "chase";

                return;
            }


            // =========================
            // ARMAS DE FOGO
            // =========================

            if (
                distance <=
                this.maxShootRange
            ) {

                this.state =
                    "shoot";


                this.clearPath();

                return;
            }


            this.state =
                "chase";

            return;
        }


        // =========================
        // PERDEU O PLAYER
        // =========================

        if (
            this.lastSeenX !== null &&
            this.lastSeenY !== null
        ) {

            this.state =
                "search";

            return;
        }


        // =========================
        // IDLE
        // =========================

        this.state =
            "idle";


        this.clearPath();
    }


    // =========================
    // ATAQUE CORPO A CORPO
    // =========================

    updateMelee(
        player
    ) {

        this.stop();


        this.angle =
            Phaser.Math.Angle.Between(
                this.x,
                this.y,
                player.x,
                player.y
            );


        this.updateRotation();


        if (
            this.isMeleeAttacking
        ) {

            return;
        }


        if (
            this.meleeTimer > 0
        ) {

            return;
        }


        this.startMeleeAttack(
            player
        );
    }


    // =========================
    // COMEÇA ATAQUE DE FACÃO
    // =========================

    startMeleeAttack(
        player
    ) {

        this.isMeleeAttacking =
            true;


        this.meleeTimer =
            this.meleeCooldown;


        this.sprite.play(
            "enemy-machete-attack"
        );


        // =========================
        // MOMENTO DO IMPACTO
        // =========================

        this.scene.time.delayedCall(
            200,

            () => {

                if (
                    this.dead ||
                    !this.active ||
                    !player ||
                    player.dead
                ) {

                    return;
                }


                const distance =
                    Phaser.Math.Distance.Between(
                        this.x,
                        this.y,
                        player.x,
                        player.y
                    );


                if (
                    distance <=
                    this.meleeRange + 10
                ) {

                    player.takeDamage(
                        this.meleeDamage
                    );
                }
            }
        );


        // =========================
        // TERMINOU ANIMAÇÃO
        // =========================

        this.sprite.once(
            Phaser.Animations.Events
                .ANIMATION_COMPLETE,

            () => {

                if (
                    this.dead
                ) {

                    return;
                }


                this.isMeleeAttacking =
                    false;


                // Volta ao pivô normal.

                this.sprite.setOrigin(
                    0.5,
                    0.5
                );


                // Volta para o frame parado
                // correspondente à arma atual.

                this.sprite.anims.stop();


                this.sprite.setFrame(
                    this.getIdleFrame()
                );


                this.updateRotation();
            }
        );
    }


    // =========================
    // VISUAL
    // =========================

    updateVisualPosition() {

        if (
            !this.sprite ||
            !this.sprite.active
        ) {

            return;
        }


        this.sprite.setPosition(
            this.x,
            this.y
        );
    }


    // =========================
    // VISUAL DO ESTADO
    // =========================

    updateVisualState() {

        if (
            this.dead ||
            !this.sprite ||
            !this.sprite.active ||
            this.isShooting ||
            this.isMeleeAttacking
        ) {

            return;
        }


        const velocity =
            this.body.velocity;


        const moving =
            Math.abs(
                velocity.x
            ) > 1 ||
            Math.abs(
                velocity.y
            ) > 1;


        if (
            moving
        ) {

            if (
                this.sprite.anims.currentAnim?.key !==
                "enemy-walk"
            ) {

                this.sprite.play(
                    "enemy-walk"
                );
            }


            const movementAngle =
                Math.atan2(
                    velocity.y,
                    velocity.x
                );


            this.sprite.rotation =
                movementAngle -
                Math.PI / 2;


            return;
        }


        this.sprite.anims.stop();


        this.sprite.setFrame(
            this.getIdleFrame()
        );


        this.updateRotation();
    }


    // =========================
    // ROTAÇÃO
    // =========================

    updateRotation() {

        if (
            !this.sprite ||
            !this.sprite.active
        ) {

            return;
        }


        this.sprite.rotation =
            this.angle -
            Math.PI / 2;
    }


    // =========================
    // FRAME IDLE
    // =========================

    getIdleFrame() {

        switch (
        this.currentWeapon
        ) {

            case "RIFLE":

                return "enemyRifleIdle";


            case "DOZE":

                return "enemyShotgunIdle";


            case "FACAO":

                return "enemyMachetePrepare";


            case "PISTOLA":
            default:

                return "enemyPistolIdle";
        }
    }


    // =========================
    // ANIMAÇÃO DE TIRO
    // =========================

    playShootAnimation() {

        if (
            this.isShooting ||
            !this.weapon
        ) {

            return;
        }


        let animationKey;


        switch (
        this.currentWeapon
        ) {

            case "RIFLE":

                animationKey =
                    "enemy-rifle-shoot";

                break;


            case "DOZE":

                animationKey =
                    "enemy-shotgun-shoot";

                break;


            case "PISTOLA":
            default:

                animationKey =
                    "enemy-pistol-shoot";

                break;
        }


        this.isShooting =
            true;


        this.sprite.play(
            animationKey
        );


        this.sprite.once(
            Phaser.Animations.Events
                .ANIMATION_COMPLETE,

            () => {

                if (
                    this.dead
                ) {

                    return;
                }


                this.isShooting =
                    false;


                this.sprite.setFrame(
                    this.getIdleFrame()
                );
            }
        );
    }


    // =========================
    // MOVIMENTO DIRETO
    // =========================

    moveDirectlyTo(
        targetX,
        targetY
    ) {

        if (
            !this.body ||
            targetX === null ||
            targetY === null
        ) {

            return;
        }


        let dx =
            targetX -
            this.x;


        let dy =
            targetY -
            this.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <= 1
        ) {

            this.stop();

            return;
        }


        dx /=
            distance;


        dy /=
            distance;


        this.angle =
            Math.atan2(
                dy,
                dx
            );


        this.body.setVelocity(
            dx *
            this.speed,

            dy *
            this.speed
        );
    }


    // =========================
    // PATH
    // =========================

    updatePathTo(
        targetX,
        targetY,
        pathfinder,
        delta
    ) {

        if (
            targetX === null ||
            targetY === null ||
            !pathfinder
        ) {

            return false;
        }


        this.pathTimer -=
            delta;


        if (
            this.pathTimer > 0
        ) {

            return (
                this.path.length > 0
            );
        }


        this.pathTimer =
            this.pathUpdateInterval;


        const newPath =
            pathfinder.findPath(
                this.x,
                this.y,
                targetX,
                targetY
            );


        this.path =
            Array.isArray(
                newPath
            )
                ? newPath
                : [];


        this.pathIndex =
            0;


        return (
            this.path.length > 0
        );
    }


    // =========================
    // SEGUE PATH
    // =========================

    followPath() {

        if (
            !this.path ||
            this.path.length === 0
        ) {

            this.stop();

            return;
        }


        const target =
            this.path[
            this.pathIndex
            ];


        if (
            !target
        ) {

            this.stop();

            return;
        }


        let dx =
            target.x -
            this.x;


        let dy =
            target.y -
            this.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance < 12
        ) {

            this.pathIndex++;


            if (
                this.pathIndex >=
                this.path.length
            ) {

                this.stop();
            }


            return;
        }


        dx /=
            distance;


        dy /=
            distance;

        // O cone acompanha a direção
        // em que o inimigo caminha.

        this.angle =
            Math.atan2(
                dy,
                dx
            );


        this.body.setVelocity(
            dx *
            this.speed,

            dy *
            this.speed
        );
    }


    // =========================
    // BUSCA
    // =========================

    updateSearch(
        pathfinder,
        delta,
        walls
    ) {

        if (
            !this.searchingArea
        ) {

            const hasPath =
                this.updatePathTo(
                    this.lastSeenX,
                    this.lastSeenY,
                    pathfinder,
                    delta
                );


            if (
                hasPath
            ) {

                this.followPath();

            } else if (
                this.hasClearMovementLine(
                    this.lastSeenX,
                    this.lastSeenY,
                    walls
                )
            ) {

                // Fallback para pontos que estão na mesma
                // área aberta, caso a grid não gere rota.

                this.moveDirectlyTo(
                    this.lastSeenX,
                    this.lastSeenY
                );

            } else {

                this.stop();
            }


            const distance =
                Phaser.Math.Distance.Between(
                    this.x,
                    this.y,
                    this.lastSeenX,
                    this.lastSeenY
                );


            if (
                distance <= 35
            ) {

                this.startAreaSearch();
            }


            return;
        }


        this.searchTimer -=
            delta;


        if (
            this.searchTimer <= 0
        ) {

            this.finishSearch();

            return;
        }


        if (
            this.searchTargetX === null ||
            this.searchTargetY === null
        ) {

            this.chooseSearchPoint();

            this.clearPath();
        }


        const hasPath =
            this.updatePathTo(
                this.searchTargetX,
                this.searchTargetY,
                pathfinder,
                delta
            );


        if (
            hasPath
        ) {

            this.followPath();

        } else if (
            this.hasClearMovementLine(
                this.searchTargetX,
                this.searchTargetY,
                walls
            )
        ) {

            this.moveDirectlyTo(
                this.searchTargetX,
                this.searchTargetY
            );

        } else {

            // Escolhe outro ponto na próxima atualização
            // em vez de ficar preso tentando o mesmo ponto.

            this.searchTargetX =
                null;


            this.searchTargetY =
                null;


            this.clearPath();

            this.stop();
        }


        const distance =
            Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.searchTargetX,
                this.searchTargetY
            );


        if (
            distance <= 35
        ) {

            this.searchTargetX =
                null;


            this.searchTargetY =
                null;


            this.clearPath();
        }
    }


    // =========================
    // COMEÇA BUSCA
    // =========================

    startAreaSearch() {

        this.searchingArea =
            true;


        this.searchTimer =
            this.searchDuration;


        this.searchTargetX =
            null;


        this.searchTargetY =
            null;


        this.clearPath();
    }


    // =========================
    // ESCOLHE PONTO DE BUSCA
    // =========================

    chooseSearchPoint() {

        const angle =
            Phaser.Math.FloatBetween(
                0,
                Math.PI * 2
            );


        const distance =
            Phaser.Math.Between(
                80,
                this.searchRadius
            );


        this.searchTargetX =
            this.lastSeenX +
            Math.cos(
                angle
            ) *
            distance;


        this.searchTargetY =
            this.lastSeenY +
            Math.sin(
                angle
            ) *
            distance;
    }


    // =========================
    // TERMINA BUSCA
    // =========================

    finishSearch() {

        this.searchingArea =
            false;


        this.searchTimer =
            0;


        this.searchTargetX =
            null;


        this.searchTargetY =
            null;


        this.lastSeenX =
            null;


        this.lastSeenY =
            null;


        this.state =
            "idle";


        this.clearPath();

        this.stop();
    }


    // =========================
    // ESTÁ NA TELA?
    // =========================

    isOnScreen(
        camera
    ) {

        if (
            !camera
        ) {

            return false;
        }


        const view =
            camera.worldView;


        return (
            this.x + 20 >
            view.left &&

            this.x - 20 <
            view.right &&

            this.y + 20 >
            view.top &&

            this.y - 20 <
            view.bottom
        );
    }


    // =========================
    // CAMINHO DIRETO SEM PAREDE
    // =========================

    hasClearMovementLine(
        targetX,
        targetY,
        walls
    ) {

        if (
            targetX === null ||
            targetY === null ||
            !walls ||
            !walls.children
        ) {

            return false;
        }


        const line =
            new Phaser.Geom.Line(
                this.x,
                this.y,
                targetX,
                targetY
            );


        let blocked =
            false;


        walls.children.iterate(
            (wall) => {

                if (
                    blocked ||
                    !wall ||
                    !wall.active
                ) {

                    return;
                }


                if (
                    Phaser.Geom.Intersects
                        .LineToRectangle(
                            line,
                            wall.getBounds()
                        )
                ) {

                    blocked =
                        true;
                }
            }
        );


        return !blocked;
    }


    // =========================
    // LINHA E CONE DE VISÃO
    // =========================

    hasLineOfSight(
        player,
        walls
    ) {

        if (
            !player ||
            !walls ||
            !walls.children
        ) {

            return false;
        }


        // =========================
        // ALCANCE
        // =========================

        const distance =
            Phaser.Math.Distance.Between(
                this.x,
                this.y,
                player.x,
                player.y
            );


        if (
            distance >
            this.visionRange
        ) {

            return false;
        }


        // =========================
        // CONE DE VISÃO
        // =========================

        const angleToPlayer =
            Phaser.Math.Angle.Between(
                this.x,
                this.y,
                player.x,
                player.y
            );


        const angleDifference =
            Phaser.Math.Angle.Wrap(
                angleToPlayer -
                this.angle
            );


        if (
            Math.abs(
                angleDifference
            ) >
            this.visionAngle / 2
        ) {

            return false;
        }


        // =========================
        // PAREDES
        // =========================

        const line =
            new Phaser.Geom.Line(
                this.x,
                this.y,
                player.x,
                player.y
            );


        let blocked =
            false;


        walls.children.iterate(
            (wall) => {

                if (
                    blocked ||
                    !wall ||
                    !wall.active
                ) {

                    return;
                }


                if (
                    Phaser.Geom.Intersects
                        .LineToRectangle(
                            line,
                            wall.getBounds()
                        )
                ) {

                    blocked =
                        true;
                }
            }
        );


        return !blocked;
    }

    // =========================
    // DEBUG DO CONE DE VISÃO
    // =========================

    updateVisionDebug(
        canSeePlayer
    ) {

        if (
            !this.visionGraphics
        ) {

            return;
        }


        this.visionGraphics.clear();


        const halfAngle =
            this.visionAngle / 2;


        const startAngle =
            this.angle -
            halfAngle;


        const endAngle =
            this.angle +
            halfAngle;


        const color =
            canSeePlayer
                ? 0xff3333
                : 0x33ff66;


        this.visionGraphics.fillStyle(
            color,
            0.12
        );


        this.visionGraphics.lineStyle(
            2,
            color,
            0.65
        );


        this.visionGraphics.beginPath();


        this.visionGraphics.moveTo(
            this.x,
            this.y
        );


        this.visionGraphics.arc(
            this.x,
            this.y,
            this.visionRange,
            startAngle,
            endAngle,
            false
        );


        this.visionGraphics.closePath();


        this.visionGraphics.fillPath();


        this.visionGraphics.strokePath();
    }


    // =========================
    // POSIÇÃO DO CANO
    // =========================

    getGunPosition(
        angle =
            this.angle
    ) {

        let gunDistance =
            40;


        if (
            this.currentWeapon ===
            "RIFLE" ||
            this.currentWeapon ===
            "DOZE"
        ) {

            gunDistance =
                48;
        }


        return {

            x:
                this.x +
                Math.cos(
                    angle
                ) *
                gunDistance,

            y:
                this.y +
                Math.sin(
                    angle
                ) *
                gunDistance
        };
    }


    // =========================
    // LIMPA PATH
    // =========================

    clearPath() {

        this.path =
            [];


        this.pathIndex =
            0;


        this.pathTimer =
            0;
    }


    // =========================
    // PARA
    // =========================

    stop() {

        if (
            !this.body
        ) {

            return;
        }


        this.body.setVelocity(
            0,
            0
        );
    }


    // =========================
    // DANO
    // =========================

    takeDamage(
        damage
    ) {

        if (
            this.dead
        ) {

            return false;
        }


        this.health -=
            damage;


        if (
            this.health <= 0
        ) {

            this.die();
        }
    }


    // =========================
    // MORTE
    // =========================

    die() {

        if (
            this.dead
        ) {

            return;
        }


        this.dead =
            true;


        this.stop();


        // =========================
        // DESATIVA CORPO
        // =========================

        if (
            this.body
        ) {

            this.body.enable =
                false;
        }


        this.setVisible(
            false
        );


        // =========================
        // CADÁVER
        // =========================

        if (
            this.sprite &&
            this.sprite.active
        ) {

            this.sprite.anims.stop();


            this.sprite.setFrame(
                "enemyDeath"
            );


            this.sprite.setRotation(
                Phaser.Math.FloatBetween(
                    -0.08,
                    0.08
                )
            );


            this.sprite.setDepth(
                8
            );
        }


        // =========================
        // MARCA INATIVO
        // =========================

        // =========================
        // DROPA ARMA
        // =========================

        if (
            this.currentWeapon !== "FACAO" &&
            typeof this.scene.dropEnemyWeapon === "function"
        ) {

            this.scene.dropEnemyWeapon(
                this.x,
                this.y,
                this.currentWeapon,
                this.weapon,
                this.angle
            );
        }

        this.active =
            false;
    }

    // =========================
    // OUVIU BARULHO
    // =========================

    hearNoise(
        x,
        y
    ) {

        if (
            this.dead
        ) {

            return;
        }


        // Se já está vendo o player,
        // não precisa investigar barulho.

        if (
            this.wasSeeingPlayer
        ) {

            return false;
        }


        this.lastSeenX =
            x;


        this.lastSeenY =
            y;


        this.searchingArea =
            false;


        this.searchTimer =
            0;


        this.searchTargetX =
            null;


        this.searchTargetY =
            null;


        this.state =
            "search";


        this.clearPath();

        // Evita que todos os inimigos calculem
        // uma rota pesada no mesmo frame.

        this.pathTimer =
            Phaser.Math.Between(
                20,
                140
            );


        // Permite que GameScene conte somente
        // quem realmente aceitou o alerta.

        return true;
    }


    // =========================
    // DESTROY
    // =========================

    destroy(
        fromScene
    ) {

        if (
            this.visionGraphics
        ) {

            this.visionGraphics.destroy();


            this.visionGraphics =
                null;
        }

        if (
            this.sprite
        ) {

            this.sprite.destroy();

            this.sprite =
                null;
        }


        super.destroy(
            fromScene
        );
    }
}
