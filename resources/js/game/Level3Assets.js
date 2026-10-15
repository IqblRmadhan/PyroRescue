import { level2Assets } from './Level2Assets.js';

export const level3Assets = {
    ...level2Assets,
    // Dua baris, masing-masing lima pose. Batas kolom mengikuti gambar asli
    // yang tidak persis seragam agar tangan/ekor tidak terpotong.
    bekantan: {
        file: 'objects/Bekantan.png',
        frames: {
            worried1: [0, 0, 420, 396],
            worried2: [420, 0, 400, 396],
            worried3: [820, 0, 400, 396],
            worried4: [1220, 0, 410, 396],
            worried5: [1630, 0, 353, 396],
            rescued1: [0, 396, 420, 397],
            rescued2: [420, 396, 400, 397],
            rescued3: [820, 396, 400, 397],
            rescued4: [1220, 396, 410, 397],
            rescued5: [1630, 396, 353, 397],
        },
    },
};

export const level3MapImage = 'maps/level3-map.png';
export const level3MapShadowImage = 'maps/shadow_level3.png';
