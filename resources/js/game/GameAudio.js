import {
    effectsMutedKey,
    getAudioStorage,
    musicMutedKey,
    readAudioPreference,
    saveAudioPreference,
} from './AudioPreferences.js';

const masterVolume = 1.35;
const sourceVolume = 1;

export const audioCueFiles = Object.freeze({
    uiClick: 'ui-click.wav',
    typing: 'typing.wav',
    storyNext: 'story-next.wav',
    run: 'run.wav',
    clear: 'clear.wav',
    hint: 'hint.wav',
    reset: 'reset.wav',
    step: 'step.wav',
    blocked: 'blocked.wav',
    pump: 'pump.wav',
    water: 'water.wav',
    spray: 'spray.wav',
    fireOut: 'fire-out.wav',
    commandError: 'command-error.wav',
    target: 'target.wav',
    challengeComplete: 'challenge-complete.wav',
    levelComplete: 'level-complete.wav',
});

export const backgroundAudioFiles = Object.freeze({
    music: 'music-loop.wav',
});

export const proximityAudioFiles = Object.freeze({
    fire: 'fire.wav',
});

export const audioCueNames = Object.freeze(Object.keys(audioCueFiles));
const audioCueSet = new Set(audioCueNames);

export function getAudioFileName(cueName) {
    return audioCueFiles[cueName] ?? null;
}

export function getAudioButtonPresentation(channel, muted) {
    if (channel === 'music') {
        return muted
            ? { icon: '🎵', label: 'Musik', ariaLabel: 'Nyalakan musik game', pressed: false }
            : { icon: '🎵', label: 'Musik', ariaLabel: 'Matikan musik game', pressed: true };
    }
    return muted
        ? { icon: '🔇', label: 'SFX', ariaLabel: 'Nyalakan efek suara dan karakter', pressed: false }
        : { icon: '🔊', label: 'SFX', ariaLabel: 'Matikan efek suara dan karakter', pressed: true };
}

function getAudioBaseUrl() {
    return globalThis.document?.body?.dataset.audioBaseUrl ?? '/assets/audio';
}

export function createWebAudioEngine({
    AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext,
    fetchFile = globalThis.fetch?.bind(globalThis),
    baseUrl = getAudioBaseUrl(),
    now = () => Date.now(),
    retryDelayMs = 10_000,
} = {}) {
    if (!AudioContextClass || !fetchFile) return null;

    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = masterVolume;
    masterGain.connect(context.destination);
    const musicGain = context.createGain();
    musicGain.connect(masterGain);
    const effectsGain = context.createGain();
    effectsGain.connect(masterGain);
    let musicInitialized = false;
    let effectsInitialized = false;

    const buffers = new Map();
    const backgroundSources = [];
    const loadingAssets = new Map();
    const retryAfter = new Map();
    const startedBackgroundTracks = new Set();
    const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
    let backgroundRequested = false;
    let fireNearbyRequested = false;
    let fireSource = null;

    const allAudioFiles = [
        ...Object.entries(backgroundAudioFiles),
        ...Object.entries(proximityAudioFiles),
        ...Object.entries(audioCueFiles),
    ];

    async function loadBuffer(key, fileName) {
        if (buffers.has(key)) return true;
        if (loadingAssets.has(key)) return loadingAssets.get(key);
        if ((retryAfter.get(key) ?? 0) > now()) return false;

        const markFailure = () => {
            retryAfter.set(key, now() + retryDelayMs);
            return false;
        };

        const loading = (async () => {
            try {
                const response = await fetchFile(`${normalizedBaseUrl}/${fileName}`, {
                    cache: 'force-cache',
                });
                if (!response.ok) return markFailure();
                const buffer = await context.decodeAudioData(await response.arrayBuffer());
                buffers.set(key, buffer);
                retryAfter.delete(key);
                startRequestedBackgroundTracks();
                syncFireTrack();
                return true;
            } catch {
                return markFailure();
            } finally {
                loadingAssets.delete(key);
            }
        })();

        loadingAssets.set(key, loading);
        return loading;
    }

    async function loadAssets() {
        const results = await Promise.all(
            allAudioFiles.map(([key, fileName]) => loadBuffer(key, fileName)),
        );
        return results.every(Boolean);
    }

    function playBuffer(key, { loop = false, volume = 1, channel = 'effects' } = {}) {
        const buffer = buffers.get(key);
        if (!buffer || context.state === 'closed') return null;

        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        source.loop = loop;
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(channel === 'music' ? musicGain : effectsGain);
        source.start();
        return source;
    }

    function startBackgroundTrack(key, volume) {
        if (startedBackgroundTracks.has(key)) return;
        const source = playBuffer(key, { loop: true, volume, channel: 'music' });
        if (!source) return;
        startedBackgroundTracks.add(key);
        backgroundSources.push(source);
    }

    function startRequestedBackgroundTracks() {
        if (!backgroundRequested) return;
        startBackgroundTrack('music', sourceVolume);
    }

    function syncFireTrack() {
        if (!fireNearbyRequested) {
            if (fireSource) {
                try {
                    fireSource.stop();
                } catch {
                    // Source yang sudah berhenti tidak perlu dihentikan lagi.
                }
                fireSource = null;
            }
            return;
        }

        fireSource ??= playBuffer('fire', { loop: true, volume: sourceVolume });
    }

    return {
        preload() {
            return loadAssets();
        },
        async resume() {
            if (context.state !== 'running') await context.resume();
        },
        isRunning() {
            return context.state === 'running';
        },
        startBackground() {
            backgroundRequested = true;
            startRequestedBackgroundTracks();
        },
        setFireNearby(nearby) {
            fireNearbyRequested = Boolean(nearby);
            syncFireTrack();
        },
        setMusicMuted(muted) {
            if (!musicInitialized) {
                musicGain.gain.value = muted ? 0 : 1;
                musicInitialized = true;
            } else {
                musicGain.gain.setTargetAtTime(muted ? 0 : 1, context.currentTime, 0.025);
            }
        },
        setEffectsMuted(muted) {
            if (!effectsInitialized) {
                effectsGain.gain.value = muted ? 0 : 1;
                effectsInitialized = true;
            } else {
                effectsGain.gain.setTargetAtTime(muted ? 0 : 1, context.currentTime, 0.025);
            }
        },
        playCue(name) {
            return Boolean(playBuffer(name, { volume: sourceVolume }));
        },
        destroy() {
            for (const source of backgroundSources) {
                try {
                    source.stop();
                } catch {
                    // Source yang sudah berhenti tidak perlu dihentikan lagi.
                }
            }
            if (fireSource) {
                try {
                    fireSource.stop();
                } catch {
                    // Source yang sudah berhenti tidak perlu dihentikan lagi.
                }
            }
            void context.close();
        },
    };
}

export class GameAudio {
    constructor({ storage = getAudioStorage(), engineFactory = createWebAudioEngine } = {}) {
        this.storage = storage;
        this.engineFactory = engineFactory;
        this.engine = null;
        this.unlocked = false;
        this.unlockPromise = null;
        this.musicMuted = readAudioPreference(storage, musicMutedKey);
        this.effectsMuted = readAudioPreference(storage, effectsMutedKey);
        this.fireNearby = false;
    }

    isMusicMuted() {
        return this.musicMuted;
    }

    isEffectsMuted() {
        return this.effectsMuted;
    }

    async preload() {
        if (!this.unlocked) return false;

        try {
            this.engine ??= this.engineFactory();
            if (!this.engine) return false;
            if (!this.engine.preload) return true;
            await this.engine.preload();
            return true;
        } catch {
            return false;
        }
    }

    async unlock() {
        const engineIsRunning = this.engine?.isRunning?.() ?? true;
        if (this.unlocked && engineIsRunning) return true;
        if (this.unlockPromise) return this.unlockPromise;

        this.unlockPromise = this.resumeEngine();
        try {
            return await this.unlockPromise;
        } finally {
            this.unlockPromise = null;
        }
    }

    async resumeEngine() {
        try {
            this.engine ??= this.engineFactory();
            if (!this.engine) return false;

            await this.engine.resume();
            if (!this.unlocked) {
                this.engine.setMusicMuted(this.musicMuted);
                this.engine.setEffectsMuted(this.effectsMuted);
                this.engine.startBackground();
                this.engine.setFireNearby?.(this.fireNearby);
                this.unlocked = true;
                void this.preload();
            }

            return true;
        } catch {
            return false;
        }
    }

    play(name) {
        if (!audioCueSet.has(name) || this.effectsMuted) return false;

        const engineIsRunning = this.engine?.isRunning?.() ?? true;
        if (!this.unlocked || !engineIsRunning) {
            void this.unlock();
            return false;
        }

        return this.playOnEngine(name);
    }

    playOnEngine(name) {
        try {
            return this.engine.playCue(name) !== false;
        } catch {
            return false;
        }
    }

    setFireNearby(nearby) {
        this.fireNearby = Boolean(nearby);
        try {
            this.engine?.setFireNearby?.(this.fireNearby);
        } catch {
            // Kegagalan ambience tidak boleh menghentikan permainan.
        }
        return this.fireNearby;
    }

    setMusicMuted(muted) {
        this.musicMuted = Boolean(muted);
        saveAudioPreference(this.storage, musicMutedKey, this.musicMuted);
        try {
            this.engine?.setMusicMuted(this.musicMuted);
        } catch {
            // AudioContext dapat berhenti ketika tab ditutup atau perangkat berubah.
        }
        return this.musicMuted;
    }

    setEffectsMuted(muted) {
        this.effectsMuted = Boolean(muted);
        saveAudioPreference(this.storage, effectsMutedKey, this.effectsMuted);
        try {
            this.engine?.setEffectsMuted(this.effectsMuted);
        } catch {
            // AudioContext dapat berhenti ketika tab ditutup atau perangkat berubah.
        }
        return this.effectsMuted;
    }

    toggleMusicMuted() {
        return this.setMusicMuted(!this.musicMuted);
    }

    toggleEffectsMuted() {
        return this.setEffectsMuted(!this.effectsMuted);
    }
}

export const gameAudio = new GameAudio();

// Kontrol halaman menggunakan preferensi dan engine yang sama dengan cerita pembuka.
export function initGameAudioControls(musicButton, effectsButton) {
    function renderButtons() {
        for (const [button, channel, muted] of [
            [musicButton, 'music', gameAudio.isMusicMuted()],
            [effectsButton, 'effects', gameAudio.isEffectsMuted()],
        ]) {
            const presentation = getAudioButtonPresentation(channel, muted);
            button.querySelector('.hint-button__icon').textContent = presentation.icon;
            button.querySelector('.hint-button__label').textContent = presentation.label;
            button.setAttribute('aria-label', presentation.ariaLabel);
            button.setAttribute('aria-pressed', String(presentation.pressed));
        }
    }

    musicButton.addEventListener('click', () => {
        gameAudio.play('uiClick');
        const muted = gameAudio.toggleMusicMuted();
        renderButtons();
        if (!muted) void gameAudio.unlock();
    });
    effectsButton.addEventListener('click', () => {
        if (!gameAudio.isEffectsMuted()) gameAudio.play('uiClick');
        const muted = gameAudio.toggleEffectsMuted();
        renderButtons();
        if (!muted) {
            void gameAudio.unlock().then((ready) => {
                if (ready) gameAudio.play('uiClick');
            });
        }
    });
    const resumeAudio = event => {
        if (musicButton.contains(event.target) || effectsButton.contains(event.target)) return;
        if (!gameAudio.isMusicMuted() || !gameAudio.isEffectsMuted()) void gameAudio.unlock();
    };
    window.addEventListener('pointerdown', resumeAudio);
    window.addEventListener('keydown', resumeAudio);
    renderButtons();
}
