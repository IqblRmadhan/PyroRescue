import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as gameAudioModule from '../../resources/js/game/GameAudio.js';

const audioDirectory = resolve('public/assets/audio');
const expectedAudioFiles = [
    'music-loop.wav',
    'fire.wav',
    'ui-click.wav',
    'story-next.wav',
    'run.wav',
    'clear.wav',
    'hint.wav',
    'reset.wav',
    'step.wav',
    'blocked.wav',
    'pump.wav',
    'water.wav',
    'spray.wav',
    'fire-out.wav',
    'command-error.wav',
    'target.wav',
    'challenge-complete.wav',
    'level-complete.wav',
];

function getPcmRms(audio) {
    let offset = 12;

    while (offset + 8 <= audio.length) {
        const chunkName = audio.subarray(offset, offset + 4).toString('ascii');
        const chunkSize = audio.readUInt32LE(offset + 4);

        if (chunkName === 'data') {
            const dataStart = offset + 8;
            const dataEnd = Math.min(dataStart + chunkSize, audio.length);
            let squaredTotal = 0;
            let sampleCount = 0;

            for (let sampleOffset = dataStart; sampleOffset + 1 < dataEnd; sampleOffset += 2) {
                const sample = audio.readInt16LE(sampleOffset) / 32_768;
                squaredTotal += sample * sample;
                sampleCount += 1;
            }

            return Math.sqrt(squaredTotal / sampleCount);
        }

        offset += 8 + chunkSize + (chunkSize % 2);
    }

    throw new Error('WAV data chunk is missing');
}

test('every game sound is stored as a valid WAV asset', () => {
    assert.equal(existsSync(audioDirectory), true, 'audio asset directory is missing');

    for (const fileName of expectedAudioFiles) {
        const filePath = resolve(audioDirectory, fileName);
        assert.equal(existsSync(filePath), true, `${fileName} is missing`);
        const audio = readFileSync(filePath);
        assert.equal(audio.subarray(0, 4).toString('ascii'), 'RIFF', `${fileName} has no RIFF header`);
        assert.equal(audio.subarray(8, 12).toString('ascii'), 'WAVE', `${fileName} has no WAVE header`);
        assert.ok(audio.length > 1_000, `${fileName} is unexpectedly empty`);
    }
});

test('the replacement fire ambience is web-sized PCM audio', () => {
    const filePath = resolve(audioDirectory, 'fire.wav');
    assert.equal(existsSync(filePath), true, 'fire.wav is missing');
    const audio = readFileSync(filePath);

    assert.equal(audio.readUInt16LE(22), 1, 'fire.wav must be mono');
    assert.equal(audio.readUInt32LE(24), 22_050, 'fire.wav must use a 22050 Hz sample rate');
    assert.equal(audio.readUInt16LE(34), 16, 'fire.wav must use 16-bit PCM');
});

test('fire ambience is loud enough to remain audible under background music', () => {
    const audio = readFileSync(resolve(audioDirectory, 'fire.wav'));

    assert.ok(
        getPcmRms(audio) >= 0.025,
        'fire.wav is too quiet to hear under the background music',
    );
});

test('the replaced forest fire ambience asset is removed', () => {
    assert.equal(existsSync(resolve(audioDirectory, 'forest-fire-loop.wav')), false);
});

test('audio cue names resolve to their physical files', () => {
    assert.equal(gameAudioModule.getAudioFileName?.('uiClick'), 'ui-click.wav');
    assert.equal(gameAudioModule.getAudioFileName?.('fireOut'), 'fire-out.wav');
    assert.equal(gameAudioModule.getAudioFileName?.('levelComplete'), 'level-complete.wav');
    assert.equal(gameAudioModule.getAudioFileName?.('unknown'), null);
});

test('music stays in the background player while fire uses proximity audio', () => {
    assert.deepEqual(gameAudioModule.backgroundAudioFiles, {
        music: 'music-loop.wav',
    });
    assert.deepEqual(gameAudioModule.proximityAudioFiles, {
        fire: 'fire.wav',
    });
});
