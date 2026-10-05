import test from 'node:test';
import assert from 'node:assert/strict';
import * as fireAudio from '../../resources/js/game/Level2Challenges.js';

test('fire is audible inside the full 5 by 5 tile area and silent outside it', () => {
    assert.equal(typeof fireAudio.isPlayerNearBurningFire, 'function');
    if (!fireAudio.isPlayerNearBurningFire) return;

    const state = { challengeNumber: 1, sprays: 0 };
    assert.equal(fireAudio.isPlayerNearBurningFire({ column: 17, row: 6, ...state }), true);
    assert.equal(fireAudio.isPlayerNearBurningFire({ column: 21, row: 10, ...state }), true);
    assert.equal(fireAudio.isPlayerNearBurningFire({ column: 16, row: 8, ...state }), false);
    assert.equal(fireAudio.isPlayerNearBurningFire({ column: 19, row: 11, ...state }), false);
});

test('completed fires are silent while upcoming burning fires remain audible', () => {
    assert.equal(typeof fireAudio.isPlayerNearBurningFire, 'function');
    if (!fireAudio.isPlayerNearBurningFire) return;

    assert.equal(fireAudio.isPlayerNearBurningFire({
        column: 19, row: 8, challengeNumber: 1, sprays: 2,
    }), false);
    assert.equal(fireAudio.isPlayerNearBurningFire({
        column: 19, row: 8, challengeNumber: 2, sprays: 0,
    }), false);
    assert.equal(fireAudio.isPlayerNearBurningFire({
        column: 34, row: 4, challengeNumber: 1, sprays: 0,
    }), true);
});
