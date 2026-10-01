import test from 'node:test';
import assert from 'node:assert/strict';
import { level2Assets } from '../../resources/js/game/Level2Assets.js';

test('all Level 2 fires use five horizontal 200 pixel frames', () => {
    const expectedFrames = {
        fire1: [0, 0, 200, 200],
        fire2: [200, 0, 200, 200],
        fire3: [400, 0, 200, 200],
        fire4: [600, 0, 200, 200],
        extinguished: [800, 0, 200, 200],
    };

    for (const key of ['fireC1', 'fireC2', 'fireC3']) {
        assert.deepEqual(level2Assets[key].frames, expectedFrames);
    }
});
