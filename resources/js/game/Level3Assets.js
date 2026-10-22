import { level2Assets } from './Level2Assets.js';

// Bekantan.png berisi dua baris pose: baris pertama belum selamat, baris kedua sudah selamat.
// Setiap baris memiliki lima frame dengan lebar tidak seragam agar ekor/tangan tidak terpotong.
const bekantanStateFrames = {
    worried: {
        worried1: [65, 23, 319, 369],
        worried2: [430, 23, 375, 369],
        worried3: [831, 23, 371, 369],
        worried4: [1248, 23, 357, 369],
        worried5: [1646, 23, 262, 369],
    },
    rescued: {
        rescued1: [53, 406, 335, 360],
        rescued2: [443, 406, 319, 360],
        rescued3: [852, 406, 318, 360],
        rescued4: [1225, 406, 367, 360],
        rescued5: [1641, 406, 293, 360],
    },
};

// Lembar arah (atas, bawah, kanan-kiri) berisi lima frame 200 x 200 untuk kedua keadaan.
const BEKANTAN_FRAME = 200;

function directionFrames() {
    const frames = {};
    for (const state of ['worried', 'rescued']) {
        for (let number = 1; number <= 5; number += 1) {
            frames[`${state}${number}`] = [(number - 1) * BEKANTAN_FRAME, 0, BEKANTAN_FRAME, BEKANTAN_FRAME];
        }
    }
    return frames;
}

function idleFrames() {
    const frames = {};
    for (let number = 1; number <= 8; number += 1) {
        frames[`diam${number}`] = [(number - 1) * BEKANTAN_FRAME, 0, BEKANTAN_FRAME, BEKANTAN_FRAME];
    }
    return frames;
}

const bekantanSheet = file => ({ file, frames: directionFrames() });

export const level3Assets = {
    ...level2Assets,
    bekantan: { file: 'objects/Bekantan.png', frames: { ...bekantanStateFrames.worried, ...bekantanStateFrames.rescued } },
    // Lembar terpisah mengikuti arah pemain: atas, bawah, dan samping (kanan/kiri).
    bekantanAtas: bekantanSheet('objects/Bekantan-atas.png'),
    bekantanBawah: bekantanSheet('objects/Bekantan-bawah.png'),
    bekantanSamping: bekantanSheet('objects/Bekantan-KananKiri.png'),
    // Bekantan mengikuti pemain saat berhenti: satu baris berisi delapan frame 200 x 200.
    bekantanDiam: { file: 'objects/Bekantan-diam.png', frames: idleFrames() },
};

// Lembar yang dipakai ketika bekantan mengikuti pemain pada arah tertentu.
// Arah barat memakai lembar samping yang di-flip.
export const bekantanPlayerFacing = {
    north: { texture: 'bekantanAtas', flipX: false },
    south: { texture: 'bekantanBawah', flipX: false },
    east: { texture: 'bekantanSamping', flipX: false },
    west: { texture: 'bekantanSamping', flipX: true },
};

export const level3MapImage = 'maps/level3-map.webp';
export const level3MapShadowImage = 'maps/shadow_level3.webp';
