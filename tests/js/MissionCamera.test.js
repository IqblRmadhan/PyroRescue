import test from 'node:test';
import assert from 'node:assert/strict';
import { getMissionCameraTarget, focusMissionTarget } from '../../resources/js/game/MissionCamera.js';
import { level1Map } from '../../resources/js/game/Level1Map.js';
import { level2Map } from '../../resources/js/game/Level2Map.js';
import { level3Map } from '../../resources/js/game/Level3Map.js';
test('camera selects the next objective across all levels', () => {
    assert.deepEqual(getMissionCameraTarget(1, 2, {}), level1Map.post1Action);
    assert.deepEqual(getMissionCameraTarget(2, 3, {map:level2Map}), level2Map.fires[3].action);
    assert.deepEqual(getMissionCameraTarget(3, 1, {activeStep:{target:level3Map.post}}), level3Map.post);
});
test('camera highlights the target then returns to the player after two seconds', () => {
    const calls=[];
    let returnToPlayer;
    const player = { x: 220, y: 460 };
    const scene = {
        player,
        cameras: { main: {
            stopFollow() { calls.push('stop'); },
            pan(...args) { calls.push(args); },
            panEffect: { reset() { calls.push('reset'); } },
            startFollow(...args) { calls.push(['follow', ...args]); },
            centerOn(...args) { calls.push(['center', ...args]); },
        } },
        time: { delayedCall(delay, callback) {
            calls.push(['delay', delay]);
            returnToPlayer = callback;
            return { remove() {} };
        } },
    };

    focusMissionTarget(scene,{column:34,row:18});
    assert.equal(calls[0],'stop');
    assert.deepEqual(calls[1],[1380,740,850,'Sine.easeInOut',true]);
    assert.deepEqual(calls[2], ['delay', 2000]);

    returnToPlayer();
    assert.equal(calls[3], 'reset');
    assert.deepEqual(calls[4], ['follow', player, true, 0.09, 0.09]);
    assert.deepEqual(calls[5], ['center', 220, 460]);

    focusMissionTarget(scene,{column:7,row:18},true);
    assert.equal(calls[7][2],0);
});
