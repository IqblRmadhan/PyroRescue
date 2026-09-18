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
const starterCode = editor.value;
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

    try {
        await scene.resetMission(true);
        editor.value = starterCode;
        autocomplete.hide();
        feedback.textContent = '';
        delete feedback.dataset.state;
        hintText.textContent = '';
        hintIndex = 0;
    } finally {
        runButton.disabled = false;
        resetButton.disabled = false;
    }
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#222222',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [scene],
};

window.pyroGame = new Phaser.Game(config);
