import Phaser from 'phaser';
import CodeAutocomplete, { createLevel1Suggestions } from './CodeAutocomplete.js';
import CodeValidator from './CodeValidator.js';
import Level1Scene from './scenes/Level1Scene.js';

const validator = new CodeValidator();
const editor = document.getElementById('code-editor');
const runButton = document.getElementById('run-code');
const resetButton = document.getElementById('reset');
const hintButton = document.getElementById('hint');
const feedback = document.getElementById('feedback');
const hintText = document.getElementById('hint-text');
const waterCount = document.getElementById('water-count');
const fireCount = document.getElementById('fire-count');
const missionStars = document.getElementById('mission-stars');
const targetWater = document.getElementById('target-water');
const targetFire = document.getElementById('target-fire');
const targetExtinguish = document.getElementById('target-extinguish');
const starterCode = editor.value;
const defaultHint = 'Susun instruksi dari atas ke bawah.';
const completedTargets = {
    water: false,
    fire: false,
    extinguish: false,
};

function renderMissionState(state = {}) {
    if (Number.isFinite(state.water)) {
        waterCount.textContent = state.water;
    }

    fireCount.textContent = state.fireExtinguished ? '0' : '1';
    completedTargets.water ||= state.water >= state.requiredWater;
    completedTargets.fire ||= state.atFire;
    completedTargets.extinguish ||= state.fireExtinguished;

    targetWater.classList.toggle('is-complete', completedTargets.water);
    targetFire.classList.toggle('is-complete', completedTargets.fire);
    targetExtinguish.classList.toggle('is-complete', completedTargets.extinguish);
    missionStars.textContent = Object.values(completedTargets).filter(Boolean).length;
}

function resetMissionState() {
    for (const target of Object.keys(completedTargets)) {
        completedTargets[target] = false;
    }

    renderMissionState({ water: 0, fireExtinguished: false });
}

const scene = new Level1Scene({
    assetBaseUrl: document.getElementById('game-container').dataset.assetBaseUrl,
    onReady() {
        runButton.disabled = false;
        resetButton.disabled = false;
        feedback.textContent = 'Siap. Berdiri di penanda merah dekat pompa, lalu atur jumlah_air.';
    },
    onLoadError() {
        feedback.dataset.state = 'error';
        feedback.textContent = 'Aset game gagal dimuat. Muat ulang halaman untuk mencoba lagi.';
    },
    onStateChange: renderMissionState,
});
const autocomplete = new CodeAutocomplete(
    editor,
    document.getElementById('code-suggestions'),
    createLevel1Suggestions(scene.requiredWater),
);
const hints = [
    'Perintah dibaca dari atas ke bawah. Berdirilah tepat di atas penanda merah sebelum mengambil air atau menyemprot.',
    'Dari titik awal, gunakan atas(3) untuk mencapai penanda pompa. Setelah itu tulis jumlah_air = 3.',
    `Api membutuhkan minimal ${scene.requiredWater} unit air. Air yang tidak terpakai tetap tersimpan di HUD.`,
];
let hintIndex = 0;

document.getElementById('required-water').textContent = scene.requiredWater;
document.getElementById('target-water-amount').textContent = scene.requiredWater;

runButton.addEventListener('click', async () => {
    const result = validator.validateVariable(editor.value, scene.requiredWater);
    feedback.textContent = result.message;
    feedback.dataset.state = !result.syntaxValid ? 'error' : result.missionSuccess ? 'success' : 'info';

    if (!result.syntaxValid || !result.conceptValid) {
        return;
    }

    runButton.disabled = true;
    resetButton.disabled = true;

    try {
        const outcome = await scene.runCommands(result.actions.commands);
        feedback.textContent = outcome.message;
        feedback.dataset.state = outcome.missionSuccess ? 'success' : 'info';
    } finally {
        runButton.disabled = false;
        resetButton.disabled = false;
    }
});

hintButton.addEventListener('click', () => {
    hintText.textContent = hints[hintIndex];
    hintIndex = Math.min(hintIndex + 1, hints.length - 1);
});

resetButton.addEventListener('click', async () => {
    runButton.disabled = true;
    resetButton.disabled = true;
    resetMissionState();

    try {
        await scene.resetMission(true);
        editor.value = starterCode;
        autocomplete.hide();
        feedback.textContent = '';
        delete feedback.dataset.state;
        hintText.textContent = defaultHint;
        hintIndex = 0;
    } finally {
        runButton.disabled = false;
        resetButton.disabled = false;
    }
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    parent: 'game-container',
    backgroundColor: '#222222',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [scene],
};

window.pyroGame = new Phaser.Game(config);
