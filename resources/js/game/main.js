import Phaser from 'phaser';
import CodeAutocomplete, { createLevel1Suggestions } from './CodeAutocomplete.js';
import CodeValidator from './CodeValidator.js';
import Level1Scene from './scenes/Level1Scene.js';

const challengeDefinitions = {
    1: {
        title: 'Challenge 1 - Mengambil Air',
        description: 'Pergi ke pompa di tepi sungai, lalu simpan 3 unit air ke dalam variabel isi_air.',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke pompa air' },
            { key: 'water', label: 'Ambil 3 unit air' },
        ],
        hints: [
            'Perintah dibaca dari atas ke bawah. Berdirilah tepat di atas penanda merah dekat pompa.',
            'Dari titik awal, gunakan maju(3) untuk mencapai penanda pompa.',
            'Setelah sampai, simpan 3 unit air dengan menulis isi_air = 3.',
        ],
        nextMessage: 'Pos 1 memiliki 2 unit air bantuan untuk Pos 2. Bawa 3 unitmu ke sana agar muatan menjadi 5.',
    },
    2: {
        title: 'Challenge 2 - Mengubah Nilai',
        description: 'Pos 1 menyiapkan 2 unit air tambahan untuk Pos 2. Bawa 3 unitmu ke sana, lalu perbarui isi_air menjadi 5 unit.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Bawa 3 unit air ke Pos 1' },
            { key: 'water', label: 'Tambah muatan isi_air menjadi 5' },
        ],
        hints: [
            'Ikuti penanda merah menuju Pos 1. Penjaga menyiapkan 2 unit tambahan untuk Pos 2.',
            'Dari pompa, gunakan kanan(2), maju(6), lalu kanan(8).',
            'Tambahkan 2 unit bantuan ke 3 unit bawaan, lalu tulis isi_air = 5.',
        ],
        nextMessage: 'Muatan 5 unit sudah siap. Antar seluruhnya kepada penjaga Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        description: 'Pergi ke Pos 2 dan serahkan seluruh 5 unit air kepada penjaga menggunakan nilai isi_air.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke Pos 2' },
            { key: 'transfer', label: 'Berikan 5 unit ke air_pos_2' },
        ],
        hints: [
            'Nilai isi_air = 5 dari Challenge 2 masih tersimpan. Ikuti penanda menuju Pos 2.',
            'Dari Pos 1, gunakan mundur(2), kanan(6), maju(9), lalu kanan(4).',
            'Setelah tiba, tulis air_pos_2 = isi_air.',
        ],
    },
};

const validator = new CodeValidator();
const editor = document.getElementById('code-editor');
const runButton = document.getElementById('run-code');
const resetButton = document.getElementById('reset');
const hintButton = document.getElementById('hint');
const feedback = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackOkButton = document.getElementById('feedback-ok');
const hintText = document.getElementById('hint-text');
const waterCount = document.getElementById('water-count');
const postWaterCount = document.getElementById('post-water-count');
const requiredWater = document.getElementById('required-water');
const missionStars = document.getElementById('mission-stars');
const missionTargetCount = document.getElementById('mission-target-count');
const missionTitle = document.getElementById('mission-title');
const missionDescription = document.getElementById('mission-description');
const targetList = document.getElementById('target-list');
const defaultHint = 'Susun instruksi dari atas ke bawah.';
let currentChallenge = 1;
let hintIndex = 0;
let latestState = {};
let completedTargets = new Set();

function showFeedback(message, state = 'info') {
    feedbackMessage.textContent = message;
    feedback.dataset.state = state;
    feedbackOkButton.focus({ preventScroll: true });
}

function hideFeedback() {
    feedbackMessage.textContent = '';
    delete feedback.dataset.state;
}

function isTargetComplete(targetKey, state) {
    if (targetKey === 'location') {
        if (currentChallenge === 1) {
            return state.atPump;
        }

        return currentChallenge === 2 ? state.atPost1 : state.atPost2;
    }

    if (targetKey === 'water') {
        return state.water === challengeDefinitions[currentChallenge].requiredWater;
    }

    return targetKey === 'transfer'
        && state.postWater === challengeDefinitions[currentChallenge].requiredWater;
}

function renderMissionState(state = {}) {
    latestState = { ...latestState, ...state };

    if (Number.isFinite(latestState.water)) {
        waterCount.textContent = latestState.water;
    }

    if (Number.isFinite(latestState.postWater)) {
        postWaterCount.textContent = latestState.postWater;
    }

    for (const target of challengeDefinitions[currentChallenge].targets) {
        if (isTargetComplete(target.key, latestState)) {
            completedTargets.add(target.key);
        }
    }

    for (const item of targetList.querySelectorAll('[data-target-key]')) {
        item.classList.toggle('is-complete', completedTargets.has(item.dataset.targetKey));
    }

    missionStars.textContent = completedTargets.size;
}

function renderTargets() {
    const definition = challengeDefinitions[currentChallenge];
    const items = definition.targets.map((target) => {
        const item = document.createElement('li');
        const check = document.createElement('span');
        check.className = 'target-check';
        check.setAttribute('aria-hidden', 'true');
        item.dataset.targetKey = target.key;
        item.append(check, target.label);
        return item;
    });

    targetList.replaceChildren(...items);
    missionTargetCount.textContent = definition.targets.length;
}

function configureChallenge({ updateScene = true } = {}) {
    const definition = challengeDefinitions[currentChallenge];
    completedTargets = new Set();
    latestState = {};
    hintIndex = 0;
    missionTitle.textContent = definition.title;
    missionDescription.textContent = definition.description;
    requiredWater.textContent = definition.requiredWater;
    hintText.textContent = defaultHint;
    editor.value = '';
    renderTargets();
    missionStars.textContent = '0';
    autocomplete.setSuggestions(createLevel1Suggestions(
        definition.requiredWater,
        currentChallenge,
    ));

    if (updateScene) {
        scene.setChallenge(currentChallenge);
    }
}

function advanceChallenge(successMessage) {
    if (currentChallenge === 3) {
        showFeedback(
            `${successMessage} Level 1 selesai! Kamu sudah membuat, mengubah, dan menggunakan nilai variabel.`,
            'success',
        );
        return;
    }

    const completedChallenge = currentChallenge;
    currentChallenge += 1;
    configureChallenge();
    showFeedback(
        `${successMessage} ${challengeDefinitions[completedChallenge].nextMessage}`,
        'success',
    );

    if (completedChallenge === 1) {
        postWaterCount.textContent = '0';
    }
}

const scene = new Level1Scene({
    assetBaseUrl: document.getElementById('game-container').dataset.assetBaseUrl,
    onReady() {
        configureChallenge();
        runButton.disabled = false;
        resetButton.disabled = false;
        showFeedback('Siap. Bergerak ke penanda merah dekat pompa, lalu atur isi_air.');
    },
    onLoadError() {
        showFeedback('Aset game gagal dimuat. Muat ulang halaman untuk mencoba lagi.', 'error');
    },
    onStateChange: renderMissionState,
});
const autocomplete = new CodeAutocomplete(
    editor,
    document.getElementById('code-suggestions'),
    createLevel1Suggestions(3, 1),
);

runButton.addEventListener('click', async () => {
    const definition = challengeDefinitions[currentChallenge];
    const result = validator.validateVariable(
        editor.value,
        definition.requiredWater,
        currentChallenge,
    );

    if (!result.syntaxValid || !result.conceptValid) {
        showFeedback(result.message, 'error');
        return;
    }

    hideFeedback();
    runButton.disabled = true;
    resetButton.disabled = true;

    try {
        const outcome = await scene.runCommands(result.actions.commands);

        if (outcome.missionSuccess) {
            advanceChallenge(outcome.message);
        } else {
            showFeedback(outcome.message);
        }
    } finally {
        runButton.disabled = false;
        resetButton.disabled = false;
    }
});

hintButton.addEventListener('click', () => {
    const hints = challengeDefinitions[currentChallenge].hints;
    hintText.textContent = hints[hintIndex];
    hintIndex = Math.min(hintIndex + 1, hints.length - 1);
});

feedbackOkButton.addEventListener('click', hideFeedback);

resetButton.addEventListener('click', async () => {
    runButton.disabled = true;
    resetButton.disabled = true;
    configureChallenge({ updateScene: false });

    try {
        await scene.resetChallenge(currentChallenge, true);
        autocomplete.hide();
        hideFeedback();
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
