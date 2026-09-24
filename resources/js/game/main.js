import Phaser from 'phaser';
import CodeAutocomplete, { createLevel1Suggestions } from './CodeAutocomplete.js';
import CodeValidator from './CodeValidator.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level1Learning from './Level1Learning.js';
import challengeDefinitions from './Level1Challenges.js';

// 1. Ambil elemen halaman dan siapkan data challenge yang sedang dimainkan.
const validator = new CodeValidator();
const editor = document.getElementById('code-editor');
const learning = new Level1Learning(editor, document.getElementById('learning-panel'));
const lineNumbers = document.getElementById('code-line-numbers-content');
const runButton = document.getElementById('run-code');
const resetButton = document.getElementById('reset');
const hintButton = document.getElementById('hint');
const hintButtonLabel = hintButton.querySelector('.hint-button__label');
const feedback = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackOkButton = document.getElementById('feedback-ok');
const hintText = document.getElementById('hint-text');
const waterCount = document.getElementById('water-count');
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

function updateLineNumbers() {
    const lineCount = editor.value.split('\n').length;
    lineNumbers.textContent = Array.from(
        { length: lineCount },
        (_, index) => `${index + 1}.`,
    ).join('\n');
    lineNumbers.style.transform = `translateY(-${editor.scrollTop}px)`;
}

function showFeedback(message, state = 'info') {
    feedbackMessage.textContent = message;
    feedback.dataset.state = state;
    feedbackOkButton.focus({ preventScroll: true });
}

function hideFeedback() {
    feedbackMessage.textContent = '';
    delete feedback.dataset.state;
}

// Run dan Reset dikunci bersama selama animasi berjalan.
function setControlsDisabled(disabled) {
    runButton.disabled = disabled;
    resetButton.disabled = disabled;
}

function hideHint() {
    hintText.hidden = true;
    hintButton.setAttribute('aria-expanded', 'false');
    hintButton.setAttribute('aria-label', 'Buka hint');
    hintButtonLabel.textContent = 'Hint';
}

// 2. Cocokkan keadaan game dengan target, lalu perbarui panel misi.
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
    learning.renderState(latestState);

    if (Number.isFinite(latestState.water)) {
        waterCount.textContent = latestState.water;
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
    hideHint();
    editor.value = '';
    updateLineNumbers();
    renderTargets();
    learning.setChallenge(currentChallenge);
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
}

// 3. Hubungkan panel HTML dengan scene Phaser dan bantuan penulisan kode.
const scene = new Level1Scene({
    assetBaseUrl: document.getElementById('game-container').dataset.assetBaseUrl,
    onReady() {
        configureChallenge();
        setControlsDisabled(false);
        showFeedback('Bergerak ke penanda merah dekat pompa, lalu atur isi_air.');
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
    document.getElementById('code-suggestion-help'),
    document.getElementById('command-reference-list'),
);

// 4. Validasi dahulu, jalankan aksi, lalu tampilkan hasilnya.
async function runCode() {
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
    setControlsDisabled(true);

    try {
        const outcome = await scene.runCommands(result.actions.commands);

        if (outcome.missionSuccess) {
            advanceChallenge(outcome.message);
        } else {
            showFeedback(outcome.message);
        }
    } finally {
        setControlsDisabled(false);
    }
}

function toggleHint() {
    if (!hintText.hidden) {
        hideHint();
        return;
    }

    const hints = challengeDefinitions[currentChallenge].hints;
    hintText.textContent = hints[hintIndex];
    hintText.hidden = false;
    hintButton.setAttribute('aria-expanded', 'true');
    hintButton.setAttribute('aria-label', 'Tutup hint');
    hintButtonLabel.textContent = 'Tutup';
    hintIndex = Math.min(hintIndex + 1, hints.length - 1);
}

async function resetChallenge() {
    setControlsDisabled(true);
    configureChallenge({ updateScene: false });

    try {
        await scene.resetChallenge(currentChallenge, true);
        autocomplete.hide();
        hideFeedback();
    } finally {
        setControlsDisabled(false);
    }
}

// 5. Pasang semua tombol, lalu mulai game.
editor.addEventListener('input', updateLineNumbers);
editor.addEventListener('scroll', updateLineNumbers);
runButton.addEventListener('click', runCode);
resetButton.addEventListener('click', resetChallenge);
hintButton.addEventListener('click', toggleHint);
feedbackOkButton.addEventListener('click', hideFeedback);
updateLineNumbers();

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
