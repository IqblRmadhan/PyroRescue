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
test('camera stops following and pans to the center of the target tile', () => {
    const calls=[];
    const scene={cameras:{main:{stopFollow(){calls.push('stop');},pan(...args){calls.push(args);}}}};
    focusMissionTarget(scene,{column:34,row:18});
    assert.equal(calls[0],'stop');
    assert.deepEqual(calls[1],[1380,740,850,'Sine.easeInOut',true]);
    focusMissionTarget(scene,{column:7,row:18},true);
    assert.equal(calls[3][2],0);
});
