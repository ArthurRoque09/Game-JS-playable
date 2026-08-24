export class ShellCasing extends Phaser.GameObjects.Sprite {

    constructor(
        scene,
        x,
        y,
        angle,
        shellType
    ) {

        ShellCasing.createFrames(
            scene
        );


        const frame =
            ShellCasing.getFrame(
                shellType
            );


        super(
            scene,
            x,
            y,
            "weaponSheet",
            frame
        );


        this.scene =
            scene;


        this.shellType =
            shellType;


        // =========================
        // CENA
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


        // =========================
        // TAMANHO
        // =========================

        if (
            shellType ===
            "shotgun"
        ) {

            this.setScale(
                0.055
            );

        } else {

            this.setScale(
                0.06
            );
        }


        this.setDepth(
            14
        );


        // =========================
        // DIREÇÃO DA EJEÇÃO
        // =========================

        const ejectAngle =
            angle +
            Math.PI / 2 +
            Phaser.Math.FloatBetween(
                -0.18,
                0.18
            );


        let ejectSpeed;


        if (
            shellType ===
            "shotgun"
        ) {

            ejectSpeed =
                Phaser.Math.Between(
                    100,
                    140
                );

        } else {

            ejectSpeed =
                Phaser.Math.Between(
                    130,
                    180
                );
        }


        this.body.setVelocity(
            Math.cos(
                ejectAngle
            ) *
            ejectSpeed,

            Math.sin(
                ejectAngle
            ) *
            ejectSpeed
        );


        // =========================
        // ROTAÇÃO INICIAL
        // =========================

        this.rotation =
            Phaser.Math.FloatBetween(
                0,
                Math.PI * 2
            );


        // =========================
        // DESACELERA
        // =========================

        scene.tweens.add({

            targets:
                this.body.velocity,

            x:
                0,

            y:
                0,

            duration:
                300,

            ease:
                "Quad.Out"
        });


        // =========================
        // GIRA E PARA
        // =========================

        const rotationAmount =
            Phaser.Math.FloatBetween(
                1.0,
                2.2
            );


        const direction =
            Phaser.Math.Between(
                0,
                1
            ) === 0
                ? -1
                : 1;


        scene.tweens.add({

            targets:
                this,

            rotation:
                this.rotation +
                rotationAmount *
                direction,

            duration:
                350,

            ease:
                "Quad.Out"
        });

        // =========================
        // LIMPEZA DO CARTUCHO
        // =========================

        scene.time.delayedCall(
            8000,

            () => {

                if (
                    this.active
                ) {

                    this.destroy();
                }
            }
        );
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
                "smallShell"
            )
        ) {

            texture.add(
                "smallShell",
                0,
                1206,
                613,
                267,
                197
            );
        }


        if (
            !texture.has(
                "shotgunShell"
            )
        ) {

            texture.add(
                "shotgunShell",
                0,
                1550,
                809,
                316,
                393
            );
        }
    }


    // =========================
    // FRAME DO CARTUCHO
    // =========================

    static getFrame(
        shellType
    ) {

        if (
            shellType ===
            "shotgun"
        ) {

            return "shotgunShell";
        }


        return "smallShell";
    }
}