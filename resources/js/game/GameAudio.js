const storageKey = 'pyrorescue.audioMuted';
const masterVolume = 1.35;
const sourceVolume = 1;

export const audioCueFiles = Object.freeze({
    uiClick: 'ui-click.wav',
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

export function getAudioButtonPresentation(muted) {
    return muted
        ? { icon: '🔇', label: 'Bisu', ariaLabel: 'Suara game', pressed: false }
        : { icon: '🔊', label: 'Suara', ariaLabel: 'Suara game', pressed: true };
}

function getBrowserStorage() {
    try {
        return globalThis.window?.localStorage ?? null;
    } catch {
        return null;
    }
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

    function playBuffer(key, { loop = false, volume = 1 } = {}) {
        const buffer = buffers.get(key);
        if (!buffer || context.state === 'closed') return null;

        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        source.loop = loop;
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(masterGain);
        source.start();
        return source;
    }

    function startBackgroundTrack(key, volume) {
        if (startedBackgroundTracks.has(key)) return;
        const source = playBuffer(key, { loop: true, volume });
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
        setMuted(muted) {
            masterGain.gain.setTargetAtTime(muted ? 0 : masterVolume, context.currentTime, 0.025);
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
    constructor({ storage = getBrowserStorage(), engineFactory = createWebAudioEngine } = {}) {
        this.storage = storage;
        this.engineFactory = engineFactory;
        this.engine = null;
        this.unlocked = false;
        this.unlockPromise = null;
        this.muted = false;
        this.fireNearby = false;

        try {
            this.muted = this.storage?.getItem(storageKey) === 'true';
        } catch {
            this.muted = false;
        }
    }

    isMuted() {
        return this.muted;
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
                this.engine.setMuted(this.muted);
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
        if (!audioCueSet.has(name) || this.muted) return false;

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

    setMuted(muted) {
        this.muted = Boolean(muted);
        try {
            this.storage?.setItem(storageKey, String(this.muted));
        } catch {
            // Penyimpanan browser dapat ditolak pada mode privasi tertentu.
        }
        try {
            this.engine?.setMuted(this.muted);
        } catch {
            // AudioContext dapat berhenti ketika tab ditutup atau perangkat berubah.
        }
        return this.muted;
    }

    toggleMuted() {
        return this.setMuted(!this.muted);
    }
}

export const gameAudio = new GameAudio();
