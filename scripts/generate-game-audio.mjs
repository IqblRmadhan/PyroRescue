import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sampleRate = 22_050;
const audioDirectory = resolve('public/assets/audio');
const tau = Math.PI * 2;

mkdirSync(audioDirectory, { recursive: true });

function clamp(value, minimum = -1, maximum = 1) {
    return Math.max(minimum, Math.min(maximum, value));
}

function envelope(time, duration, attack = 0.015, release = 0.08) {
    const fadeIn = Math.min(1, time / attack);
    const fadeOut = Math.min(1, Math.max(0, duration - time) / release);
    return Math.max(0, Math.min(fadeIn, fadeOut));
}

function sine(frequency, time) {
    return Math.sin(tau * frequency * time);
}

function triangle(frequency, time) {
    return (2 / Math.PI) * Math.asin(sine(frequency, time));
}

function square(frequency, time) {
    return sine(frequency, time) >= 0 ? 1 : -1;
}

function saw(frequency, time) {
    return 2 * ((frequency * time) % 1) - 1;
}

function seededNoise(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1_664_525 + 1_013_904_223) >>> 0;
        return (state / 0xffffffff) * 2 - 1;
    };
}

function note(time, start, duration, frequency, volume = 1, wave = triangle) {
    if (time < start || time >= start + duration) return 0;
    const localTime = time - start;
    return wave(frequency, localTime)
        * envelope(localTime, duration, 0.012, Math.min(0.12, duration / 2))
        * volume;
}

function createWav(fileName, duration, renderSample) {
    const sampleCount = Math.ceil(sampleRate * duration);
    const dataSize = sampleCount * 2;
    const wav = Buffer.alloc(44 + dataSize);

    wav.write('RIFF', 0);
    wav.writeUInt32LE(36 + dataSize, 4);
    wav.write('WAVE', 8);
    wav.write('fmt ', 12);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(sampleRate, 24);
    wav.writeUInt32LE(sampleRate * 2, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write('data', 36);
    wav.writeUInt32LE(dataSize, 40);

    for (let index = 0; index < sampleCount; index += 1) {
        const time = index / sampleRate;
        const sample = clamp(renderSample(time, index, duration) * 0.92);
        wav.writeInt16LE(Math.round(sample * 32_767), 44 + index * 2);
    }

    writeFileSync(resolve(audioDirectory, fileName), wav);
}

function createMusic() {
    const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    const bass = [130.81, 146.83, 174.61, 146.83];
    const noise = seededNoise(11);

    createWav('music-loop.wav', 8, (time) => {
        const halfBeat = time % 0.5;
        const melodyIndex = Math.floor(time / 0.5) % melody.length;
        const beat = time % 1;
        const bassIndex = Math.floor(time) % bass.length;
        const melodyEnvelope = envelope(halfBeat, 0.5, 0.025, 0.16);
        const bassEnvelope = envelope(beat, 1, 0.035, 0.22);
        const percussion = halfBeat < 0.035
            ? noise() * envelope(halfBeat, 0.035, 0.002, 0.03) * 0.06
            : 0;

        return triangle(melody[melodyIndex], halfBeat) * melodyEnvelope * 0.22
            + sine(melody[melodyIndex] * 2, halfBeat) * melodyEnvelope * 0.04
            + sine(bass[bassIndex], beat) * bassEnvelope * 0.13
            + percussion;
    });
}

function createEffects() {
    createWav('ui-click.wav', 0.11, (time, _index, duration) => (
        square(520 + time * 1600, time) * envelope(time, duration, 0.004, 0.07) * 0.24
    ));

    const storyNoise = seededNoise(21);
    createWav('story-next.wav', 0.2, (time, _index, duration) => (
        sine(440 + time * 850, time) * envelope(time, duration, 0.01, 0.1) * 0.22
        + storyNoise() * envelope(time, duration, 0.005, 0.12) * 0.045
    ));

    createWav('run.wav', 0.38, (time) => (
        note(time, 0, 0.14, 330, 0.2, square)
        + note(time, 0.09, 0.15, 440, 0.2, square)
        + note(time, 0.18, 0.2, 660, 0.23, square)
    ));

    const clearNoise = seededNoise(31);
    createWav('clear.wav', 0.34, (time, _index, duration) => (
        saw(560 - time * 1100, time) * envelope(time, duration, 0.006, 0.16) * 0.17
        + clearNoise() * envelope(time, duration, 0.005, 0.22) * 0.055
    ));

    createWav('hint.wav', 0.62, (time) => (
        note(time, 0, 0.25, 659.25, 0.2)
        + note(time, 0.16, 0.25, 783.99, 0.2)
        + note(time, 0.32, 0.3, 987.77, 0.22)
    ));

    const resetNoise = seededNoise(41);
    createWav('reset.wav', 0.45, (time, _index, duration) => (
        triangle(640 - time * 1050, time) * envelope(time, duration, 0.01, 0.2) * 0.2
        + resetNoise() * envelope(time, duration, 0.005, 0.28) * 0.06
    ));

    const stepNoise = seededNoise(51);
    createWav('step.wav', 0.12, (time, _index, duration) => (
        sine(105 - time * 240, time) * envelope(time, duration, 0.002, 0.09) * 0.23
        + stepNoise() * envelope(time, duration, 0.001, 0.07) * 0.09
    ));

    createWav('blocked.wav', 0.3, (time, _index, duration) => (
        saw(150 - time * 120, time) * envelope(time, duration, 0.008, 0.18) * 0.24
    ));

    const pumpNoise = seededNoise(61);
    createWav('pump.wav', 0.48, (time, _index, duration) => {
        const pulse = Math.max(0, sine(7, time));
        return square(88 + pulse * 32, time) * envelope(time, duration, 0.01, 0.12) * 0.12
            + pumpNoise() * pulse * envelope(time, duration, 0.005, 0.15) * 0.11;
    });

    const waterNoise = seededNoise(71);
    createWav('water.wav', 0.38, (time, _index, duration) => (
        sine(380 + time * 900, time) * envelope(time, duration, 0.01, 0.16) * 0.13
        + sine(620 + time * 1200, time) * envelope(time, duration, 0.02, 0.12) * 0.08
        + waterNoise() * envelope(time, duration, 0.005, 0.18) * 0.045
    ));

    const sprayNoise = seededNoise(81);
    createWav('spray.wav', 0.55, (time, _index, duration) => (
        sprayNoise() * envelope(time, duration, 0.015, 0.18) * 0.19
        + sine(175 - time * 80, time) * envelope(time, duration, 0.01, 0.2) * 0.07
    ));

    const fireNoise = seededNoise(91);
    createWav('fire-out.wav', 0.86, (time, _index, duration) => (
        fireNoise() * envelope(time, 0.45, 0.005, 0.4) * 0.1
        + note(time, 0.22, 0.28, 392, 0.15)
        + note(time, 0.37, 0.28, 523.25, 0.16)
        + note(time, 0.52, duration - 0.52, 659.25, 0.18)
    ));

    createWav('command-error.wav', 0.5, (time) => (
        note(time, 0, 0.3, 220, 0.22, saw)
        + note(time, 0.2, 0.3, 174.61, 0.24, saw)
    ));

    createWav('target.wav', 0.42, (time) => (
        note(time, 0, 0.26, 523.25, 0.2)
        + note(time, 0.14, 0.28, 783.99, 0.22)
    ));

    createWav('challenge-complete.wav', 0.86, (time) => (
        note(time, 0, 0.28, 392, 0.19)
        + note(time, 0.16, 0.28, 523.25, 0.2)
        + note(time, 0.32, 0.28, 659.25, 0.21)
        + note(time, 0.48, 0.38, 783.99, 0.23)
    ));

    createWav('level-complete.wav', 1.35, (time) => (
        note(time, 0, 0.34, 261.63, 0.18)
        + note(time, 0.18, 0.34, 329.63, 0.19)
        + note(time, 0.36, 0.34, 392, 0.2)
        + note(time, 0.54, 0.36, 523.25, 0.21)
        + note(time, 0.74, 0.38, 659.25, 0.22)
        + note(time, 0.94, 0.41, 783.99, 0.24)
    ));
}

createMusic();
createEffects();

console.log(`Generated 17 synthetic WAV files in ${audioDirectory}`);
