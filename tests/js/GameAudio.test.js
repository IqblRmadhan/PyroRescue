import test from 'node:test';
import assert from 'node:assert/strict';
import {
    GameAudio,
    audioCueNames,
    createWebAudioEngine,
    getAudioButtonPresentation,
} from '../../resources/js/game/GameAudio.js';

function createStorage(initial = {}) {
    const values = new Map(Object.entries(initial));

    return {
        getItem(key) {
            return values.get(key) ?? null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
    };
}

test('the game exposes every audio cue used by the interface and both levels', () => {
    assert.deepEqual(audioCueNames, [
        'uiClick',
        'storyNext',
        'run',
        'clear',
        'hint',
        'reset',
        'step',
        'blocked',
        'pump',
        'water',
        'spray',
        'fireOut',
        'commandError',
        'target',
        'challengeComplete',
        'levelComplete',
    ]);
});

test('mute state persists and changes the accessible audio button text', () => {
    const storage = createStorage();
    const audio = new GameAudio({ storage });

    assert.equal(audio.isMuted(), false);
    assert.deepEqual(getAudioButtonPresentation(false), {
        icon: '🔊',
        label: 'Suara',
        ariaLabel: 'Suara game',
        pressed: true,
    });

    audio.setMuted(true);

    assert.equal(audio.isMuted(), true);
    assert.equal(storage.getItem('pyrorescue.audioMuted'), 'true');
    assert.deepEqual(getAudioButtonPresentation(true), {
        icon: '🔇',
        label: 'Bisu',
        ariaLabel: 'Suara game',
        pressed: false,
    });
    assert.equal(new GameAudio({ storage }).isMuted(), true);
});

test('unlock safely reports an unavailable or rejected audio engine', async () => {
    const unavailableAudio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => {
            throw new Error('AudioContext unavailable');
        },
    });

    assert.equal(await unavailableAudio.unlock(), false);
    assert.equal(unavailableAudio.toggleMuted(), true);

    let attempts = 0;
    const recoveringAudio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => ({
            async resume() {
                attempts += 1;
                if (attempts === 1) throw new Error('resume interrupted');
            },
            isRunning() { return attempts > 1; },
            startBackground() {},
            setMuted() {},
            playCue() {},
        }),
    });

    assert.equal(await recoveringAudio.unlock(), false);
    assert.equal(await recoveringAudio.unlock(), true);
});

test('concurrent unlock requests initialize the background only once', async () => {
    const calls = [];
    let finishResume;
    const resumeGate = new Promise((resolve) => { finishResume = resolve; });
    const engine = {
        async resume() {
            calls.push('resume');
            await resumeGate;
        },
        isRunning() { return true; },
        startBackground() { calls.push('background'); },
        setMuted() { calls.push('muted'); },
        playCue() {},
    };
    const audio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => engine,
    });

    const firstUnlock = audio.unlock();
    const secondUnlock = audio.unlock();
    finishResume();

    assert.deepEqual(await Promise.all([firstUnlock, secondUnlock]), [true, true]);
    assert.deepEqual(calls, ['resume', 'muted', 'background']);
});

test('preload waits for user interaction before preparing audio assets', async () => {
    const calls = [];
    const audio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => ({
            async preload() { calls.push('preload'); },
            async resume() { calls.push('resume'); },
            startBackground() { calls.push('background'); },
            setMuted() {},
            playCue() {},
        }),
    });

    assert.equal(typeof audio.preload, 'function');
    assert.equal(await audio.preload(), false);
    assert.deepEqual(calls, []);

    assert.equal(await audio.unlock(), true);
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(calls, ['resume', 'background', 'preload']);
});

test('fire proximity requested before unlock is applied when audio starts', async () => {
    const fireStates = [];
    const audio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => ({
            async resume() {},
            startBackground() {},
            setMuted() {},
            setFireNearby(nearby) { fireStates.push(nearby); },
            playCue() {},
        }),
    });

    assert.equal(typeof audio.setFireNearby, 'function');
    if (!audio.setFireNearby) return;

    audio.setFireNearby(true);
    await audio.unlock();
    audio.setFireNearby(false);

    assert.deepEqual(fireStates, [true, false]);
});

test('later unlock interactions do not restart preload while audio is already running', async () => {
    let preloadCount = 0;
    const engine = {
        async preload() { preloadCount += 1; },
        async resume() {},
        isRunning() { return true; },
        startBackground() {},
        setMuted() {},
        playCue() {},
    };
    const audio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => engine,
    });

    await audio.unlock();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(preloadCount, 1);

    await audio.unlock();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(preloadCount, 1);
});

test('a cue requested while audio is suspended resumes without replaying a stale cue', async () => {
    const calls = [];
    let running = false;
    const engine = {
        async resume() {
            calls.push('resume');
            running = true;
        },
        isRunning() { return running; },
        startBackground() { calls.push('background'); },
        setMuted() {},
        playCue(name) { calls.push(`cue:${name}`); },
    };
    const audio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => engine,
    });

    await audio.unlock();
    running = false;
    assert.equal(audio.play('step'), false);
    await audio.unlock();
    await new Promise((resolve) => setImmediate(resolve));

    assert.deepEqual(calls, ['resume', 'background', 'resume']);
});

test('physical audio loading does not block resume and retries failed files', async () => {
    const gameAudioModule = await import('../../resources/js/game/GameAudio.js');
    assert.equal(typeof gameAudioModule.createWebAudioEngine, 'function');

    const started = [];
    class FakeAudioContext {
        constructor() {
            this.state = 'suspended';
            this.currentTime = 0;
            this.destination = {};
        }

        createGain() {
            return {
                gain: { value: 1, setTargetAtTime() {} },
                connect() {},
            };
        }

        createBufferSource() {
            const source = {
                buffer: null,
                loop: false,
                connect() {},
                start() { started.push(source.buffer.fileName); },
                stop() {},
            };
            return source;
        }

        async decodeAudioData(data) { return data; }
        async resume() { this.state = 'running'; }
        async close() { this.state = 'closed'; }
    }

    const attempts = new Map();
    let currentTime = 1_000;
    let releaseFirstLoad;
    const firstLoadGate = new Promise((resolve) => { releaseFirstLoad = resolve; });
    const requestOptions = [];
    const fetchFile = async (url, options) => {
        requestOptions.push(options);
        const fileName = url.split('/').pop();
        const total = (attempts.get(fileName) ?? 0) + 1;
        attempts.set(fileName, total);
        if (fileName === 'music-loop.wav' && total === 1) await firstLoadGate;
        return {
            ok: !(fileName === 'ui-click.wav' && total === 1),
            async arrayBuffer() { return { fileName }; },
        };
    };
    const engine = gameAudioModule.createWebAudioEngine({
        AudioContextClass: FakeAudioContext,
        fetchFile,
        baseUrl: '/audio',
        now: () => currentTime,
        retryDelayMs: 10_000,
    });

    const firstPreload = engine.preload();
    await engine.resume();
    engine.startBackground();
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(started, []);

    releaseFirstLoad();
    await firstPreload;
    assert.deepEqual(started, ['music-loop.wav']);
    assert.equal(requestOptions.every((options) => options?.cache === 'force-cache'), true);
    assert.equal(attempts.get('ui-click.wav'), 1);

    await engine.preload();
    assert.equal(attempts.get('ui-click.wav'), 1);

    currentTime += 10_001;
    await engine.preload();
    assert.equal(attempts.get('ui-click.wav'), 2);
});

test('fire proximity starts one looping fire track and stops it when the player leaves', async () => {
    const started = [];
    const stopped = [];
    class FakeAudioContext {
        constructor() {
            this.state = 'suspended';
            this.currentTime = 0;
            this.destination = {};
        }

        createGain() {
            return {
                gain: { value: 1, setTargetAtTime() {} },
                connect() {},
            };
        }

        createBufferSource() {
            return {
                buffer: null,
                loop: false,
                connect() {},
                start() { started.push({ fileName: this.buffer.fileName, loop: this.loop }); },
                stop() { stopped.push(this.buffer.fileName); },
            };
        }

        async decodeAudioData(data) { return data; }
        async resume() { this.state = 'running'; }
        async close() { this.state = 'closed'; }
    }
    const fetchFile = async (url) => ({
        ok: true,
        async arrayBuffer() { return { fileName: url.split('/').pop() }; },
    });
    const gameAudioModule = await import('../../resources/js/game/GameAudio.js');
    const engine = gameAudioModule.createWebAudioEngine({
        AudioContextClass: FakeAudioContext,
        fetchFile,
        baseUrl: '/audio',
    });

    await engine.preload();
    await engine.resume();
    assert.equal(typeof engine.setFireNearby, 'function');
    if (!engine.setFireNearby) return;

    engine.setFireNearby(true);
    engine.setFireNearby(true);
    engine.setFireNearby(false);

    assert.deepEqual(started, [{ fileName: 'fire.wav', loop: true }]);
    assert.deepEqual(stopped, ['fire.wav']);
});

test('the full-volume mix boosts the master and plays every track at full source gain', async () => {
    const gainNodes = [];
    const started = [];

    class FakeAudioContext {
        constructor() {
            this.state = 'suspended';
            this.currentTime = 0;
            this.destination = {};
        }

        createGain() {
            const gain = {
                value: 1,
                setTargetAtTime(value) { this.value = value; },
            };
            const node = { gain, connect() {} };
            gainNodes.push(node);
            return node;
        }

        createBufferSource() {
            return {
                buffer: null,
                loop: false,
                connect(output) { this.output = output; },
                start() {
                    started.push({
                        fileName: this.buffer.fileName,
                        loop: this.loop,
                        volume: this.output.gain.value,
                    });
                },
                stop() {},
            };
        }

        async decodeAudioData(data) { return data; }
        async resume() { this.state = 'running'; }
        async close() { this.state = 'closed'; }
    }

    const fetchFile = async (url) => ({
        ok: true,
        async arrayBuffer() { return { fileName: url.split('/').pop() }; },
    });
    const engine = createWebAudioEngine({
        AudioContextClass: FakeAudioContext,
        fetchFile,
        baseUrl: '/audio',
    });

    await engine.preload();
    await engine.resume();
    engine.setMuted(false);
    engine.startBackground();
    engine.setFireNearby(true);
    engine.playCue('run');

    assert.equal(gainNodes[0].gain.value, 1.35);
    assert.deepEqual(started, [
        { fileName: 'music-loop.wav', loop: true, volume: 1 },
        { fileName: 'fire.wav', loop: true, volume: 1 },
        { fileName: 'run.wav', loop: false, volume: 1 },
    ]);
});

test('unlock starts the background once and mute suppresses sound effects', async () => {
    const calls = [];
    const engine = {
        async resume() { calls.push('resume'); },
        startBackground() { calls.push('background'); },
        setMuted(muted) { calls.push(`muted:${muted}`); },
        playCue(name) { calls.push(`cue:${name}`); },
    };
    const audio = new GameAudio({
        storage: createStorage(),
        engineFactory: () => engine,
    });

    assert.equal(await audio.unlock(), true);
    assert.equal(await audio.unlock(), true);
    assert.equal(audio.play('spray'), true);
    assert.equal(audio.play('not-a-cue'), false);
    assert.deepEqual(calls, [
        'resume',
        'muted:false',
        'background',
        'cue:spray',
    ]);

    audio.setMuted(true);

    assert.equal(audio.play('step'), false);
    assert.deepEqual(calls.slice(-1), ['muted:true']);
});
