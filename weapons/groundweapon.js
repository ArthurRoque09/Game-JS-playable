export class GroundWeapon extends Phaser.GameObjects.Sprite {

    constructor(
        scene,
        x,
        y,
        weaponKey,
        weaponData,
        ammo = null
    ) {

        // =========================
        // CRIA FRAMES DAS ARMAS
        // =========================

        GroundWeapon.createFrames(
            scene
        );


        const frameKey =
            GroundWeapon.getFrameKey(
                weaponKey
            );


        super(
            scene,
            x,
            y,
            "weaponSheet",
            frameKey
        );


        this.scene =
            scene;


        // =========================
        // DADOS DA ARMA
        // =========================

        this.weaponKey =
            weaponKey;


        this.weaponData =
            weaponData;


        this.ammo =
            ammo !== null
                ? ammo
                : weaponData.magazineSize;


        // =========================
        // ADICIONA À CENA
        // =========================

        scene.add.existing(
            this
        );


        // =========================
        // FÍSICA
        // =========================

        scene.physics.add.existing(
            this
        );


        this.body.setAllowGravity(
            false
        );


        this.body.setImmovable(
            true
        );


        this.body.moves =
            false;


        // =========================
        // HITBOX
        // =========================

        this.configureHitbox();


        // =========================
        // VISUAL
        // =========================

        this.configureVisual();


        this.setDepth(
            15
        );

        // =========================
        // DESTAQUE VISUAL
        // =========================

        this.createHighlight();


        // Pequena rotação aleatória
        // para parecer largada no chão.

        this.setRotation(
            Phaser.Math.FloatBetween(
                -0.25,
                0.25
            )
        );
    }


    // =========================
    // DESTAQUE DA ARMA
    // =========================

    createHighlight() {

        // =========================
        // HALO
        // =========================

        this.highlight =
            this.scene.add.ellipse(
                this.x,
                this.y,
                70,
                34,
                0x66ccff,
                0.16
            );


        this.highlight.setDepth(
            13
        );


        // =========================
        // PULSAÇÃO DO HALO
        // =========================

        this.scene.tweens.add({

            targets:
                this.highlight,

            alpha:
            {
                from: 0.10,
                to: 0.28
            },

            scaleX:
            {
                from: 0.90,
                to: 1.10
            },

            scaleY:
            {
                from: 0.90,
                to: 1.10
            },

            duration:
                700,

            yoyo:
                true,

            repeat:
                -1,

            ease:
                "Sine.InOut"
        });


        // =========================
        // PULSAÇÃO DA ARMA
        // =========================

        const baseScaleX =
            this.scaleX;


        const baseScaleY =
            this.scaleY;


        this.scene.tweens.add({

            targets:
                this,

            scaleX:
                baseScaleX *
                1.06,

            scaleY:
                baseScaleY *
                1.06,

            duration:
                700,

            yoyo:
                true,

            repeat:
                -1,

            ease:
                "Sine.InOut"
        });
    }

    // =========================
    // CRIA FRAMES
    // =========================

    static createFrames(
        scene
    ) {

        const texture =
            scene.textures.get(
                "weaponSheet"
            );


        if (
            !texture.has(
                "groundRifle"
            )
        ) {

            texture.add(
                "groundRifle",
                0,
                73,
                160,
                637,
                220
            );
        }


        if (
            !texture.has(
                "groundShotgun"
            )
        ) {

            texture.add(
                "groundShotgun",
                0,
                809,
                187,
                595,
                139
            );
        }


        if (
            !texture.has(
                "groundPistol"
            )
        ) {

            texture.add(
                "groundPistol",
                0,
                1633,
                199,
                272,
                177
            );
        }


        if (
            !texture.has(
                "groundMachete"
            )
        ) {

            texture.add(
                "groundMachete",
                0,
                161,
                663,
                748,
                515
            );
        }
    }


    // =========================
    // FRAME DA ARMA
    // =========================

    static getFrameKey(
        weaponKey
    ) {

        switch (
        weaponKey
        ) {

            case "PISTOLA":

                return "groundPistol";


            case "DOZE":

                return "groundShotgun";


            case "RIFLE":
            case "AK":

                return "groundRifle";


            case "FACAO":

                return "groundMachete";


            default:

                return "groundPistol";
        }
    }
    // =========================
    // ANIMAÇÃO DE DROP
    // =========================

    // =========================
    // ANIMAÇÃO DE DROP
    // =========================

    dropFromEnemy(
        enemyAngle = 0,
        walls = null
    ) {

        // =========================
        // LIBERA MOVIMENTO
        // =========================

        this.body.setImmovable(
            false
        );


        this.body.moves =
            true;


        // =========================
        // COLISÃO COM PAREDES
        // =========================

        if (
            walls
        ) {

            this.dropCollider =
                this.scene.physics.add.collider(
                    this,
                    walls
                );
        }


        // =========================
        // DIREÇÃO DO PULO
        // =========================

        const side =
            Phaser.Math.Between(
                0,
                1
            ) === 0
                ? -1
                : 1;


        const dropAngle =
            enemyAngle +
            (
                Math.PI / 2
            ) *
            side +
            Phaser.Math.FloatBetween(
                -0.35,
                0.35
            );


        // =========================
        // FORÇA
        // =========================

        const force =
            Phaser.Math.Between(
                110,
                160
            );


        this.body.setVelocity(
            Math.cos(
                dropAngle
            ) *
            force,

            Math.sin(
                dropAngle
            ) *
            force
        );


        // =========================
        // GIRO
        // =========================

        const rotationDirection =
            Phaser.Math.Between(
                0,
                1
            ) === 0
                ? -1
                : 1;


        this.scene.tweens.add({

            targets:
                this,

            rotation:
                this.rotation +
                Phaser.Math.FloatBetween(
                    0.7,
                    1.5
                ) *
                rotationDirection,

            duration:
                380,

            ease:
                "Quad.Out"
        });


        // =========================
        // DESACELERA
        // =========================

        this.scene.tweens.add({

            targets:
                this.body.velocity,

            x:
                0,

            y:
                0,

            duration:
                420,

            ease:
                "Quad.Out",

            onComplete:
                () => {

                    if (
                        !this.active ||
                        !this.body
                    ) {

                        return;
                    }


                    this.body.setVelocity(
                        0,
                        0
                    );


                    this.body.moves =
                        false;


                    this.body.setImmovable(
                        true
                    );


                    // =========================
                    // REMOVE COLLIDER TEMPORÁRIO
                    // =========================

                    if (
                        this.dropCollider
                    ) {

                        this.dropCollider.destroy();

                        this.dropCollider =
                            null;
                    }
                }
        });
    }


    // =========================
    // VISUAL
    // =========================

    configureVisual() {

        switch (
        this.weaponKey
        ) {

            case "PISTOLA":

                this.setScale(
                    0.13
                );

                break;


            case "DOZE":

                this.setScale(
                    0.15
                );

                break;


            case "RIFLE":
            case "AK":

                this.setScale(
                    0.15
                );

                break;


            case "FACAO":

                this.setScale(
                    0.07
                );

                break;


            default:

                this.setScale(
                    0.13
                );

                break;
        }
    }

    // =========================
    // HITBOX
    // =========================

    configureHitbox() {

        switch (
        this.weaponKey
        ) {

            case "PISTOLA":

                this.body.setSize(
                    32,
                    22
                );

                break;


            case "DOZE":

                this.body.setSize(
                    60,
                    20
                );

                break;


            case "RIFLE":
            case "AK":

                this.body.setSize(
                    70,
                    24
                );

                break;

            case "FACAO":

                this.body.setSize(
                    80,
                    34
                );

                break;


            default:

                this.body.setSize(
                    35,
                    22
                );

                break;
        }
    }


    // =========================
    // DADOS
    // =========================

    getWeaponData() {

        return this.weaponData;
    }


    getWeaponKey() {

        return this.weaponKey;
    }


    getAmmo() {

        return this.ammo;
    }
}