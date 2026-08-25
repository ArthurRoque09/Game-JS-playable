import { MenuScene } from "./scenes/menuscene.js";
import { GameScene } from "./scenes/gamescene.js";
import { TutorialScene } from "./scenes/tutorialscene.js";

const config = {

    type: Phaser.AUTO,

    width: 1200,
    height: 800,

    backgroundColor: "#000000",

    audio: {
        disableWebAudio: true
    },


    // =========================
    // FÍSICA
    // =========================

    physics: {

        default: "arcade",

        arcade: {

            gravity: {
                y: 0
            },

            debug: false
        }
    },


    // =========================
    // CENAS
    // =========================

    scene: [
        MenuScene,
        TutorialScene,
        GameScene
    ]
};


const game =
    new Phaser.Game(
        config
    );

window.game = game;

// =========================
// CONTROLE DE VOLUME
// =========================

const volumeSlider =
    document.getElementById(
        "volume-slider"
    );


const volumeValue =
    document.getElementById(
        "volume-value"
    );


const muteButton =
    document.getElementById(
        "mute-button"
    );


// =========================
// VOLUME SALVO
// =========================

let masterVolume =
    Number(
        localStorage.getItem(
            "gameVolume"
        ) ?? 1
    );


masterVolume =
    Math.max(
        0,
        Math.min(
            1,
            masterVolume
        )
    );


let isMuted =
    localStorage.getItem(
        "gameMuted"
    ) === "true";


// =========================
// PEGA SOUND MANAGER
// =========================

function getSoundManager() {

    const scenes =
        game.scene.getScenes(
            true
        );


    if (
        scenes.length === 0
    ) {

        return null;
    }


    return scenes[0].sound;
}


// =========================
// APLICA VOLUME
// =========================

function applyVolume() {

    const soundManager =
        getSoundManager();


    if (
        !soundManager
    ) {

        return;
    }


    soundManager.setVolume(
        masterVolume
    );


    soundManager.setMute(
        isMuted
    );
}


// =========================
// ATUALIZA INTERFACE
// =========================

function updateVolumeUI() {

    const percentage =
        Math.round(
            masterVolume *
            100
        );


    volumeSlider.value =
        percentage;


    volumeValue.textContent =
        `${percentage}%`;


    // =========================
    // ÍCONE
    // =========================

    if (
        isMuted ||
        masterVolume === 0
    ) {

        muteButton.textContent =
            "🔇";

        return;
    }


    if (
        masterVolume <= 0.5
    ) {

        muteButton.textContent =
            "🔉";

        return;
    }


    muteButton.textContent =
        "🔊";
}


// =========================
// SLIDER
// =========================

volumeSlider.addEventListener(
    "input",

    () => {

        masterVolume =
            Number(
                volumeSlider.value
            ) / 100;


        // Se mexeu no volume,
        // pode sair do mute.

        if (
            masterVolume > 0
        ) {

            isMuted =
                false;
        }


        localStorage.setItem(
            "gameVolume",
            masterVolume
        );


        localStorage.setItem(
            "gameMuted",
            isMuted
        );


        applyVolume();

        updateVolumeUI();
    }
);


// =========================
// BOTÃO MUTE
// =========================

muteButton.addEventListener(
    "click",

    () => {

        isMuted =
            !isMuted;


        localStorage.setItem(
            "gameMuted",
            isMuted
        );


        applyVolume();

        updateVolumeUI();
    }
);


// =========================
// APLICA QUANDO UMA CENA ABRIR
// =========================

game.events.on(
    Phaser.Core.Events.POST_STEP,

    () => {

        const soundManager =
            getSoundManager();


        if (
            !soundManager
        ) {

            return;
        }


        // Só precisamos garantir
        // que o valor salvo chegue
        // ao Phaser.

        if (
            soundManager.volume !==
            masterVolume
        ) {

            soundManager.setVolume(
                masterVolume
            );
        }


        if (
            soundManager.mute !==
            isMuted
        ) {

            soundManager.setMute(
                isMuted
            );
        }
    }
);


// =========================
// ESTADO INICIAL
// =========================

updateVolumeUI();


// Dá um pequeno tempo para
// a primeira Scene inicializar.

setTimeout(
    () => {

        applyVolume();
    },

    100
);

// =========================
// FULLSCREEN
// =========================

const fullscreenButton =
    document.getElementById(
        "fullscreen-button"
    );


function updateFullscreenButton() {

    if (
        !fullscreenButton
    ) {

        return;
    }


    if (
        document.fullscreenElement
    ) {

        fullscreenButton.textContent =
            "✕";


        fullscreenButton.setAttribute(
            "aria-label",
            "Sair da tela cheia"
        );

    } else {

        fullscreenButton.textContent =
            "⛶";


        fullscreenButton.setAttribute(
            "aria-label",
            "Entrar em tela cheia"
        );
    }
}


async function toggleFullscreen() {

    try {

        if (
            document.fullscreenElement
        ) {

            await document.exitFullscreen();

        } else {

            const canvas =
                document.querySelector(
                    "canvas"
                );


            await canvas.requestFullscreen();
        }

    } catch (
    error
    ) {

        console.error(
            "Erro ao alternar fullscreen:",
            error
        );
    }
}


// =========================
// BOTÃO
// =========================

if (
    fullscreenButton
) {

    fullscreenButton.addEventListener(
        "click",
        () => {

            toggleFullscreen();
        }
    );
}


// =========================
// F11
// =========================

window.addEventListener(
    "keydown",

    (event) => {

        if (
            event.key !== "F11"
        ) {

            return;
        }


        event.preventDefault();


        toggleFullscreen();
    }
);


// =========================
// ATUALIZA ÍCONE
// =========================

document.addEventListener(
    "fullscreenchange",
    () => {

        updateFullscreenButton();
    }
);


// Estado inicial.

updateFullscreenButton();
