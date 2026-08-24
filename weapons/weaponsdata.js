export const WEAPONS = {

    PISTOLA: {

        name: "PISTOLA",

        type: "single",

        automatic: false,

        damage: 100,

        shotCooldown: 400,

        bulletSpeed: 1650,

        bulletLifeTime: 2000,

        magazineSize: 30,

        pellets: 1,

        spread: 0,

        shellType: "small",

        soundKey:
            "pistolShot",

        soundVolume:
            0.5,

        soundStart:
            0,

        noiseRadius:
            1100,

        shootAnimation:
            "player-pistol-shoot"
    },


    DOZE: {

        name: "DOZE",

        type: "shotgun",

        automatic: false,

        damage: 100,

        shotCooldown: 850,

        bulletSpeed: 1650,

        bulletLifeTime: 1200,

        magazineSize: 8,

        pellets: 6,

        spread: 0.10,

        shellType:
            "shotgun",

        soundKey:
            "shotgunShot",

        soundVolume:
            0.1,

        soundStart:
            0.5,

        noiseRadius:
            1800,

        shootAnimation:
            "player-shotgun-shoot"
    },


    RIFLE: {

        name: "RIFLE",

        type: "rifle",

        automatic: true,

        damage: 100,

        shotCooldown: 120,

        bulletSpeed: 1800,

        bulletLifeTime: 2000,

        magazineSize: 30,

        pellets: 1,

        spread: 0.025,

        shellType:
            "small",

        soundKey:
            "rifleShot",

        soundVolume:
            1,

        // Onde começa UM disparo
        // dentro do arquivo.
        soundStart:
            0.15,

        // Quanto tempo desse áudio
        // será reproduzido.
        soundDuration:
            0.9,

        noiseRadius:
            1500,

        shootAnimation:
            "player-rifle-shoot"
    },

    FACAO: {

        name:
            "FACÃO",

        type:
            "melee",

        automatic:
            false,

        damage:
            100,

        shotCooldown:
            0,

        bulletSpeed:
            0,

        bulletLifeTime:
            0,

        magazineSize:
            0,

        shootAnimation:
            null,

        soundKey:
            "macheteSwing",

        soundVolume:
            0.5,

        soundStart:
            0,

        soundDuration:
            null,

        noiseRadius:
            0,

        pellets:
            0,

        spread:
            0,

        shellType:
            null
    }
};