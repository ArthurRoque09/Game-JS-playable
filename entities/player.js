import { Weapon } from "../weapons/Weapon.js";
import { WEAPONS } from "../weapons/weaponsData.js";


export class Player {

    constructor(
        scene,
        x,
        y,
        walls
    ) {

        this.scene =
            scene;


        this.speed =
            300;


        this.health =
            100;


        this.dead =
            false;


        this.currentWeapon =
            null;


        this.isShooting =
            false;


        // =========================
        // FACÃO
        // =========================

        this.hasMachete =
            false;


        this.isMeleeAttacking =
            false;


        this.meleeRange =
            130;

        this.meleeHalfAngle =
            70;


        this.meleeCooldown =
            500;


        this.lastMeleeTime =
            0;


        // =========================
        // ARMA
        // =========================

        this.weapon =
            null;

        // =========================
        // INPUT
        // =========================

        this.keys =
            scene.input.keyboard.addKeys({

                up:
                    "W",

                down:
                    "S",

                left:
                    "A",

                right:
                    "D",

                melee:
                    Phaser.Input.Keyboard
                        .KeyCodes.SPACE
            });


        // =========================
        // SPRITES
        // =========================

        this.createFrames();

        this.createAnimations();


        // =========================
        // CORPO FÍSICO
        // =========================

        this.body =
            scene.physics.add.sprite(
                x,
                y,
                "playerSheet",
                "idle"
            );


        this.body.setVisible(
            false
        );


        // =========================
        // HITBOX
        // =========================

        this.body.body.setSize(
            34,
            48,
            true
        );


        this.body.setCollideWorldBounds(
            true
        );


        scene.physics.add.collider(
            this.body,
            walls
        );


        // =========================
        // SPRITE VISUAL
        // =========================

        this.sprite =
            scene.add.sprite(
                x,
                y,
                "playerSheet",
                "idle"
            );


        this.sprite.setScale(
            1.10
        );


        this.sprite.setDepth(
            20
        );
    }


    // =========================
    // FRAMES
    // =========================

    createFrames() {

        const texture =
            this.scene.textures.get(
                "playerSheet"
            );

        // =========================
        // CAMINHADA SEM ARMA
        // =========================

        texture.add(
            "unarmedWalk1",
            0,
            45,
            5,
            66,
            90
        );


        texture.add(
            "unarmedWalk2",
            0,
            110,
            5,
            66,
            90
        );


        texture.add(
            "unarmedWalk3",
            0,
            177,
            5,
            66,
            90
        );


        texture.add(
            "unarmedWalk4",
            0,
            243,
            5,
            66,
            90
        );


        if (
            texture.has(
                "pistolIdle"
            )
        ) {

            return;
        }


        // =========================
        // SEM ARMA
        // =========================

        texture.add(
            "idle",
            0,
            390,
            15,
            75,
            90
        );


        // =========================
        // PISTOLA
        // =========================

        texture.add(
            "pistolIdle",
            0,
            35,
            105,
            70,
            90
        );


        texture.add(
            "pistolShoot1",
            0,
            110,
            105,
            70,
            90
        );


        texture.add(
            "pistolShoot2",
            0,
            185,
            105,
            70,
            90
        );


        // =========================
        // DOZE
        // =========================

        texture.add(
            "shotgunIdle",
            0,
            335,
            112,
            78,
            72
        );


        texture.add(
            "shotgunShoot",
            0,
            420,
            105,
            90,
            95
        );


        texture.add(
            "shotgunRecover",
            0,
            510,
            105,
            90,
            95
        );


        // =========================
        // RIFLE
        // =========================

        // Rifle parado
        texture.add(
            "rifleIdle",
            0,
            38,
            207,
            60,
            82
        );


        // Rifle disparando
        texture.add(
            "rifleShoot",
            0,
            113,
            204,
            63,
            89
        );


        // Rifle recuperando
        texture.add(
            "rifleRecover",
            0,
            190,
            207,
            61,
            84
        );

        // =========================
        // FACÃO
        // =========================

        // PREPARA O ATAQUE
        texture.add(
            "playerMachetePrepare",
            0,
            325,
            188,
            55,
            98
        );


        // ATAQUE
        texture.add(
            "playerMacheteAttack",
            0,
            412,
            215,
            63,
            82
        );


        // RECUPERAÇÃO
        texture.add(
            "playerMacheteRecover",
            0,
            495,
            211,
            102,
            64
        );


        // =========================
        // MORTE
        // =========================

        texture.add(
            "playerDeath",
            0,
            254,
            283,
            67,
            98
        );
    }


    // =========================
    // ANIMAÇÕES
    // =========================

    createAnimations() {

        // =========================
        // CAMINHADA SEM ARMA
        // =========================

        if (
            !this.scene.anims.exists(
                "player-unarmed-walk"
            )
        ) {

            this.scene.anims.create({

                key:
                    "player-unarmed-walk",

                frames: [

                    {
                        key:
                            "playerSheet",

                        frame:
                            "unarmedWalk1"
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "unarmedWalk2"
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "unarmedWalk3"
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "unarmedWalk4"
                    }
                ],

                frameRate:
                    9,

                repeat:
                    -1
            });
        }

        // =========================
        // PISTOLA
        // =========================

        if (
            !this.scene.anims.exists(
                "player-pistol-shoot"
            )
        ) {

            this.scene.anims.create({

                key:
                    "player-pistol-shoot",

                frames: [

                    {
                        key:
                            "playerSheet",

                        frame:
                            "pistolShoot1"
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "pistolShoot2"
                    }
                ],

                frameRate:
                    12,

                repeat:
                    0
            });
        }


        // =========================
        // DOZE
        // =========================

        if (
            !this.scene.anims.exists(
                "player-shotgun-shoot"
            )
        ) {

            this.scene.anims.create({

                key:
                    "player-shotgun-shoot",

                frames: [

                    {
                        key:
                            "playerSheet",

                        frame:
                            "shotgunShoot",

                        duration:
                            140
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "shotgunRecover",

                        duration:
                            130
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
                "player-rifle-shoot"
            )
        ) {

            this.scene.anims.create({

                key:
                    "player-rifle-shoot",

                frames: [

                    {
                        key:
                            "playerSheet",

                        frame:
                            "rifleShoot",

                        duration:
                            55
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "rifleRecover",

                        duration:
                            65
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
                "player-machete-attack"
            )
        ) {

            this.scene.anims.create({

                key:
                    "player-machete-attack",

                frames: [

                    {
                        key:
                            "playerSheet",

                        frame:
                            "playerMachetePrepare",

                        duration:
                            100
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "playerMacheteAttack",

                        duration:
                            90
                    },

                    {
                        key:
                            "playerSheet",

                        frame:
                            "playerMacheteRecover",

                        duration:
                            120
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

    update() {

        if (
            this.dead
        ) {

            return;
        }


        this.updateMovement();


        this.updateVisualPosition();


        this.lookAtPointer();


        // =========================
        // FACÃO - SPACE
        // =========================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.melee
            )
        ) {

            this.startMeleeAttack();
        }


        // =========================
        // IDLE
        // =========================

        if (
            !this.isShooting &&
            !this.isMeleeAttacking
        ) {

            this.updateMovementVisual();
        }
    }


    // =========================
    // MOVIMENTO
    // =========================

    updateMovement() {

        let velocityX =
            0;


        let velocityY =
            0;


        if (
            this.keys.left.isDown
        ) {

            velocityX--;
        }


        if (
            this.keys.right.isDown
        ) {

            velocityX++;
        }


        if (
            this.keys.up.isDown
        ) {

            velocityY--;
        }


        if (
            this.keys.down.isDown
        ) {

            velocityY++;
        }


        if (
            velocityX !== 0 ||
            velocityY !== 0
        ) {

            const vector =
                new Phaser.Math.Vector2(
                    velocityX,
                    velocityY
                )
                    .normalize()
                    .scale(
                        this.speed
                    );


            this.body.setVelocity(
                vector.x,
                vector.y
            );

        } else {

            this.body.setVelocity(
                0,
                0
            );
        }
    }


    // =========================
    // POSIÇÃO VISUAL
    // =========================

    updateVisualPosition() {

        this.sprite.setPosition(
            this.body.x,
            this.body.y
        );
    }


    // =========================
    // MIRA
    // =========================

    lookAtPointer() {

        const angle =
            this.getAimAngle();


        this.sprite.rotation =
            angle -
            Math.PI / 2;
    }


    // =========================
    // ALVO DO MOUSE
    // =========================

    getAimTarget() {

        const pointer =
            this.scene.input
                .activePointer;


        return (
            this.scene.cameras.main
                .getWorldPoint(
                    pointer.x,
                    pointer.y
                )
        );
    }


    // =========================
    // ÂNGULO DA MIRA
    // =========================

    getAimAngle() {

        const target =
            this.getAimTarget();


        return (
            Phaser.Math.Angle.Between(
                this.x,
                this.y,
                target.x,
                target.y
            )
        );
    }


    // =========================
    // POSIÇÃO DO CANO
    // =========================

    getGunPosition(
        angle =
            this.getAimAngle()
    ) {

        const gunDistance =
            45;


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
    // ATIRA
    // =========================

    shoot(
        bulletsGroup
    ) {

        if (
            this.dead ||
            this.isMeleeAttacking ||
            !this.weapon
        ) {

            return false;
        }


        const target =
            this.getAimTarget();


        return (
            this.weapon.shoot(
                this,

                target.x,
                target.y,

                bulletsGroup,

                "player"
            )
        );
    }


    // =========================
    // COMEÇA ANIMAÇÃO DE TIRO
    // =========================

    startShooting(
        animationKey
    ) {

        if (
            this.isShooting ||
            this.isMeleeAttacking
        ) {

            return;
        }


        this.isShooting =
            true;


        if (
            !animationKey ||
            !this.scene.anims.exists(
                animationKey
            )
        ) {

            this.isShooting =
                false;

            return;
        }


        this.sprite.play(
            animationKey
        );


        this.sprite.once(
            Phaser.Animations.Events
                .ANIMATION_COMPLETE,

            () => {

                this.isShooting =
                    false;


                this.setWeaponIdle();
            }
        );
    }


    // =========================
    // ATAQUE DE FACÃO
    // =========================

    startMeleeAttack() {

        if (
            this.dead ||
            this.isShooting ||
            this.isMeleeAttacking ||
            !this.hasMachete
        ) {

            return;
        }


        const now =
            this.scene.time.now;


        // =========================
        // COOLDOWN
        // =========================

        if (
            now -
            this.lastMeleeTime <
            this.meleeCooldown
        ) {

            return;
        }


        this.lastMeleeTime =
            now;


        this.isMeleeAttacking =
            true;


        // =========================
        // ANIMAÇÃO
        // =========================

        // Guarda a posição visual normal.

        this.sprite.setOrigin(
            0.5,
            0.5
        );

        this.sprite.play(
            "player-machete-attack"
        );

        // =========================
        // CORREÇÃO VISUAL DOS FRAMES
        // =========================

        this.sprite.on(
            Phaser.Animations.Events
                .ANIMATION_UPDATE,

            (
                animation,
                frame
            ) => {

                if (
                    animation.key !==
                    "player-machete-attack"
                ) {

                    return;
                }


                switch (
                frame.textureFrame
                ) {

                    case "playerMachetePrepare":

                        this.sprite.setOrigin(
                            0.50,
                            0.54
                        );

                        break;


                    case "playerMacheteAttack":

                        this.sprite.setOrigin(
                            0.50,
                            0.61
                        );

                        break;


                    case "playerMacheteRecover":

                        this.sprite.setOrigin(
                            0.43,
                            0.60
                        );

                        break;
                }
            }
        );

        // =========================
        // SOM DO FACÃO
        // =========================

        if (
            this.scene.cache.audio.exists(
                "macheteSwing"
            )
        ) {

            this.scene.sound.play(
                "macheteSwing",
                {
                    volume: 0.35
                }
            );
        }

        // =========================
        // MOMENTO DO IMPACTO
        // =========================

        this.scene.time.delayedCall(
            140,

            () => {

                if (
                    this.dead
                ) {

                    return;
                }


                this.performMeleeHit();
            }
        );


        // =========================
        // TERMINOU ATAQUE
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


                this.setWeaponIdle();
            }
        );
    }


    // =========================
    // HIT DO FACÃO
    // =========================

    performMeleeHit() {

        if (
            !this.scene.enemies
        ) {

            return;
        }


        // Direção para onde
        // o player está olhando.

        const aimAngle =
            this.getAimAngle();


        let closestEnemy =
            null;


        let closestDistance =
            Infinity;


        // =========================
        // PROCURA INIMIGO
        // =========================

        this.scene.enemies.children.iterate(
            (enemy) => {

                if (
                    !enemy ||
                    !enemy.active ||
                    enemy.dead
                ) {

                    return;
                }


                // =========================
                // DISTÂNCIA
                // =========================

                const distance =
                    Phaser.Math.Distance.Between(
                        this.x,
                        this.y,
                        enemy.x,
                        enemy.y
                    );


                if (
                    distance >
                    this.meleeRange
                ) {

                    return;
                }


                // =========================
                // ÂNGULO DO INIMIGO
                // =========================

                const enemyAngle =
                    Phaser.Math.Angle.Between(
                        this.x,
                        this.y,
                        enemy.x,
                        enemy.y
                    );


                const angleDifference =
                    Math.abs(
                        Phaser.Math.Angle.Wrap(
                            enemyAngle -
                            aimAngle
                        )
                    );


                // =========================
                // CONE FRONTAL
                // =========================

                // Cone frontal mais tolerante.
                // 70 graus para cada lado.

                if (
                    angleDifference >
                    Phaser.Math.DegToRad(
                        this.meleeHalfAngle
                    )
                ) {

                    return;
                }

                // =========================
                // MAIS PRÓXIMO
                // =========================

                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;


                    closestEnemy =
                        enemy;
                }
            }
        );


        // =========================
        // ACERTOU
        // =========================

        if (
            closestEnemy
        ) {

            closestEnemy.takeDamage(
                100
            );
        }
    }

    // =========================
    // VISUAL DE MOVIMENTO
    // =========================

    updateMovementVisual() {

        const velocity =
            this.body.body.velocity;


        const isMoving =
            Math.abs(
                velocity.x
            ) > 1 ||
            Math.abs(
                velocity.y
            ) > 1;


        // =========================
        // CAMINHANDO SEM ARMA
        // =========================

        if (
            !this.currentWeapon &&
            isMoving
        ) {

            const walkAnimationIsPlaying =
                this.sprite.anims.isPlaying &&
                this.sprite.anims.currentAnim?.key ===
                "player-unarmed-walk";


            if (
                !walkAnimationIsPlaying
            ) {

                this.sprite.setOrigin(
                    0.5,
                    0.5
                );


                this.sprite.play(
                    "player-unarmed-walk"
                );
            }


            return;
        }


        // =========================
        // PARADO OU COM ARMA
        // =========================

        this.setWeaponIdle();
    }


    // =========================
    // IDLE DA ARMA
    // =========================

    setWeaponIdle() {

        this.sprite.anims.stop();


        if (
            this.currentWeapon ===
            "PISTOLA"
        ) {

            this.sprite.setFrame(
                "pistolIdle"
            );

            return;
        }


        if (
            this.currentWeapon ===
            "DOZE"
        ) {

            this.sprite.setFrame(
                "shotgunIdle"
            );

            return;
        }


        if (
            this.currentWeapon ===
            "RIFLE"
        ) {

            this.sprite.setFrame(
                "rifleIdle"
            );

            return;
        }


        this.sprite.setFrame(
            "idle"
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

            return;
        }


        this.health -=
            damage;


        console.log(
            "Vida do player:",
            this.health
        );


        if (
            this.health <= 0
        ) {

            this.die();
        }
    }

    // =========================
    // DESBLOQUEIA FACÃO
    // =========================

    unlockMachete() {

        if (
            this.hasMachete
        ) {

            return false;
        }


        this.hasMachete =
            true;


        console.log(
            "FACÃO DESBLOQUEADO"
        );


        return true;
    }


    // =========================
    // EQUIPA ARMA
    // =========================

    equipWeapon(
        weaponKey,
        weaponData,
        ammo = null
    ) {

        this.currentWeapon =
            weaponKey;


        this.weapon =
            new Weapon(
                this.scene,
                weaponData
            );


        if (
            ammo !== null
        ) {

            this.weapon.ammo =
                ammo;
        }


        this.setWeaponIdle();
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

        this.sprite.anims.stop();

        this.sprite.setFrame(
            "playerDeath"
        );


        this.dead =
            true;


        // =========================
        // PARA PLAYER
        // =========================

        this.body.setVelocity(
            0,
            0
        );


        this.body.body.enable =
            false;


        this.isShooting =
            false;


        this.isMeleeAttacking =
            false;


        // =========================
        // SPRITE DE MORTE
        // =========================

        this.sprite.anims.stop();


        this.sprite.setFrame(
            "playerDeath"
        );


        // Deixa o corpo caído
        // sem continuar mirando no mouse.

        this.sprite.setRotation(
            Phaser.Math.FloatBetween(
                -0.10,
                0.10
            )
        );


        this.sprite.setDepth(
            20
        );


        // =========================
        // AVISA A CENA
        // =========================

        if (
            typeof this.scene.handlePlayerDeath ===
            "function"
        ) {

            this.scene.handlePlayerDeath();

            return;
        }


        // Fallback caso alguma cena
        // não tenha handlePlayerDeath.

        this.scene.time.delayedCall(
            1000,

            () => {

                this.scene.scene.restart();
            }
        );
    }


    // =========================
    // GETTERS
    // =========================

    get x() {

        return this.body.x;
    }


    get y() {

        return this.body.y;
    }
}