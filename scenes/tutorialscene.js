import { Player } from "../entities/player.js";
import { Enemy } from "../entities/enemy.js";

import { GroundWeapon } from "../weapons/groundWeapon.js";
import { WEAPONS } from "../weapons/weaponsData.js";


export class TutorialScene extends Phaser.Scene {

    constructor() {

        super("TutorialScene");
    }


    // =========================
    // PRELOAD
    // =========================

    preload() {

        this.load.image(
            "playerSheet",
            "./assets/spritesheets/spritesheet-player.png"
        );

        this.load.image(
            "weaponSheet",
            "./assets/spritesheets/weapon-spritesheet.png"
        );

        this.load.image(
            "enemySheet",
            "./assets/spritesheets/spritesheet-enemy.png"
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
    }


    // =========================
    // CREATE
    // =========================

    create() {

        this.registry.set(
            "playerDied",
            false
        );

        this.cameras.main.setBackgroundColor(
            "#080808"
        );

        const screenWidth =
            this.cameras.main.width;

        const screenHeight =
            this.cameras.main.height;

        this.physics.world.setBounds(
            0,
            0,
            screenWidth,
            screenHeight
        );


        // =========================
        // GRUPOS
        // =========================

        this.walls =
            this.physics.add.staticGroup();

        this.bullets =
            this.physics.add.group();

        this.enemies =
            this.physics.add.group();


        // =========================
        // PLAYER
        // =========================

        this.player =
            new Player(
                this,
                screenWidth / 2,
                screenHeight / 2 + 70,
                this.walls
            );

        // O facão é permanente e já começa
        // disponível no tutorial.

        this.player.unlockMachete();

        this.startPlayerX =
            this.player.x;

        this.startPlayerY =
            this.player.y;


        // =========================
        // BALAS DO INIMIGO x PLAYER
        // =========================

        this.physics.add.overlap(
            this.bullets,
            this.player.body,
            (object1, object2) => {

                const bullet =
                    object1.owner !== undefined
                        ? object1
                        : object2;

                if (
                    !bullet ||
                    !bullet.active ||
                    bullet.owner !== "enemy" ||
                    this.player.dead
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
        );


        // =========================
        // INTERFACE
        // =========================

        this.title =
            this.add.text(
                screenWidth / 2,
                70,
                "TREINAMENTO",
                {
                    fontFamily: "Arial",
                    fontSize: "48px",
                    fontStyle: "bold",
                    color: "#ffffff"
                }
            );

        this.title.setOrigin(
            0.5
        );

        this.instruction =
            this.add.text(
                screenWidth / 2,
                145,
                "USE  W A S D  PARA SE MOVER",
                {
                    fontFamily: "Arial",
                    fontSize: "27px",
                    fontStyle: "bold",
                    color: "#ffffff",
                    align: "center"
                }
            );

        this.instruction
            .setOrigin(0.5)
            .setDepth(1000);

        this.skipText =
            this.add.text(
                screenWidth - 25,
                screenHeight - 25,
                "SEGURE [ESC] PARA PULAR",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    color: "#888888",
                    align: "right"
                }
            );

        this.skipText
            .setOrigin(1, 1)
            .setDepth(1000);


        // =========================
        // INPUT
        // =========================

        this.skipKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.ESC
            );

        this.interactKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            );


        // =========================
        // ESTADO DO TUTORIAL
        // =========================

        // 0: movimento
        // 1: mira
        // 2: teste do facão
        // 3: execução furtiva
        // 4: pegar pistola
        // 5: testar pistola
        // 6: acertar alvo
        // 7: inimigo real

        this.step = 0;
        this.transitioning = false;
        this.tutorialFinished = false;

        this.movementDistanceNeeded = 70;
        this.mouseDistanceNeeded = 80;
        this.weaponPickupDistance = 90;

        this.mouseStartX = null;
        this.mouseStartY = null;

        this.meleeStepTriggered = false;

        this.tutorialWeapon = null;
        this.target = null;

        this.stealthEnemy = null;
        this.stealthWalls = [];
        this.stealthVision = null;
        this.stealthStepCompleted = false;

        this.finalEnemy = null;
        this.finalEnemyCanFight = false;
        this.finalEnemyReactionEvent = null;

        this.skipTimer = 0;
        this.skipDuration = 800;

        this.createShootInput();
    }


    // =========================
    // UPDATE
    // =========================

    update(time, delta) {

        if (
            this.tutorialFinished
        ) {

            return;
        }

        this.player.update();

        this.updateFinalEnemy();
        this.updateTutorial();
        this.updateSkip(delta);
    }


    // =========================
    // CONTROLE DAS ETAPAS
    // =========================

    updateTutorial() {

        if (
            this.transitioning
        ) {

            return;
        }

        switch (this.step) {

            case 0:
                this.updateMovementStep();
                break;

            case 1:
                this.updateAimStep();
                break;

            case 2:
                this.updateMeleeTutorialStep();
                break;

            case 3:
                this.updateStealthTutorialStep();
                break;

            case 4:
                this.updateWeaponStep();
                break;
        }
    }


    // =========================
    // MOVIMENTO
    // =========================

    updateMovementStep() {

        const distance =
            Phaser.Math.Distance.Between(
                this.startPlayerX,
                this.startPlayerY,
                this.player.x,
                this.player.y
            );

        if (
            distance <
            this.movementDistanceNeeded
        ) {

            return;
        }

        this.completeMovementStep();
    }


    completeMovementStep() {

        if (
            this.transitioning
        ) {

            return;
        }

        this.transitioning = true;

        this.showSuccess(
            "✓ MOVIMENTO",
            () => {

                const pointer =
                    this.input.activePointer;

                this.mouseStartX =
                    pointer.x;

                this.mouseStartY =
                    pointer.y;

                this.step = 1;
                this.transitioning = false;

                this.setInstruction(
                    "MOVA O MOUSE PARA MIRAR"
                );
            }
        );
    }


    // =========================
    // MIRA
    // =========================

    updateAimStep() {

        if (
            this.mouseStartX === null ||
            this.mouseStartY === null
        ) {

            return;
        }

        const pointer =
            this.input.activePointer;

        const distance =
            Phaser.Math.Distance.Between(
                this.mouseStartX,
                this.mouseStartY,
                pointer.x,
                pointer.y
            );

        if (
            distance <
            this.mouseDistanceNeeded
        ) {

            return;
        }

        this.completeAimStep();
    }


    completeAimStep() {

        if (
            this.transitioning
        ) {

            return;
        }

        this.transitioning = true;

        this.showSuccess(
            "✓ MIRA",
            () => {

                this.step = 2;
                this.transitioning = false;
                this.meleeStepTriggered = false;

                this.setInstruction(
                    "PRESSIONE [ESPAÇO] PARA USAR O FACÃO"
                );
            }
        );
    }


    // =========================
    // TESTE DO FACÃO
    // =========================

    updateMeleeTutorialStep() {

        if (
            this.meleeStepTriggered ||
            !this.player.isMeleeAttacking
        ) {

            return;
        }

        this.meleeStepTriggered = true;
        this.completeMeleeTutorialStep();
    }


    completeMeleeTutorialStep() {

        if (
            this.transitioning
        ) {

            return;
        }

        this.transitioning = true;

        this.showSuccess(
            "✓ ATAQUE CORPO A CORPO",
            () => {

                this.step = 3;
                this.transitioning = false;

                this.createStealthTutorial();
            }
        );
    }


    // =========================
    // TUTORIAL STEALTH
    // =========================

    createStealthTutorial() {

        this.stealthStepCompleted = false;
        this.stealthWalls = [];

        const screenWidth =
            this.cameras.main.width;

        const screenHeight =
            this.cameras.main.height;

        const centerY =
            screenHeight / 2 + 70;

        const left =
            screenWidth * 0.16;

        const right =
            screenWidth * 0.84;

        const top =
            centerY - 105;

        const bottom =
            centerY + 105;

        const corridorWidth =
            right - left;

        const corridorHeight =
            bottom - top;

        this.player.body.setVelocity(
            0,
            0
        );

        this.player.body.setPosition(
            left + 85,
            centerY
        );

        this.player.updateVisualPosition();

        this.createStealthWall(
            left + corridorWidth / 2,
            top,
            corridorWidth,
            22
        );

        this.createStealthWall(
            left + corridorWidth / 2,
            bottom,
            corridorWidth,
            22
        );

        this.createStealthWall(
            left,
            centerY,
            22,
            corridorHeight
        );

        this.createStealthWall(
            right,
            centerY,
            22,
            corridorHeight
        );

        const enemyX =
            right - 150;

        const enemyY =
            centerY;

        this.stealthEnemy =
            new Enemy(
                this,
                enemyX,
                enemyY,
                "PISTOLA"
            );

        // O inimigo olha para a direita.
        // O player começa atrás dele.

        this.stealthEnemy.angle = 0;
        this.stealthEnemy.updateRotation();

        this.enemies.add(
            this.stealthEnemy
        );

        this.physics.add.collider(
            this.stealthEnemy,
            this.walls
        );

        this.createStealthVision(
            enemyX,
            enemyY
        );

        // Durante esta etapa, dano pela frente
        // é recusado. Só o ataque pelas costas mata.

        const originalTakeDamage =
            this.stealthEnemy.takeDamage.bind(
                this.stealthEnemy
            );

        this.stealthEnemy.takeDamage =
            (damage) => {

                if (
                    this.step !== 3 ||
                    this.stealthStepCompleted
                ) {

                    return false;
                }

                if (
                    !this.isPlayerBehindStealthEnemy()
                ) {

                    this.setInstruction(
                        "ATAQUE FRONTAL!\nFIQUE ATRÁS DO INIMIGO",
                        "#ff5555"
                    );

                    return false;
                }

                originalTakeDamage(
                    damage
                );

                if (
                    this.stealthEnemy.dead ||
                    !this.stealthEnemy.active
                ) {

                    this.completeStealthTutorial();
                }

                return true;
            };

        this.setInstruction(
            "APROXIME-SE SEM SER VISTO\nE ATAQUE O INIMIGO POR TRÁS"
        );
    }


    createStealthWall(
        x,
        y,
        width,
        height
    ) {

        const wall =
            this.add.rectangle(
                x,
                y,
                width,
                height,
                0x292929,
                1
            );

        wall.setStrokeStyle(
            2,
            0x777777,
            1
        );

        wall.setDepth(
            5
        );

        this.physics.add.existing(
            wall,
            true
        );

        this.walls.add(
            wall
        );

        this.stealthWalls.push(
            wall
        );

        return wall;
    }


    createStealthVision(
        enemyX,
        enemyY
    ) {

        this.stealthVision =
            this.add.graphics();

        this.stealthVision
            .fillStyle(
                0xff3333,
                0.16
            )
            .fillTriangle(
                enemyX + 10,
                enemyY,
                enemyX + 230,
                enemyY - 90,
                enemyX + 230,
                enemyY + 90
            );

        this.stealthVision.setDepth(
            2
        );
    }


    isPlayerBehindStealthEnemy() {

        if (
            !this.stealthEnemy ||
            !this.stealthEnemy.active
        ) {

            return false;
        }

        const enemyToPlayerAngle =
            Phaser.Math.Angle.Between(
                this.stealthEnemy.x,
                this.stealthEnemy.y,
                this.player.x,
                this.player.y
            );

        const enemyBackAngle =
            Phaser.Math.Angle.Wrap(
                this.stealthEnemy.angle +
                Math.PI
            );

        const difference =
            Math.abs(
                Phaser.Math.Angle.Wrap(
                    enemyToPlayerAngle -
                    enemyBackAngle
                )
            );

        return (
            difference <=
            Phaser.Math.DegToRad(65)
        );
    }


    updateStealthTutorialStep() {

        if (
            !this.stealthEnemy ||
            !this.stealthEnemy.active ||
            this.stealthStepCompleted
        ) {

            return;
        }

        const distance =
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.stealthEnemy.x,
                this.stealthEnemy.y
            );

        const isBehind =
            this.isPlayerBehindStealthEnemy();

        if (
            !isBehind
        ) {

            this.setInstruction(
                "EVITE O CONE VERMELHO\nFIQUE ATRÁS DO INIMIGO",
                "#ffcc33"
            );

            return;
        }

        if (
            distance > 125
        ) {

            this.setInstruction(
                "APROXIME-SE PELAS COSTAS DO INIMIGO"
            );

            return;
        }

        this.setInstruction(
            "EXECUÇÃO FURTIVA\nPRESSIONE [ESPAÇO]",
            "#ffd900"
        );
    }


    completeStealthTutorial() {

        if (
            this.stealthStepCompleted ||
            this.transitioning
        ) {

            return;
        }

        this.stealthStepCompleted = true;
        this.transitioning = true;

        this.showSuccess(
            "✓ EXECUÇÃO FURTIVA",
            () => {

                this.cleanupStealthTutorial();

                this.step = 4;
                this.transitioning = false;

                this.createTutorialWeapon();

                this.setInstruction(
                    "APROXIME-SE DA PISTOLA"
                );
            }
        );
    }


    cleanupStealthTutorial() {

        for (
            const wall
            of this.stealthWalls
        ) {

            if (
                !wall
            ) {

                continue;
            }

            this.walls.remove(
                wall,
                false,
                false
            );

            wall.destroy();
        }

        this.stealthWalls = [];

        if (
            this.stealthVision
        ) {

            this.stealthVision.destroy();
            this.stealthVision = null;
        }

        if (
            this.stealthEnemy
        ) {

            this.enemies.remove(
                this.stealthEnemy,
                false,
                false
            );

            this.stealthEnemy.destroy();
            this.stealthEnemy = null;
        }
    }


    // =========================
    // PISTOLA NO CHÃO
    // =========================

    createTutorialWeapon() {

        const weaponX =
            this.cameras.main.width *
            0.72;

        const weaponY =
            this.cameras.main.height *
            0.70;

        this.tutorialWeapon =
            new GroundWeapon(
                this,
                weaponX,
                weaponY,
                "PISTOLA",
                WEAPONS.PISTOLA
            );
    }


    updateWeaponStep() {

        if (
            !this.tutorialWeapon ||
            !this.tutorialWeapon.active
        ) {

            return;
        }

        const distance =
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.tutorialWeapon.x,
                this.tutorialWeapon.y
            );

        if (
            distance >
            this.weaponPickupDistance
        ) {

            this.setInstruction(
                "APROXIME-SE DA PISTOLA"
            );

            return;
        }

        this.setInstruction(
            "PRESSIONE [E] PARA PEGAR A PISTOLA",
            "#ffd900"
        );

        if (
            Phaser.Input.Keyboard.JustDown(
                this.interactKey
            )
        ) {

            this.pickupTutorialWeapon();
        }
    }


    pickupTutorialWeapon() {

        if (
            !this.tutorialWeapon ||
            !this.tutorialWeapon.active
        ) {

            return;
        }

        const weaponData =
            this.tutorialWeapon.getWeaponData();

        const weaponKey =
            this.tutorialWeapon.getWeaponKey();

        const ammo =
            this.tutorialWeapon.getAmmo();

        this.player.equipWeapon(
            weaponKey,
            weaponData,
            ammo
        );

        this.tutorialWeapon.destroy();
        this.tutorialWeapon = null;

        this.transitioning = true;

        this.showSuccess(
            "✓ PISTOLA ADQUIRIDA",
            () => {

                this.step = 5;
                this.transitioning = false;

                this.setInstruction(
                    "BOTÃO ESQUERDO PARA TESTAR A PISTOLA"
                );
            }
        );
    }


    // =========================
    // INPUT E TESTE DA PISTOLA
    // =========================

    createShootInput() {

        this.input.on(
            "pointerdown",
            (pointer) => {

                if (
                    !pointer.leftButtonDown() ||
                    this.transitioning ||
                    this.tutorialFinished ||
                    this.step < 5 ||
                    !this.player.weapon ||
                    this.player.dead
                ) {

                    return;
                }

                const fired =
                    this.player.shoot(
                        this.bullets
                    );

                if (
                    !fired
                ) {

                    return;
                }

                if (
                    this.step === 5 &&
                    this.player.currentWeapon === "PISTOLA"
                ) {

                    this.completePistolTest();
                }
            }
        );
    }


    completePistolTest() {

        if (
            this.transitioning
        ) {

            return;
        }

        this.transitioning = true;

        this.showSuccess(
            "✓ PISTOLA TESTADA",
            () => {

                // A bala do disparo de teste não deve
                // acertar o alvo criado em seguida.

                this.bullets.clear(
                    true,
                    true
                );

                this.step = 6;
                this.transitioning = false;

                this.createTarget();

                this.setInstruction(
                    "AGORA ACERTE O ALVO"
                );
            }
        );
    }


    // =========================
    // ALVO
    // =========================

    createTarget() {

        const targetX =
            this.cameras.main.width *
            0.75;

        const targetY =
            this.cameras.main.height *
            0.55;

        this.target =
            this.add.rectangle(
                targetX,
                targetY,
                42,
                42,
                0xcc3333
            );

        this.target.setDepth(
            10
        );

        this.physics.add.existing(
            this.target
        );

        this.target.body.setImmovable(
            true
        );

        this.physics.add.overlap(
            this.bullets,
            this.target,
            (object1, object2) => {

                const bullet =
                    object1.owner !== undefined
                        ? object1
                        : object2;

                if (
                    this.step !== 6 ||
                    !bullet ||
                    !bullet.active ||
                    bullet.owner !== "player"
                ) {

                    return;
                }

                bullet.destroy();
                this.destroyTarget();
            }
        );
    }


    destroyTarget() {

        if (
            !this.target ||
            !this.target.active
        ) {

            return;
        }

        this.target.destroy();
        this.target = null;

        this.transitioning = true;

        this.showSuccess(
            "✓ ALVO ATINGIDO",
            () => {

                this.bullets.clear(
                    true,
                    true
                );

                this.step = 7;
                this.transitioning = false;

                this.setInstruction(
                    "AGORA É PRA VALER.\nELIMINE O INIMIGO"
                );

                this.createFinalEnemy();
            }
        );
    }


    // =========================
    // INIMIGO FINAL
    // =========================

    createFinalEnemy() {

        this.removeFinalEnemy();

        const enemyX =
            this.cameras.main.width *
            0.78;

        const enemyY =
            this.cameras.main.height *
            0.55;

        this.finalEnemy =
            new Enemy(
                this,
                enemyX,
                enemyY,
                "PISTOLA"
            );

        this.enemies.add(
            this.finalEnemy
        );

        this.finalEnemyCanFight = false;

        this.finalEnemyReactionEvent =
            this.time.delayedCall(
                2500,
                () => {

                    if (
                        this.step === 7 &&
                        this.finalEnemy &&
                        this.finalEnemy.active &&
                        !this.transitioning &&
                        !this.player.dead
                    ) {

                        this.finalEnemyCanFight = true;
                    }

                    this.finalEnemyReactionEvent = null;
                }
            );

        this.physics.add.overlap(
            this.bullets,
            this.finalEnemy,
            (object1, object2) => {

                const bullet =
                    object1.owner !== undefined
                        ? object1
                        : object2;

                const enemy =
                    object1 === bullet
                        ? object2
                        : object1;

                if (
                    this.step !== 7 ||
                    !bullet ||
                    !bullet.active ||
                    bullet.owner !== "player" ||
                    !enemy ||
                    !enemy.active
                ) {

                    return;
                }

                const damage =
                    bullet.damage;

                bullet.destroy();
                enemy.takeDamage(damage);

                if (
                    enemy.dead ||
                    !enemy.active
                ) {

                    this.completeTutorial();
                }
            }
        );
    }


    updateFinalEnemy() {

        if (
            this.step !== 7 ||
            !this.finalEnemy
        ) {

            return;
        }

        // O facão causa dano diretamente pelo Player,
        // então também verificamos a morte aqui.

        if (
            this.finalEnemy.dead ||
            !this.finalEnemy.active
        ) {

            this.completeTutorial();
            return;
        }

        if (
            this.transitioning ||
            !this.finalEnemyCanFight ||
            this.player.dead
        ) {

            return;
        }

        const distance =
            Phaser.Math.Distance.Between(
                this.finalEnemy.x,
                this.finalEnemy.y,
                this.player.x,
                this.player.y
            );

        const angle =
            Phaser.Math.Angle.Between(
                this.finalEnemy.x,
                this.finalEnemy.y,
                this.player.x,
                this.player.y
            );

        this.finalEnemy.angle =
            angle;

        this.finalEnemy.updateRotation();

        if (
            distance >
            this.finalEnemy.maxShootRange ||
            !this.finalEnemy.weapon
        ) {

            return;
        }

        this.finalEnemy.stop();

        const fired =
            this.finalEnemy.weapon.shoot(
                this.finalEnemy,
                this.player.x,
                this.player.y,
                this.bullets,
                "enemy"
            );

        if (
            fired
        ) {

            this.finalEnemy.playShootAnimation();
        }
    }


    removeFinalEnemy() {

        if (
            this.finalEnemyReactionEvent
        ) {

            this.finalEnemyReactionEvent.remove(
                false
            );

            this.finalEnemyReactionEvent = null;
        }

        if (
            this.finalEnemy
        ) {

            this.enemies.remove(
                this.finalEnemy,
                false,
                false
            );

            this.finalEnemy.destroy();
            this.finalEnemy = null;
        }

        this.finalEnemyCanFight = false;
    }


    // =========================
    // MORTE E NOVA TENTATIVA
    // =========================

    handlePlayerDeath() {

        if (
            this.step !== 7 ||
            this.tutorialFinished
        ) {

            return;
        }

        this.removeFinalEnemy();

        this.bullets.clear(
            true,
            true
        );

        this.player.health = 100;
        this.player.dead = false;
        this.player.isShooting = false;
        this.player.isMeleeAttacking = false;

        this.player.body.body.enable = true;

        this.player.body.setVelocity(
            0,
            0
        );

        this.player.body.setPosition(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 70
        );

        this.player.sprite.setRotation(
            0
        );

        this.player.updateVisualPosition();

        if (
            this.player.weapon
        ) {

            this.player.weapon.ammo =
                this.player.weapon.magazineSize;
        }

        this.player.setWeaponIdle();

        this.transitioning = false;

        this.setInstruction(
            "TENTE NOVAMENTE.\nELIMINE O INIMIGO"
        );

        this.time.delayedCall(
            500,
            () => {

                if (
                    this.step === 7 &&
                    !this.tutorialFinished
                ) {

                    this.createFinalEnemy();
                }
            }
        );
    }


    // =========================
    // TUTORIAL CONCLUÍDO
    // =========================

    completeTutorial() {

        if (
            this.transitioning ||
            this.tutorialFinished
        ) {

            return;
        }

        this.transitioning = true;
        this.finalEnemyCanFight = false;

        if (
            this.finalEnemyReactionEvent
        ) {

            this.finalEnemyReactionEvent.remove(
                false
            );

            this.finalEnemyReactionEvent = null;
        }

        if (
            this.finalEnemy &&
            this.finalEnemy.active
        ) {

            this.finalEnemy.stop();
        }

        this.showSuccess(
            "✓ TREINAMENTO CONCLUÍDO",
            () => {

                this.tutorialFinished = true;

                localStorage.setItem(
                    "tutorialCompleted",
                    "true"
                );

                this.registry.set(
                    "playerDied",
                    false
                );

                this.cameras.main.fadeOut(
                    700,
                    0,
                    0,
                    0
                );

                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events
                        .FADE_OUT_COMPLETE,
                    () => {

                        this.scene.start(
                            "GameScene"
                        );
                    }
                );
            }
        );
    }


    // =========================
    // INTERFACE AUXILIAR
    // =========================

    setInstruction(
        text,
        color = "#ffffff"
    ) {

        this.instruction.setText(
            text
        );

        this.instruction.setColor(
            color
        );
    }


    showSuccess(
        text,
        onComplete
    ) {

        this.setInstruction(
            text,
            "#66ff99"
        );

        this.tweens.add({
            targets: this.instruction,
            scaleX: 1.18,
            scaleY: 1.18,
            duration: 120,
            yoyo: true,
            ease: "Quad.Out",
            onComplete: () => {

                this.time.delayedCall(
                    250,
                    () => {

                        if (
                            typeof onComplete === "function"
                        ) {

                            onComplete();
                        }
                    }
                );
            }
        });
    }


    // =========================
    // PULAR TUTORIAL
    // =========================

    updateSkip(delta) {

        if (
            this.skipKey.isDown
        ) {

            this.skipTimer +=
                delta;

            const progress =
                Phaser.Math.Clamp(
                    this.skipTimer /
                    this.skipDuration,
                    0,
                    1
                );

            const blocks =
                Math.floor(
                    progress *
                    10
                );

            this.skipText.setText(
                "SEGURE [ESC] PARA PULAR\n" +
                "█".repeat(blocks) +
                "░".repeat(10 - blocks)
            );

            this.skipText.setColor(
                "#ffffff"
            );

            if (
                this.skipTimer >=
                this.skipDuration
            ) {

                this.skipTutorial();
            }

            return;
        }

        this.skipTimer = 0;

        this.skipText.setText(
            "SEGURE [ESC] PARA PULAR"
        );

        this.skipText.setColor(
            "#888888"
        );
    }


    skipTutorial() {

        if (
            this.tutorialFinished
        ) {

            return;
        }

        this.tutorialFinished = true;

        localStorage.setItem(
            "tutorialCompleted",
            "true"
        );

        this.registry.set(
            "playerDied",
            false
        );

        this.scene.start(
            "GameScene"
        );
    }
}
