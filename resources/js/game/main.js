import Phaser from 'phaser';
import CodeAutocomplete, { createLevel1Suggestions, createLevel2Suggestions } from './CodeAutocomplete.js';
import CodeValidator from './CodeValidator.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level1Learning from './Level1Learning.js';
import level1Challenges, { getLevel1MarkerStarterCode } from './Level1Challenges.js';
import level2Challenges from './Level2Challenges.js';
import Level2Scene from './scenes/Level2Scene.js';
import Level2Learning from './Level2Learning.js';
import { gameAudio, getAudioButtonPresentation } from './GameAudio.js';
import { getOutcomeFeedback, shouldPlayTargetCue } from './GameFeedback.js';

// 1. Ambil elemen halaman dan siapkan data challenge yang sedang dimainkan.
const validator = new CodeValidator();
const isLevel2 = document.getElementById('game-container').dataset.level === '2';
const challengeDefinitions = isLevel2 ? level2Challenges : level1Challenges;
const createSuggestions = isLevel2 ? createLevel2Suggestions : createLevel1Suggestions;
const editor = document.getElementById('code-editor');
const Learning = isLevel2 ? Level2Learning : Level1Learning;
const learning = new Learning(editor, document.getElementById('learning-panel'));
const lineNumbers = document.getElementById('code-line-numbers-content');
const runButton = document.getElementById('run-code');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear-code');
const hintButton = document.getElementById('hint');
const hintButtonLabel = hintButton.querySelector('.hint-button__label');
const audioButton = document.getElementById('audio-toggle');
const audioButtonIcon = audioButton.querySelector('.hint-button__icon');
const audioButtonLabel = audioButton.querySelector('.hint-button__label');
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
const levelResult = document.getElementById('level-result');
const resultStars = document.getElementById('result-stars');
const resultReplay = document.getElementById('result-replay');
const prototypePage = document.getElementById('prototype-page');
const defaultHint = 'Susun instruksi dari atas ke bawah.';
let currentChallenge = 1;
let hintIndex = 0;
let latestState = {};
let completedTargets = new Set();
const completedChallenges = new Set();
let levelCompleted = false;

if (!gameAudio.isMuted()) void gameAudio.preload();

function renderAudioButton() {
    const presentation = getAudioButtonPresentation(gameAudio.isMuted());
    audioButtonIcon.textContent = presentation.icon;
    audioButtonLabel.textContent = presentation.label;
    audioButton.setAttribute('aria-label', presentation.ariaLabel);
    audioButton.setAttribute('aria-pressed', String(presentation.pressed));
}

function toggleAudio() {
    const wasMuted = gameAudio.isMuted();
    if (!wasMuted) gameAudio.play('uiClick');
    const isMuted = gameAudio.toggleMuted();
    renderAudioButton();

    if (!isMuted) {
        void gameAudio.preload();
        void gameAudio.unlock().then((ready) => {
            if (ready) gameAudio.play('uiClick');
        });
    }
}

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

// Tombol aksi dikunci bersama selama animasi berjalan.
function setControlsDisabled(disabled) {
    runButton.disabled = disabled;
    resetButton.disabled = disabled;
    clearButton.disabled = disabled;
}

function hideHint() {
    hintText.hidden = true;
    hintButton.setAttribute('aria-expanded', 'false');
    hintButton.setAttribute('aria-label', 'Buka hint');
    hintButtonLabel.textContent = 'Hint';
}

// 2. Cocokkan keadaan game dengan target, lalu perbarui panel misi.
function isTargetComplete(targetKey, state) {
    if (isLevel2) {
        return targetKey === 'location' ? state.atFire
            : targetKey === 'water' ? state.water === 6
                : targetKey === 'fire' ? state.fireOut : targetKey === 'finish' && state.atFinish;
    }
    if (targetKey === 'location') {
        if (currentChallenge === 1) {
            return state.atPump;
        }

        return currentChallenge === 2 ? state.atPost1 : state.atPost2;
    }

    if (targetKey === 'water') {
        return state.water === challengeDefinitions[currentChallenge].requiredWater;
    }

    if (targetKey === 'finish') {
        return state.atFinish;
    }

    return targetKey === 'transfer'
        && state.postWater === challengeDefinitions[currentChallenge].requiredWater;
}

function renderMissionState(state = {}) {
    const { suppressTargetAudio = false, ...persistentState } = state;
    if (typeof persistentState.fireNearby === 'boolean') {
        gameAudio.setFireNearby(persistentState.fireNearby);
    }
    latestState = { ...latestState, ...persistentState };
    learning.renderState(latestState);

    const markerStarterCode = !isLevel2
        ? getLevel1MarkerStarterCode({
            challengeNumber: currentChallenge,
            hasReachedMarker: completedTargets.has('location'),
            isAtMarker: isTargetComplete('location', latestState),
        })
        : null;
    if (markerStarterCode) {
        editor.value = markerStarterCode;
        editor.scrollTop = 0;
        editor.scrollLeft = 0;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        const placeholderStart = markerStarterCode.indexOf('...');
        editor.setSelectionRange(placeholderStart, placeholderStart + 3);
        autocomplete.hide();
        document.getElementById('editor-action-status').textContent = 'Kode gerakan diganti dengan isian challenge.';
    }

    const counter = latestState.water;
    if (Number.isFinite(counter)) {
        waterCount.textContent = counter;
    }

    for (const target of challengeDefinitions[currentChallenge].targets) {
        if (isTargetComplete(target.key, latestState)) {
            const canPlayTargetCue = shouldPlayTargetCue({
                isLevel2,
                targetKey: target.key,
                suppressTargetAudio,
            });
            if (!completedTargets.has(target.key) && canPlayTargetCue) {
                gameAudio.play('target');
            }
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
    requiredWater.textContent = isLevel2 ? '6' : definition.requiredWater;
    hintText.textContent = defaultHint;
    hideHint();
    editor.value = '';
    updateLineNumbers();
    renderTargets();
    learning.setChallenge(currentChallenge);
    missionStars.textContent = '0';
    autocomplete.setSuggestions(createSuggestions(
        definition.requiredWater,
        currentChallenge,
    ));

    if (updateScene) {
        scene.setChallenge(currentChallenge);
    }
}

function advanceChallenge(successMessage) {
    completedChallenges.add(currentChallenge);

    if (currentChallenge === 3) {
        gameAudio.play('levelComplete');
        levelCompleted = true;
        hideFeedback();
        resultStars.textContent = `${completedChallenges.size} / 3 bintang`;
        levelResult.hidden = false;
        prototypePage.inert = true;
        resultReplay.focus();
        return;
    }

    const completedChallenge = currentChallenge;
    if (!isLevel2) gameAudio.play('challengeComplete');
    currentChallenge += 1;
    configureChallenge();
    showFeedback(
        `${successMessage} ${challengeDefinitions[completedChallenge].nextMessage}`,
        'success',
    );
}

// 3. Hubungkan panel HTML dengan scene Phaser dan bantuan penulisan kode.
const Scene = isLevel2 ? Level2Scene : Level1Scene;
const scene = new Scene({
    assetBaseUrl: document.getElementById('game-container').dataset.assetBaseUrl,
    onReady() {
        configureChallenge();
        setControlsDisabled(false);
        hideFeedback();
    },
    onLoadError() {
        gameAudio.play('commandError');
        showFeedback('Aset game gagal dimuat. Muat ulang halaman untuk mencoba lagi.', 'error');
    },
    onStateChange: renderMissionState,
    onAudio: (cue) => gameAudio.play(cue),
});
const autocomplete = new CodeAutocomplete(
    editor,
    document.getElementById('code-suggestions'),
    createSuggestions(challengeDefinitions[1].requiredWater, 1),
    document.getElementById('code-suggestion-help'),
    document.getElementById('command-reference-list'),
);

// 4. Validasi dahulu, jalankan aksi, lalu tampilkan hasilnya.
async function runCode() {
    if (levelCompleted) return;

    const definition = challengeDefinitions[currentChallenge];
    const result = validator[isLevel2 ? 'validateLoop' : 'validateVariable'](
        editor.value,
        definition.requiredWater,
        currentChallenge,
    );

    if (!result.syntaxValid || !result.conceptValid) {
        gameAudio.play('commandError');
        showFeedback(result.message, 'error');
        return;
    }

    gameAudio.play('run');

    hideFeedback();
    setControlsDisabled(true);

    try {
        const outcome = await scene.runCommands(result.actions.commands);

        if (outcome.missionSuccess) {
            advanceChallenge(outcome.message);
        } else {
            const outcomeFeedback = getOutcomeFeedback(outcome);
            if (outcomeFeedback.playErrorCue) gameAudio.play('commandError');
            if (outcomeFeedback.visible) {
                showFeedback(outcome.message, outcomeFeedback.state);
            } else {
                hideFeedback();
            }
        }
    } finally {
        setControlsDisabled(levelCompleted);
    }
}

function toggleHint() {
    if (!hintText.hidden) {
        gameAudio.play('uiClick');
        hideHint();
        return;
    }

    gameAudio.play('hint');

    const hints = challengeDefinitions[currentChallenge].hints;
    hintText.textContent = hints[hintIndex];
    hintText.hidden = false;
    hintButton.setAttribute('aria-expanded', 'true');
    hintButton.setAttribute('aria-label', 'Tutup hint');
    hintButtonLabel.textContent = 'Tutup';
    hintIndex = Math.min(hintIndex + 1, hints.length - 1);
}

async function resetChallenge() {
    if (levelCompleted) return;

    gameAudio.play('reset');

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

function clearCode() {
    gameAudio.play('clear');
    editor.value = '';
    editor.scrollTop = 0;
    editor.scrollLeft = 0;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    autocomplete.hide();
    editor.focus({ preventScroll: true });
    document.getElementById('editor-action-status').textContent = 'Semua kode di PyroPad sudah dihapus.';
}

// 5. Pasang semua tombol, lalu mulai game.
editor.addEventListener('input', updateLineNumbers);
editor.addEventListener('scroll', updateLineNumbers);
runButton.addEventListener('click', runCode);
resetButton.addEventListener('click', resetChallenge);
clearButton.addEventListener('click', clearCode);
hintButton.addEventListener('click', toggleHint);
audioButton.addEventListener('click', toggleAudio);
feedbackOkButton.addEventListener('click', () => {
    gameAudio.play('uiClick');
    hideFeedback();
});
resultReplay.addEventListener('click', () => {
    gameAudio.play('uiClick');
    window.location.reload();
});
const resumeAudio = () => {
    if (!gameAudio.isMuted()) void gameAudio.unlock();
};
window.addEventListener('pointerdown', resumeAudio);
window.addEventListener('keydown', resumeAudio);
renderAudioButton();
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
