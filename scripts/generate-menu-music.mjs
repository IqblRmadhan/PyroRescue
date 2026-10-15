import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Lagu orisinal 8-bit untuk menu: 8 birama, 150 BPM, tangga nada E minor.
const sampleRate = 22_050;
const beat = 0.4;
const duration = 32 * beat;
const sampleCount = Math.round(duration * sampleRate);
const output = Buffer.alloc(44 + sampleCount * 2);
const tau = 2 * Math.PI;
const notes = {
    E4: 329.63, G4: 392, A4: 440, B4: 493.88, C5: 523.25,
    D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77,
};
const lead = [
    'E5', null, 'G5', 'E5', 'B4', 'D5', 'E5', null,
    'G5', 'A5', 'B5', 'G5', 'E5', 'D5', 'B4', null,
    'E5', 'G5', 'A5', 'G5', 'E5', null, 'D5', 'B4',
    'C5', 'E5', 'G5', 'E5', 'D5', 'B4', 'A4', null,
    'E5', 'G5', 'B5', 'G5', 'E5', 'D5', 'B4', null,
    'A4', 'C5', 'E5', 'G5', 'A5', 'G5', 'E5', null,
    'B4', 'D5', 'G5', 'D5', 'B4', 'A4', 'G4', null,
    'E5', 'G5', 'A5', 'B5', 'G5', 'E5', 'D5', 'B4',
];
const bass = [82.41, 65.41, 98, 73.42, 82.41, 87.31, 98, 73.42];
const chords = [
    ['E4', 'G4', 'B4'], ['C5', 'E5', 'G5'],
    ['G4', 'B4', 'D5'], ['D5', 'A4', 'E5'],
    ['E4', 'G4', 'B4'], ['A4', 'C5', 'E5'],
    ['G4', 'B4', 'D5'], ['D5', 'A4', 'E5'],
];
let noiseSeed = 911;

function square(frequency, time) {
    return Math.sin(tau * frequency * time) >= 0 ? 1 : -1;
}

function triangle(frequency, time) {
    return (2 / Math.PI) * Math.asin(Math.sin(tau * frequency * time));
}

function noise() {
    noiseSeed = (Math.imul(noiseSeed, 1664525) + 1013904223) >>> 0;
    return (noiseSeed / 0xffffffff) * 2 - 1;
}

function fade(time, length, release = 0.04) {
    return Math.max(0, Math.min(1, time / 0.008, (length - time) / release));
}

output.write('RIFF', 0);
output.writeUInt32LE(output.length - 8, 4);
output.write('WAVEfmt ', 8);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(1, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * 2, 28);
output.writeUInt16LE(2, 32);
output.writeUInt16LE(16, 34);
output.write('data', 36);
output.writeUInt32LE(sampleCount * 2, 40);

for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const bar = Math.floor(time / (beat * 4));
    const leadIndex = Math.floor(time / (beat / 2));
    const leadTime = time % (beat / 2);
    const bassTime = time % beat;
    const arpIndex = Math.floor(time / (beat / 4)) % 3;
    const arpTime = time % (beat / 4);
    const kickTime = time % (beat * 2);
    const snareTime = (time + beat) % (beat * 2);
    const hatTime = time % (beat / 2);

    const leadNote = lead[leadIndex];
    const melody = leadNote
        ? square(notes[leadNote], leadTime) * fade(leadTime, beat * 0.44) * 0.17
        : 0;
    const low = triangle(bass[bar], bassTime) * fade(bassTime, beat * 0.85, 0.09) * 0.16;
    const chordNote = notes[chords[bar][arpIndex]];
    const arp = triangle(chordNote, arpTime) * fade(arpTime, beat * 0.22) * 0.075;
    const kick = kickTime < 0.15
        ? Math.sin(tau * (90 - 45 * kickTime / 0.15) * kickTime) * (1 - kickTime / 0.15) * 0.22
        : 0;
    const snare = snareTime < 0.11 ? noise() * (1 - snareTime / 0.11) * 0.10 : 0;
    const hat = hatTime < 0.022 ? noise() * (1 - hatTime / 0.022) * 0.055 : 0;
    const loopFade = Math.min(1, time / 0.025, (duration - time) / 0.025);
    const mixed = (melody + low + arp + kick + snare + hat) * loopFade;
    output.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mixed)) * 32767), 44 + index * 2);
}

const folder = resolve('public/assets/audio');
mkdirSync(folder, { recursive: true });
writeFileSync(resolve(folder, 'menu-action-loop.wav'), output);
console.log('Generated original 8-bit menu action loop.');
