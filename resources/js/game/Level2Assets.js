import { level1Assets } from './Level1Assets.js';

// Setiap PNG berisi empat frame api dan satu frame padam, masing-masing 150 x 150.
const fireFrames = {
    fire1: [0, 0, 150, 150], fire2: [150, 0, 150, 150],
    fire3: [300, 0, 150, 150], fire4: [450, 0, 150, 150],
    extinguished: [600, 0, 150, 150],
};

export const level2Assets = {
    waterTerrain: level1Assets.waterTerrain,
    firefighterWalk: level1Assets.firefighterWalk,
    firefighterIdle: level1Assets.firefighterIdle,
    firefighterSpray: level1Assets.firefighterSpray,
    firefighterRespawn: level1Assets.firefighterRespawn,
    actionMarker: level1Assets.actionMarker,
    fireC1: { file: 'objects/LEVEL2-C1.png', frames: fireFrames },
    fireC2: { file: 'objects/LEVEL2-C2.png', frames: fireFrames },
    fireC3: { file: 'objects/LEVEL2-C3.png', frames: fireFrames },
};
