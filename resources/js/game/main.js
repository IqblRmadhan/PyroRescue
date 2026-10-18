import Phaser from 'phaser';
import ProgressSync from './ProgressSync.js';
import CodeAutocomplete, { createLevel1Suggestions, createLevel2Suggestions, createLevel3Suggestions } from './CodeAutocomplete.js';
import CodeValidator from './CodeValidator.js';
import Level1Scene from './scenes/Level1Scene.js';
import LearningPanel from './LearningPanel.js';
import level1Challenges, { getLevel1MarkerStarterCode } from './Level1Challenges.js';
import level2Challenges, {
    getLevel2WaterCapacity,
    isLevel2WaterTargetComplete,
} from './Level2Challenges.js';
import Level2Scene from './scenes/Level2Scene.js';
import Level3Scene from './scenes/Level3Scene.js';
import level3Challenges from './Level3Challenges.js';
import { gameAudio, initGameAudioControls } from './GameAudio.js';
import { shouldPlayTargetCue, playCollisionFeedback } from './GameFeedback.js';
import { getGuideInstruction, explainExecutedCommands, GuideDialogue } from './MissionGuide.js';
import { Level1Tutorial } from './Level1Tutorial.js';
import { CODE_ERROR_PENALTY, COLLISION_PENALTY, deductScore, starsForFinish, badgeForScore, canFinishLevel } from './GameScore.js';

// 1. Ambil elemen halaman dan siapkan data challenge yang sedang dimainkan.
const validator = new CodeValidator();
const levelNumber = Number(document.getElementById('game-container').dataset.level);
const isLevel2 = levelNumber === 2;
const isLevel3 = levelNumber === 3;
const hasEvaluation = levelNumber > 1;
const challengeDefinitions = isLevel3 ? level3Challenges : isLevel2 ? level2Challenges : level1Challenges;
const createSuggestions = isLevel3 ? createLevel3Suggestions : isLevel2 ? createLevel2Suggestions : createLevel1Suggestions;
const editor = document.getElementById('code-editor');
const learning = new LearningPanel(document.getElementById('learning-panel'), challengeDefinitions);
const lineNumbers = document.getElementById('code-line-numbers-content');
const runButton = document.getElementById('run-code');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear-code');
const hintButton = document.getElementById('hint');
const hintButtonLabel = hintButton.querySelector('.hint-button__label');
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
const scoreValue = document.getElementById('score-value');
const healthBar = document.getElementById('health-bar');
const healthFill = document.getElementById('health-fill');
const damageOverlay = document.getElementById('damage-overlay');
const codeError = document.getElementById('code-error');
const missionTitle = document.getElementById('mission-title');
const targetList = document.getElementById('target-list');
const levelResult = document.getElementById('level-result');
const resultRating = document.getElementById('result-rating');
const resultBadge = document.getElementById('result-badge');
const resultReward = document.getElementById('result-reward');
const resultTitle = document.getElementById('result-title');
const resultEyebrow = document.getElementById('result-eyebrow');
const resultSubtitle = document.getElementById('result-subtitle');
const nextLevelLink = document.getElementById('next-level-link');
const resultReplay = document.getElementById('result-replay');
const prototypePage = document.getElementById('prototype-page');
const level1Tutorial = levelNumber === 1
    ? new Level1Tutorial(document.getElementById('level1-tutorial')) : null;
const defaultHint = 'Susun instruksi dari atas ke bawah.';
const gameContainer = document.getElementById('game-container');
const earnedAchievementKeys = new Set(JSON.parse(gameContainer.dataset.earnedAchievements || '[]'));
const achievementQueue = [];
let achievementToastOpen = false;
let currentChallenge = Number(gameContainer.dataset.resumeChallenge ?? 1);
let hintIndex = 0;
let latestState = {};
let completedTargets = new Set();
let hasShownMarkerStarterCode = false;
const completedChallenges = new Set(Array.from({ length: currentChallenge - 1 }, (_, index) => index + 1));
let levelCompleted = false;
let score = 100;
let resultCanAdvance = false;
let sceneReady = false;
let operationInProgress = false;
const progressStatus = document.getElementById('progress-sync-status');
const progressRetry = document.getElementById('progress-sync-retry');
const saveWarning = document.getElementById('game-sync-warning');
let savingState = 'saved';
function showSaveStatus(state) {
    savingState = state;
    progressStatus.textContent = state === 'saving' ? 'Menyimpan progres dan pencapaian…'
        : state === 'saved' ? 'Progres dan pencapaian tersimpan di akunmu.'
            : 'Progres belum tersimpan. Periksa koneksi, lalu coba simpan lagi sebelum keluar.';
    progressRetry.hidden = state !== 'error';
    saveWarning.hidden = state !== 'error' || levelCompleted;
    resultReplay.disabled = state === 'saving';
    levelResult.querySelectorAll('.level-result__actions a').forEach(link => {
        const disabled = !resultCanAdvance && link === nextLevelLink
            || state === 'saving' || (state === 'error' && link.hasAttribute('data-requires-save'));
        link.classList.toggle('progress-sync-pending', disabled);
        link.setAttribute('aria-disabled', String(disabled));
    });
}
const progressSync = gameContainer.dataset.progressUrl ? new ProgressSync({
    url: gameContainer.dataset.progressUrl,
    token: document.querySelector('meta[name="csrf-token"]').content,
    level: levelNumber,
    onStatus: showSaveStatus,
    onSaved: data => {
        for (const achievement of data.achievements ?? []) {
            if (!achievement.earned || earnedAchievementKeys.has(achievement.key)) continue;
            earnedAchievementKeys.add(achievement.key);
            achievementQueue.push(achievement);
        }
        showNextAchievement();
    },
}) : null;
progressRetry.addEventListener('click', () => { void progressSync?.flush(); });
saveWarning.addEventListener('click', () => { void progressSync?.flush(); });
levelResult.addEventListener('click', event => {
    if (event.target.closest('a[aria-disabled="true"]')) event.preventDefault();
});

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
    updateControls();
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
        levelNumber,
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
    updateControls();
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
        updateControls();
    }
}

// Tombol aksi dikunci selama animasi dan selama penjelasan masih dibaca.
function areControlsLocked() {
    return operationInProgress || levelCompleted || !sceneReady || feedback.open
        || Boolean(guideDialogue.current) || Boolean(level1Tutorial?.opened);
}

function updateControls() {
    const locked = areControlsLocked();
    runButton.disabled = locked;
    resetButton.disabled = locked;
    clearButton.disabled = locked;
    const tutorialButton = document.getElementById('tutorial-open');
    if (tutorialButton) tutorialButton.disabled = locked;
}

function reduceScore(penalty) {
    score = deductScore(score, penalty);
    scoreValue.textContent = score;
    healthBar.setAttribute('aria-valuenow', String(score));
    healthFill.style.width = `${score}%`;
    healthBar.classList.toggle('is-warning', score < 70 && score > 30);
    healthBar.classList.toggle('is-critical', score <= 30);
}

function showCodeError(message = '') {
    codeError.textContent = message;
    codeError.hidden = !message;
}

async function restartLevel() {
    hideFeedback();
    showCodeError();
    currentChallenge = 1;
    completedChallenges.clear();
    levelCompleted = false;
    resultCanAdvance = false;
    levelResult.hidden = true;
    prototypePage.inert = false;
    score = 100;
    reduceScore(0);
    configureChallenge({ updateScene: false });
    autocomplete.hide();
    gameAudio.play('reset');
    await scene.resetChallenge(1, true);
    showCodeError('HP habis. Level diulang dari Challenge 1 dengan HP penuh.');
}

async function applyDamage(penalty) {
    reduceScore(penalty);
    await playCollisionFeedback(scene, damageOverlay, reducedMotion.matches);
    if (score > 0) return false;
    await restartLevel();
    return true;
}

function showBadge(badge) {
    document.querySelector('.level-badge-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `level-badge-toast badge--${badge.style}`;
    toast.setAttribute('role', 'status');
    const medal = document.createElement('span');
    medal.className = 'level-badge-toast__medal';
    medal.setAttribute('aria-hidden', 'true');
    medal.append(resultBadge.querySelector('.achievement-badge').cloneNode(true));
    const copy = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = `Badge diraih: ${badge.title}`;
    const detail = document.createElement('p');
    detail.textContent = `${badge.tier} · ${score}% · Level ${levelNumber} selesai`;
    copy.append(heading, detail);
    toast.append(medal, copy);
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 6500);
}

function showNextAchievement() {
    if (achievementToastOpen || !achievementQueue.length) return;
    achievementToastOpen = true;
    const achievement = achievementQueue.shift();
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.setAttribute('role', 'status');
    const medal = document.getElementById('achievement-icon-library')
        ?.querySelector(`[data-achievement-key="${achievement.key}"] .achievement-badge`)
        ?.cloneNode(true);
    if (medal) toast.append(medal);
    const copy = document.createElement('div');
    const label = document.createElement('span');
    label.className = 'achievement-toast__label';
    label.textContent = 'PENCAPAIAN BARU';
    const title = document.createElement('strong');
    title.textContent = achievement.title;
    copy.append(label, title);
    toast.append(copy);
    document.body.append(toast);
    window.setTimeout(() => {
        toast.remove();
        achievementToastOpen = false;
        showNextAchievement();
    }, 4200);
}

function hideHint() {
    hintText.hidden = true;
    hintButton.setAttribute('aria-expanded', 'false');
    hintButton.setAttribute('aria-label', 'Buka hint');
    hintButtonLabel.textContent = 'Hint';
}

// 2. Cocokkan keadaan game dengan target, lalu perbarui panel misi.
function isTargetComplete(targetKey, state) {
    if (isLevel3) {
        switch (targetKey) {
            case 'location': return state.atFire;
            case 'water': return state.water >= challengeDefinitions[currentChallenge].requiredWater;
            case 'fire': return state.fireOut;
            case 'habitat': return state.atHabitat;
            case 'safe': return state.conditionChecked && state.bekantanStatus === 'aman';
            case 'rescued': return state.rescued;
            case 'finish': return state.atFinish;
            default: return false;
        }
    }
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

// Dipanggil setelah Run gerakan selesai, bukan saat melewati penanda di tengah jalan.
function showMarkerStarterCode() {
    const markerStarterCode = levelNumber === 1
        ? getLevel1MarkerStarterCode({
            challengeNumber: currentChallenge,
            hasShownStarterCode: hasShownMarkerStarterCode,
            isAtMarker: isTargetComplete('location', latestState),
        })
        : null;
    if (markerStarterCode) {
        hasShownMarkerStarterCode = true;
        editor.value = markerStarterCode;
        editor.scrollTop = 0;
        editor.scrollLeft = 0;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        const placeholderStart = markerStarterCode.indexOf('...');
        editor.setSelectionRange(placeholderStart, placeholderStart + 3);
        autocomplete.hide();
        document.getElementById('editor-action-status').textContent = 'Kode gerakan diganti dengan isian challenge.';
    }
}

function renderMissionState(state = {}) {
    const { suppressTargetAudio = false, ...persistentState } = state;
    if (typeof persistentState.fireNearby === 'boolean') {
        gameAudio.setFireNearby(persistentState.fireNearby);
    }
    latestState = { ...latestState, ...persistentState };

    if (isLevel3) {
        document.getElementById('fire-condition').textContent = latestState.apiPadam ? 'True' : 'False';
        document.getElementById('bekantan-status').textContent = (latestState.bekantanStatus ?? 'tunggu').toUpperCase();
    }
    const counter = levelNumber === 1 && currentChallenge === 4
        ? latestState.postWater : latestState.water;
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
}

function configureChallenge({ updateScene = true } = {}) {
    const definition = challengeDefinitions[currentChallenge];
    completedTargets = new Set();
    hasShownMarkerStarterCode = false;
    latestState = {};
    hintIndex = 0;
    missionTitle.textContent = definition.title;
    guideDialogue.reset();
    requiredWater.textContent = hasEvaluation ? getLevel2WaterCapacity() : definition.requiredWater;
    if (levelNumber === 1) {
        const waterHud = requiredWater.closest('.hud-counter');
        waterHud.title = currentChallenge === 4 ? 'Air telah diterima Pos 2' : 'Isi air / target';
        waterHud.setAttribute('aria-label', currentChallenge === 4
            ? 'Air yang diterima Pos 2' : 'Isi air dan target');
    }
    if (hasEvaluation) {
        const capacity = getLevel2WaterCapacity();
        const waterHud = requiredWater.closest('.hud-counter');
        waterHud.title = `Isi tangki / kapasitas ${capacity} unit`;
        waterHud.setAttribute('aria-label', `Isi tangki dan kapasitas ${capacity} unit air`);
    }
    hintText.textContent = defaultHint;
    hideHint();
    const isEvaluation = hasEvaluation && currentChallenge === 4;
    prototypePage.classList.toggle('is-evaluation', isEvaluation);
    hintButton.hidden = isEvaluation;
    document.getElementById('code-suggestion-help').hidden = isEvaluation;
    editor.value = '';
    updateLineNumbers();
    renderTargets();
    learning.setChallenge(currentChallenge);
    autocomplete.setSuggestions(createSuggestions(
        definition.requiredWater,
        currentChallenge,
    ));

    if (updateScene) {
        scene.setChallenge(currentChallenge);
    }
}

function showLevelResult(missionComplete = true) {
    const badge = badgeForScore(levelNumber, score);
    const stars = starsForFinish(score, missionComplete);
    resultCanAdvance = missionComplete && stars >= 1;
    levelCompleted = true;
    hideFeedback();
    resultEyebrow.textContent = missionComplete ? 'MISI SELESAI' : 'FINISH TERCAPAI';
    resultTitle.textContent = missionComplete ? `Level ${levelNumber} berhasil!` : 'Misi belum tuntas';
    resultSubtitle.textContent = !missionComplete
        ? 'Kamu tiba di FINISH, tetapi masih ada challenge atau evaluasi yang belum selesai. Maksimal 2 bintang; main lagi untuk membuka level berikutnya.'
        : !resultCanAdvance ? 'Semua challenge selesai, tetapi nilaimu belum mencapai 70%. Main lagi untuk membuka level berikutnya.'
            : levelNumber < 3 ? `Semua challenge dan evaluasi selesai. Level ${levelNumber + 1} terbuka!`
                : 'Semua challenge dan evaluasi selesai. Penyelamatan tuntas!';
    resultRating.textContent = badge.title;
    document.getElementById('result-tier').textContent = badge.tier;
    document.getElementById('result-score').textContent = `${score}%`;
    document.getElementById('result-star-count').textContent = `${stars} / 3 bintang${missionComplete ? '' : ' percobaan'}`;
    document.getElementById('result-stars').setAttribute('aria-label', `${stars} dari 3 bintang`);
    levelResult.querySelectorAll('.level-result__stars span').forEach((star, index) => {
        star.classList.toggle('is-unearned', index >= stars);
    });
    resultBadge.className = `level-result__badge badge--${badge.style}`;
    resultReward.hidden = !missionComplete;
    document.getElementById('progress-sync-status').hidden = !missionComplete;
    if (nextLevelLink) nextLevelLink.hidden = !resultCanAdvance;
    levelResult.hidden = false;
    if (progressSync) showSaveStatus(savingState);
    prototypePage.inert = true;
    (resultReplay.disabled ? resultTitle : resultReplay).focus();
    if (missionComplete) showBadge(badge);
}

function advanceChallenge() {
    completedChallenges.add(currentChallenge);
    if (progressSync) void progressSync.save(currentChallenge, currentChallenge === 4 ? score : null);

    if (currentChallenge === 4) {
        gameAudio.play('levelComplete');
        showLevelResult();
        return;
    }

    if (!hasEvaluation) gameAudio.play('challengeComplete');
    currentChallenge += 1;
    configureChallenge();
}

// 3. Hubungkan panel HTML dengan scene Phaser dan bantuan penulisan kode.
const Scene = isLevel3 ? Level3Scene : isLevel2 ? Level2Scene : Level1Scene;
const scene = new Scene({
    assetBaseUrl: document.getElementById('game-container').dataset.assetBaseUrl,
    async onReady() {
        if (currentChallenge > 1) await scene.resetChallenge(currentChallenge);
        sceneReady = true;
        configureChallenge();
        window.dispatchEvent(new Event('pyro:game-ready'));
        if (level1Tutorial && currentChallenge === 1) {
            level1Tutorial.open(() => renderGuide(true));
            updateControls();
        } else {
            renderGuide(true);
        }
    },
    onLoadError() {
        window.dispatchEvent(new Event('pyro:game-load-error'));
        gameAudio.play('commandError');
        showFeedback('Aset game gagal dimuat. Muat ulang halaman untuk mencoba lagi.', 'error');
    },
    onStateChange: renderMissionState,
    onAudio: (cue) => gameAudio.play(cue),
});
level1Tutorial?.setMapScene(scene);
document.getElementById('tutorial-open')?.addEventListener('click', () => {
    if (areControlsLocked()) return;
    gameAudio.play('uiClick');
    level1Tutorial.open(updateControls);
    updateControls();
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
    if (areControlsLocked()) return;
    showCodeError();

    const definition = challengeDefinitions[currentChallenge];
    const submittedCode = editor.value;
    const initialWater = latestState.water ?? 0;
    const instructionBefore = getGuideInstruction({
        levelNumber,
        challengeNumber: currentChallenge,
        state: latestState,
    });
    const result = validator[isLevel3 ? 'validateConditional' : isLevel2 ? 'validateLoop' : 'validateVariable'](
        submittedCode,
        definition.requiredWater,
        currentChallenge,
    );

    if (!result.syntaxValid || !result.conceptValid) {
        operationInProgress = true;
        updateControls();
        try {
            gameAudio.play('commandError');
            showCodeError(result.message);
            await applyDamage(CODE_ERROR_PENALTY);
        } finally {
            operationInProgress = false;
            updateControls();
        }
        return;
    }

    gameAudio.play('run');

    hideFeedback();
    operationInProgress = true;
    updateControls();

    try {
        const completedCommands = [];
        const outcome = await scene.runCommands(result.actions.commands, (command) => completedCommands.push(command));
        if (outcome.status === 'error') {
            if (!outcome.collision) {
                gameAudio.play('commandError');
                showCodeError(outcome.message);
            }
            await applyDamage(outcome.collision ? COLLISION_PENALTY : CODE_ERROR_PENALTY);
            return;
        }
        if (outcome.reachedFinish && !canFinishLevel(completedChallenges, currentChallenge, outcome, levelNumber)) {
            if (outcome.missionSuccess && currentChallenge < 4) {
                completedChallenges.add(currentChallenge);
                if (progressSync) void progressSync.save(currentChallenge);
            }
            showLevelResult(false);
            return;
        }
        if (outcome.missionSuccess) scene.markChallengeComplete();
        if (!outcome.missionSuccess && completedCommands.length > 0
            && completedCommands.every(command => command.type === 'move')
            && editor.value === submittedCode) {
            showMarkerStarterCode();
        }
        const messages = explainExecutedCommands({
            levelNumber,
            challengeNumber: currentChallenge,
            commands: completedCommands,
            code: submittedCode,
            initialWater,
        }).map((message) => ({ message, state: 'info' }));
        if (outcome.missionSuccess || outcome.reachedFinish) {
            messages.push({ message: outcome.message,
                state: outcome.missionSuccess ? 'success' : 'info' });
        }
        const shouldOpenGuide = guideDialogue.start(messages, () => {
            if (outcome.missionSuccess) advanceChallenge();
            if (outcome.reachedFinish && !levelCompleted) {
                if (levelNumber === 1 && currentChallenge === 4 && outcome.missionSuccess) advanceChallenge();
            }
        }, {
            instructionBefore,
            instructionAfter: getGuideInstruction({
                levelNumber,
                challengeNumber: currentChallenge,
                state: latestState,
            }),
        });
        if (shouldOpenGuide) renderGuide(true);
    } catch (error) {
        console.error('Aksi game tidak dapat diselesaikan.', error);
        showFeedback('Aksi terhenti. Tekan Mengerti, lalu Ulangi untuk kembali ke awal challenge.', 'error');
    } finally {
        operationInProgress = false;
        updateControls();
    }
}

function toggleHint() {
    if (hasEvaluation && currentChallenge === 4) return;
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
    if (areControlsLocked()) return;
    showCodeError();

    gameAudio.play('reset');

    operationInProgress = true;
    updateControls();
    configureChallenge({ updateScene: false });

    try {
        await scene.resetChallenge(currentChallenge, true);
        autocomplete.hide();
        hideFeedback();
        renderGuide(true);
    } catch (error) {
        console.error('Challenge tidak dapat diulang.', error);
        showCodeError('Challenge belum berhasil diulang. Coba tekan Ulangi lagi.');
    } finally {
        operationInProgress = false;
        updateControls();
    }
}

function clearCode() {
    showCodeError();
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
    const url = new URL(window.location.href);
    url.searchParams.set('replay', '1');
    window.location.assign(url);
});
initGameAudioControls(document.getElementById('music-toggle'), document.getElementById('audio-toggle'));
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
