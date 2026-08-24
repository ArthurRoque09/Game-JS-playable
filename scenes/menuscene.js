export class MenuScene extends Phaser.Scene {

    constructor() {

        super(
            "MenuScene"
        );
    }


    // =========================
    // PRELOAD
    // =========================

    preload() {

        this.load.image(
            "menuBackground",
            "./assets/maps-menu/menu.png"
        );
    }


    // =========================
    // CREATE
    // =========================

    create() {

        // =========================
        // FUNDO
        // =========================

        const background =
            this.add.image(
                0,
                0,
                "menuBackground"
            );


        background.setOrigin(
            0,
            0
        );


        background.setDisplaySize(
            this.cameras.main.width,
            this.cameras.main.height
        );


        // =========================
        // REGIÃO DO BOTÃO
        // =========================

        const buttonX =
            this.cameras.main.width *
            0.39;


        const buttonY =
            this.cameras.main.height *
            0.785;


        const buttonWidth =
            this.cameras.main.width *
            0.22;


        const buttonHeight =
            this.cameras.main.height *
            0.11;


        const buttonCenterX =
            buttonX +
            buttonWidth / 2;


        const buttonCenterY =
            buttonY +
            buttonHeight / 2;


        // =========================
        // FRAME RECORTADO DO BOTÃO
        // =========================

        const texture =
            this.textures.get(
                "menuBackground"
            );


        if (
            !texture.has(
                "playButton"
            )
        ) {

            const source =
                texture.getSourceImage();


            const sourceScaleX =
                source.width /
                this.cameras.main.width;


            const sourceScaleY =
                source.height /
                this.cameras.main.height;


            texture.add(
                "playButton",
                0,

                buttonX *
                sourceScaleX,

                buttonY *
                sourceScaleY,

                buttonWidth *
                sourceScaleX,

                buttonHeight *
                sourceScaleY
            );
        }


        // =========================
        // BOTÃO VISUAL
        // =========================

        const playVisual =
            this.add.image(
                buttonCenterX,
                buttonCenterY,
                "menuBackground",
                "playButton"
            );


        playVisual.setDisplaySize(
            buttonWidth,
            buttonHeight
        );


        // IMPORTANTE:
        // salva a escala DEPOIS
        // de definir o tamanho visual.

        const baseScaleX =
            playVisual.scaleX;


        const baseScaleY =
            playVisual.scaleY;


        playVisual.setDepth(
            5
        );
        // =========================
        // ÁREA INTERATIVA
        // =========================

        const button =
            this.add.rectangle(
                buttonCenterX,
                buttonCenterY,
                buttonWidth,
                buttonHeight,
                0xffffff,
                0
            );


        button.setDepth(
            10
        );


        button.setInteractive({

            useHandCursor:
                true
        });


        /// =========================
        // HOVER
        // =========================

        button.on(
            "pointerover",

            () => {

                this.tweens.killTweensOf(
                    playVisual
                );


                playVisual.setTint(
                    0xaaffff
                );


                this.tweens.add({

                    targets:
                        playVisual,

                    scaleX:
                        baseScaleX * 1.12,

                    scaleY:
                        baseScaleY * 1.12,

                    duration:
                        170,

                    ease:
                        "Back.Out"
                });
            }
        );


        // =========================
        // SAI DO HOVER
        // =========================

        button.on(
            "pointerout",

            () => {

                this.tweens.killTweensOf(
                    playVisual
                );


                playVisual.clearTint();


                this.tweens.add({

                    targets:
                        playVisual,

                    scaleX:
                        baseScaleX,

                    scaleY:
                        baseScaleY,

                    duration:
                        140,

                    ease:
                        "Quad.Out"
                });
            }
        );


        // =========================
        // CLIQUE
        // =========================

        button.on(
            "pointerdown",

            () => {

                this.tweens.killTweensOf(
                    playVisual
                );


                playVisual.clearTint();


                this.tweens.add({

                    targets:
                        playVisual,

                    scaleX:
                        baseScaleX * 0.93,

                    scaleY:
                        baseScaleY * 0.93,

                    duration:
                        90,

                    ease:
                        "Quad.In",

                    onComplete:
                        () => {

                            this.scene.start(
                                "TutorialScene"
                            );
                        }
                });
            }
        );
    }
}