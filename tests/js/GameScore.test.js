import test from 'node:test';
import assert from 'node:assert/strict';
import { CODE_ERROR_PENALTY, COLLISION_PENALTY, deductScore, starsForScore } from '../../resources/js/game/GameScore.js';

test('wrong code and blocked movement reduce score without dropping below zero', () => {
    assert.equal(deductScore(100, CODE_ERROR_PENALTY), 95);
    assert.equal(deductScore(95, COLLISION_PENALTY), 85);
    assert.equal(deductScore(4, COLLISION_PENALTY), 0);
});

test('finish gives stars only after evaluation, at the exact percentage thresholds', () => {
    assert.equal(starsForScore(100, false), 0);
    assert.equal(starsForScore(69, true), 0);
    assert.equal(starsForScore(70, true), 1);
    assert.equal(starsForScore(84, true), 1);
    assert.equal(starsForScore(85, true), 2);
    assert.equal(starsForScore(99, true), 2);
    assert.equal(starsForScore(100, true), 3);
});
