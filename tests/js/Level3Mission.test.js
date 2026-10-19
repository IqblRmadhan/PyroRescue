import test from 'node:test';
import assert from 'node:assert/strict';
import { Level3Mission } from '../../resources/js/game/Level3Mission.js';

test('checkpoint reset preserves previous rescues and current sub-mission resources', () => {
    const mission = new Level3Mission(2);
    assert.deepEqual(mission.rescued, [1]);
    assert.equal(mission.water, 2);
    mission.step = 3;
    mission.water = 5;
    mission.saveCheckpoint();
    mission.water = 1;
    mission.sprays[2] = 2;
    mission.restoreCheckpoint();
    assert.equal(mission.step, 3);
    assert.equal(mission.water, 5);
    assert.equal(mission.sprays[2], 0);
    assert.deepEqual(mission.rescued, [1]);
});

test('rescue is counted only at the post and evaluation needs all three animals', () => {
    const mission = new Level3Mission(4);
    mission.sprays[4] = 4;
    mission.following = 4;
    mission.evaluationPassed = true;
    assert.equal(mission.canFinish(), false);
    mission.deliver();
    assert.deepEqual(mission.rescued, [1, 2, 4]);
    assert.equal(mission.canFinish(), true);
    mission.deliver();
    assert.equal(mission.rescued.length, 3);
});

test('Challenge 3 never starts with the last animal rescued or final fire extinguished', () => {
    const mission = new Level3Mission(3);
    assert.equal(mission.fireNumber, 4);
    assert.equal(mission.sprays[4], 0);
    assert.equal(mission.water, 2);
    assert.deepEqual(mission.rescued, [1, 2]);
    assert.equal(mission.world.api_padam, false);
});
