import Phaser from 'phaser';
import CodeAutocomplete, { createLevel1Suggestions, createLevel2Suggestions } from './CodeAutocomplete.js';
import CodeValidator from './CodeValidator.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level1Learning from './Level1Learning.js';
import level1Challenges, { getLevel1MarkerStarterCode } from './Level1Challenges.js';
import level2Challenges, {
    getLevel2WaterCapacity,
    isLevel2WaterTargetComplete,
} from './Level2Challenges.js';
import Level2Scene from './scenes/Level2Scene.js';
import Level2Learning from './Level2Learning.js';
import { gameAudio, getAudioButtonPresentation } from './GameAudio.js';
import { getOutcomeFeedback, shouldPlayTargetCue } from './GameFeedback.js';
import { getGuideInstruction, explainExecutedCommands, GuideDialogue } from './MissionGuide.js';

// 1. Ambil elemen halaman dan siapkan data challenge yang sedang dimainkan.
const validator = new CodeValidator();
const isLevel2 = document.getElementById('game-container').dataset.level === '2';
const challengeDefinitions = isLevel2 ? level2Challenges : level1Challenges;
const createSuggestions = isLevel2 ? createLevel2Suggestions : createLevel1Suggestions;
const editor = document.getElementById('code-editor');
const Learning = isLevel2 ? Level2Learning : Level1Learning;
const learning = new Learning(document.getElementById('learning-panel'));
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
const guideTitle = document.getElementById('guide-title');
const guideProgress = document.getElementById('guide-progress');
const guideNextLabel = document.getElementById('guide-next-label');
const guideCopy = feedback.querySelector('.mission-guide__copy');
const guideStage = feedback.querySelector('.mission-guide__stage');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let guideTransitioning = false;
const guideDialogue = new GuideDialogue();
const hintText = document.getElementById('hint-text');
const waterCount = document.getElementById('water-count');
const requiredWater = document.getElementById('required-water');
const missionStars = document.getElementById('mission-stars');
const missionTargetCount = document.getElementById('mission-target-count');
const missionTitle = document.getElementById('mission-title');
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
let sceneReady = false;
let runningCode = false;

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
    guideDialogue.start([{ message, state }]);
    setControlsDisabled(true);
    renderGuide(true);
}

function hideFeedback() {
    guideDialogue.reset();
    feedback.close();
    document.body.classList.remove('guide-is-open');
}

function renderGuide(showInstruction = false) {
    if (levelCompleted) return;
    const entry = guideDialogue.current;
    if (!entry && !showInstruction) return;
    const wasOpen = feedback.open;
    feedback.dataset.state = entry?.state ?? 'instruction';
    const titles = {
        instruction: 'Langkah berikutnya',
        info: 'Arti kode yang kamu jalankan',
        success: 'Misi berhasil!',
        error: 'Mari perbaiki kodenya',
    };
    guideTitle.textContent = titles[feedback.dataset.state];
    feedbackMessage.textContent = entry?.message ?? getGuideInstruction({
        levelNumber: isLevel2 ? 2 : 1,
        challengeNumber: currentChallenge,
        state: latestState,
    });
    guideNextLabel.textContent = entry ? 'Lanjut' : 'Mengerti, ayo mulai';
    guideProgress.textContent = guideDialogue.messages.length > 1
        ? `${guideDialogue.messages.length - 1} penjelasan berikutnya` : entry ? 'Berikutnya: arahan misi' : 'Siap melanjutkan misi?';
    guideCopy.scrollTop = 0;
    if (!wasOpen) {
        document.body.classList.add('guide-is-open');
        feedback.showModal();
    } else if (!reducedMotion.matches) {
        guideCopy.animate([
            { opacity: 0, transform: 'translateX(20px)' },
            { opacity: 1, transform: 'translateX(0)' },
        ], { duration: 260, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
    feedbackOkButton.focus({ preventScroll: true });
    setControlsDisabled(true);
}

async function nextGuideMessage() {
    if (guideTransitioning || !feedback.open) return;
    guideTransitioning = true;
    feedbackOkButton.disabled = true;
    gameAudio.play('uiClick');
    const hasExplanation = Boolean(guideDialogue.current);

    try {
        if (!reducedMotion.matches) {
            const target = hasExplanation ? guideCopy : guideStage;
            await target.animate([
                { opacity: 1, transform: 'translate(0, 0)' },
                { opacity: 0, transform: hasExplanation ? 'translate(-14px, 0)' : 'translate(0, 24px)' },
            ], { duration: 150, easing: 'ease-in', fill: 'forwards' }).finished;
            target.getAnimations().forEach((animation) => animation.cancel());
        }
        if (hasExplanation) {
            guideDialogue.next();
            renderGuide(true);
        } else {
            hideFeedback();
            editor.focus({ preventScroll: true });
        }
    } finally {
        guideTransitioning = false;
        feedbackOkButton.disabled = false;
        if (feedback.open) feedbackOkButton.focus({ preventScroll: true });
        setControlsDisabled(levelCompleted);
    }
}

// Tombol aksi dikunci selama animasi dan selama penjelasan masih dibaca.
function setControlsDisabled(disabled) {
    const locked = disabled || !sceneReady || feedback.open || Boolean(guideDialogue.current);
    runButton.disabled = locked;
    resetButton.disabled = locked;
    clearButton.disabled = locked;
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
            : targetKey === 'water' ? isLevel2WaterTargetComplete(currentChallenge, state.water)
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
    guideDialogue.reset();
    requiredWater.textContent = isLevel2 ? getLevel2WaterCapacity() : definition.requiredWater;
    if (isLevel2) {
        const capacity = getLevel2WaterCapacity();
        const waterHud = requiredWater.closest('.hud-counter');
        waterHud.title = `Isi tangki / kapasitas ${capacity} unit`;
        waterHud.setAttribute('aria-label', `Isi tangki dan kapasitas ${capacity} unit air`);
    }
    hintText.textContent = defaultHint;
    hideHint();
    const isEvaluation = isLevel2 && currentChallenge === 4;
    prototypePage.classList.toggle('is-evaluation', isEvaluation);
    hintButton.hidden = isEvaluation;
    document.getElementById('code-suggestion-help').hidden = isEvaluation;
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

function advanceChallenge() {
    completedChallenges.add(currentChallenge);

    if (currentChallenge === (isLevel2 ? 4 : 3)) {
        gameAudio.play('levelComplete');
        levelCompleted = true;
        hideFeedback();
        resultStars.textContent = '3 / 3 bintang';
        levelResult.hidden = false;
        prototypePage.inert = true;
        resultReplay.focus();
        return;
    }

    if (!isLevel2) gameAudio.play('challengeComplete');
    currentChallenge += 1;
    configureChallenge();
}

// 3. Hubungkan panel HTML dengan scene Phaser dan bantuan penulisan kode.
const Scene = isLevel2 ? Level2Scene : Level1Scene;
const scene = new Scene({
    assetBaseUrl: document.getElementById('game-container').dataset.assetBaseUrl,
    onReady() {
        sceneReady = true;
        configureChallenge();
        renderGuide(true);
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
    if (levelCompleted || runningCode || feedback.open || guideDialogue.current || !sceneReady) return;

    const definition = challengeDefinitions[currentChallenge];
    const submittedCode = editor.value;
    const initialWater = latestState.water ?? 0;
    const instructionBefore = getGuideInstruction({
        levelNumber: isLevel2 ? 2 : 1,
        challengeNumber: currentChallenge,
        state: latestState,
    });
    const result = validator[isLevel2 ? 'validateLoop' : 'validateVariable'](
        submittedCode,
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
    runningCode = true;
    setControlsDisabled(true);

    try {
        const completedCommands = [];
        const outcome = await scene.runCommands(result.actions.commands, (command) => completedCommands.push(command));
        const messages = explainExecutedCommands({
            levelNumber: isLevel2 ? 2 : 1,
            challengeNumber: currentChallenge,
            commands: completedCommands,
            code: submittedCode,
            initialWater,
        }).map((message) => ({ message, state: 'info' }));
        const outcomeFeedback = getOutcomeFeedback(outcome);
        if (outcomeFeedback.playErrorCue) gameAudio.play('commandError');
        if (outcomeFeedback.visible || outcome.missionSuccess) {
            messages.push({ message: outcome.message, state: outcome.missionSuccess ? 'success' : outcomeFeedback.state });
        }
        const shouldOpenGuide = guideDialogue.start(messages, () => {
            if (outcome.missionSuccess) advanceChallenge();
        }, {
            instructionBefore,
            instructionAfter: getGuideInstruction({
                levelNumber: isLevel2 ? 2 : 1,
                challengeNumber: currentChallenge,
                state: latestState,
            }),
        });
        if (shouldOpenGuide) renderGuide(true);
    } catch (error) {
        console.error('Aksi game tidak dapat diselesaikan.', error);
        showFeedback('Aksi terhenti. Tekan Mengerti, lalu Ulangi untuk kembali ke awal challenge.', 'error');
    } finally {
        runningCode = false;
        setControlsDisabled(levelCompleted);
    }
}

function toggleHint() {
    if (isLevel2 && currentChallenge === 4) return;
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
        renderGuide(true);
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
feedbackOkButton.addEventListener('click', nextGuideMessage);
feedback.addEventListener('cancel', (event) => {
    event.preventDefault();
    void nextGuideMessage();
});
feedback.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        feedbackOkButton.focus({ preventScroll: true });
    }
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
