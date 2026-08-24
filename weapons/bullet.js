export class Bullet extends Phaser.GameObjects.Rectangle {

    constructor(
        scene,
        x,
        y,
        angle,
        speed,
        damage,
        owner
    ) {

        super(
            scene,
            x,
            y,
            16,
            3,
            0xffd36a
        );


        this.scene =
            scene;


        this.damage =
            damage;


        this.owner =
            owner;


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


        // =========================
        // HITBOX
        // =========================

        this.body.setSize(
            14,
            4
        );


        // =========================
        // ROTAÇÃO
        // =========================

        this.rotation =
            angle;


        // =========================
        // VISUAL
        // =========================

        this.setDepth(
            30
        );


        // =========================
        // VELOCIDADE
        // =========================

        this.body.setVelocity(
            Math.cos(angle) *
            speed,

            Math.sin(angle) *
            speed
        );
    }
}