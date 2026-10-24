import { level1Map } from './Level1Map.js';

export function getMissionCameraTarget(level, challenge, scene) {
    if (level === 1) return [null, level1Map.waterAction, level1Map.post1Action,
        level1Map.post2Action, level1Map.finish][challenge];
    if (level === 3) return scene.activeStep?.target;
    return scene.map.fires[challenge]?.action;
}

// Sorot tujuan sebentar, lalu kembalikan pandangan ke posisi pemain.
export function focusMissionTarget(scene, target, reducedMotion = false) {
    if (!target) return;
    const camera = scene.cameras.main;
    scene.missionCameraReturnEvent?.remove(false);
    camera.stopFollow();
    camera.pan(target.column * 40 + 20, target.row * 40 + 20,
        reducedMotion ? 0 : 850, 'Sine.easeInOut', true);
    scene.missionCameraReturnEvent = scene.time.delayedCall(2000, () => {
        camera.panEffect.reset();
        camera.startFollow(scene.player, true, 0.09, 0.09);
        camera.centerOn(scene.player.x, scene.player.y);
        scene.missionCameraReturnEvent = null;
    });
}
