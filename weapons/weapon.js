import { Bullet } from "./bullet.js";
import { ShellCasing } from "./shellcasing.js";


export class Weapon {

    constructor(
        scene,
        data
    ) {

        this.scene =
            scene;


        this.name =
            data.name;


        this.type =
            data.type;


        this.automatic =
            data.automatic;


        this.damage =
            data.damage;


        this.shotCooldown =
            data.shotCooldown;


        this.bulletSpeed =
            data.bulletSpeed;


        this.bulletLifeTime =
            data.bulletLifeTime;


        this.magazineSize =
            data.magazineSize;


        this.ammo =
            this.magazineSize;


        this.shootAnimation =
            data.shootAnimation;

        this.soundKey =
            data.soundKey ?? null;


        this.soundStart =
            data.soundStart ?? 0;


        this.soundDuration =
            data.soundDuration ?? null;

        this.soundVolume =
            data.soundVolume ?? 1;


        this.noiseRadius =
            data.noiseRadius ?? 0;

        // =========================
        // CONFIGURAÇÕES ESPECIAIS
        // =========================

        this.pellets =
            data.pellets ?? 1;


        this.spread =
            data.spread ?? 0;

        this.shellType =
            data.shellType ?? null;


        this.lastShotTime =
            0;
    }


    // =========================
    // PODE ATIRAR?
    // =========================

    canShoot(
        owner
    ) {

        // Apenas o player
        // possui munição limitada.

        if (
            owner === "player" &&
            this.ammo <= 0
        ) {

            return false;
        }


        const now =
            this.scene.time.now;


        return (
            now -
            this.lastShotTime >=
            this.shotCooldown
        );
    }


    // =========================
    // DISPARO UNIVERSAL
    // =========================

    shoot(
        shooter,
        targetX,
        targetY,
        bulletsGroup,
        owner
    ) {

        // =========================
        // PODE ATIRAR?
        // =========================

        if (
            !this.canShoot(
                owner
            )
        ) {

            return false;
        }


        // =========================
        // ANIMAÇÃO EM ANDAMENTO
        // =========================

        if (
            shooter.isShooting === true
        ) {

            return false;
        }


        // =========================
        // ÂNGULO BASE
        // =========================

        const baseAngle =
            Phaser.Math.Angle.Between(
                shooter.x,
                shooter.y,
                targetX,
                targetY
            );


        // =========================
        // POSIÇÃO DO CANO
        // =========================

        const gunPosition =
            shooter.getGunPosition(
                baseAngle
            );


        /// =========================
        // CRIA PROJÉTEIS
        // =========================

        for (
            let i = 0;
            i < this.pellets;
            i++
        ) {

            let shotAngle =
                baseAngle;


            // =========================
            // SPREAD
            // =========================

            if (
                this.spread > 0
            ) {

                const randomOffset =
                    Phaser.Math.FloatBetween(
                        -this.spread,
                        this.spread
                    );


                shotAngle +=
                    randomOffset;
            }


            // =========================
            // CRIA BALA
            // =========================

            this.createBullet(
                gunPosition.x,
                gunPosition.y,
                shotAngle,
                bulletsGroup,
                owner
            );
        }


        // =========================
        // EJETA CARTUCHO
        // =========================

        if (
            owner === "player" &&
            this.shellType !== null
        ) {

            this.ejectShell(
                shooter,
                baseAngle
            );
        }

        // =========================
        // GASTA MUNIÇÃO
        // =========================

        // Mesmo que a doze crie
        // vários pellets,
        // consome apenas 1 cartucho.

        if (
            owner === "player"
        ) {

            this.ammo--;
        }


        // =========================
        // ANIMAÇÃO
        // =========================

        if (
            typeof shooter.startShooting ===
            "function"
        ) {

            shooter.startShooting(
                this.shootAnimation
            );
        }


        // =========================
        // COOLDOWN
        // =========================

        this.lastShotTime =
            this.scene.time.now;

        // =========================
        // SOM DO DISPARO
        // =========================

        this.playShotSound();

        // =========================
        // BARULHO NO MUNDO
        // =========================

        if (
            typeof this.scene.emitNoise ===
            "function"
        ) {

            this.scene.emitNoise(
                shooter.x,
                shooter.y,
                this.noiseRadius,
                owner
            );
        }


        return true;
    }

    // =========================
    // REPRODUZ SOM DO DISPARO
    // =========================

    playShotSound() {

        if (
            !this.soundKey ||
            !this.scene.cache.audio.exists(
                this.soundKey
            )
        ) {

            return;
        }


        let shotSound =
            null;


        try {

            shotSound =
                this.scene.sound.add(
                    this.soundKey
                );


            const totalDuration =
                shotSound.duration;


            if (
                !Number.isFinite(
                    totalDuration
                ) ||
                totalDuration <= 0
            ) {

                shotSound.destroy();

                return;
            }


            const requestedStart =
                Number(
                    this.soundStart
                );


            const safeStart =
                Phaser.Math.Clamp(
                    Number.isFinite(
                        requestedStart
                    )
                        ? requestedStart
                        : 0,

                    0,
                    Math.max(
                        0,
                        totalDuration - 0.01
                    )
                );


            const remainingDuration =
                totalDuration -
                safeStart;


            let safeDuration =
                remainingDuration;


            if (
                this.soundDuration !== null
            ) {

                const requestedDuration =
                    Number(
                        this.soundDuration
                    );


                if (
                    Number.isFinite(
                        requestedDuration
                    )
                ) {

                    safeDuration =
                        Phaser.Math.Clamp(
                            requestedDuration,
                            0.01,
                            remainingDuration
                        );
                }
            }


            const needsMarker =
                safeStart > 0 ||
                this.soundDuration !== null;


            let played =
                false;


            if (
                needsMarker
            ) {

                shotSound.addMarker({

                    name:
                        "shot",

                    start:
                        safeStart,

                    duration:
                        safeDuration,

                    config: {

                        volume:
                            this.soundVolume
                    }
                });


                played =
                    shotSound.play(
                        "shot"
                    );

            } else {

                played =
                    shotSound.play({

                        volume:
                            this.soundVolume
                    });
            }


            if (
                !played
            ) {

                shotSound.destroy();

                return;
            }


            let cleaned =
                false;


            const cleanup =
                () => {

                    if (
                        cleaned
                    ) {

                        return;
                    }


                    cleaned =
                        true;


                    if (
                        shotSound
                    ) {

                        shotSound.destroy();


                        shotSound =
                            null;
                    }
                };


            shotSound.once(
                "complete",
                cleanup
            );


            shotSound.once(
                "stop",
                cleanup
            );

        } catch (
        error
        ) {

            console.error(
                "Erro ao reproduzir áudio:",
                this.soundKey,
                error
            );


            if (
                shotSound
            ) {

                shotSound.destroy();
            }
        }
    }


    // =========================
    // CRIA UMA BALA
    // =========================

    createBullet(
        x,
        y,
        angle,
        bulletsGroup,
        owner
    ) {

        const bullet =
            new Bullet(
                this.scene,

                x,
                y,

                angle,

                this.bulletSpeed,

                this.damage,

                owner
            );


        bulletsGroup.add(
            bullet
        );


        // O Physics Group pode alterar
        // o body ao adicionar a bala.
        // Por isso aplicamos velocidade
        // novamente DEPOIS do add().

        bullet.body.setVelocity(
            Math.cos(angle) *
            this.bulletSpeed,

            Math.sin(angle) *
            this.bulletSpeed
        );


        // =========================
        // TEMPO DE VIDA
        // =========================

        this.scene.time.delayedCall(

            this.bulletLifeTime,

            () => {

                if (
                    bullet.active
                ) {

                    bullet.destroy();
                }
            }
        );
    }


    // =========================
    // EJETA MUNIÇÃO
    // =========================

    ejectShell(
        shooter,
        angle
    ) {

        const sideDistance =
            22;


        const backDistance =
            5;


        const shellX =
            shooter.x +
            Math.cos(
                angle +
                Math.PI / 2
            ) *
            sideDistance -
            Math.cos(
                angle
            ) *
            backDistance;


        const shellY =
            shooter.y +
            Math.sin(
                angle +
                Math.PI / 2
            ) *
            sideDistance -
            Math.sin(
                angle
            ) *
            backDistance;


        new ShellCasing(
            this.scene,
            shellX,
            shellY,
            angle,
            this.shellType
        );
    }
}
