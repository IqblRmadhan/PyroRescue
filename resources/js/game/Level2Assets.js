import { level1Assets } from './Level1Assets.js';

// Setiap PNG berisi empat frame api dan satu frame padam, masing-masing 200 x 200.
const fireFrames = {
    fire1: [0, 0, 200, 200], fire2: [200, 0, 200, 200],
    fire3: [400, 0, 200, 200], fire4: [600, 0, 200, 200],
    extinguished: [800, 0, 200, 200],
};

export const level2Assets = {
    waterTerrain: level1Assets.waterTerrain,
    firefighterWalk: level1Assets.firefighterWalk,
    firefighterIdle: level1Assets.firefighterIdle,
    firefighterSpray: level1Assets.firefighterSpray,
    firefighterRespawn: level1Assets.firefighterRespawn,
    actionMarker: level1Assets.actionMarker,
    waterPumpAction: level1Assets.waterPumpAction,
    waterPump: level1Assets.waterPump,
    fireC1: { file: 'objects/LEVEL2-C1.png', frames: fireFrames },
    fireC2: { file: 'objects/LEVEL2-C2.png', frames: fireFrames },
    fireC3: { file: 'objects/LEVEL2-C3.png', frames: fireFrames },
    fireEval: { file: 'objects/LEVEL2-EVAL.png', frames: fireFrames },
};

export const level2MapImage = 'maps/level2-map.png';
export const level2MapShadowImage = 'maps/shadow_level2.png';

export function addLevel2MapShadow(scene, width, height) {
    const shadow = scene.add.image(0, 0, 'level2Shadow')
        .setOrigin(0)
        .setDisplaySize(width, height)
        .setDepth(0);

    scene.add.image(0, 0, 'level2Shadow')
        .setOrigin(0)
        .setDisplaySize(width, height)
        .setDepth(0)
        .setAlpha(0.8);

    return shadow;
}
