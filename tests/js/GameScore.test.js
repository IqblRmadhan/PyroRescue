import test from 'node:test';
import assert from 'node:assert/strict';
import { CODE_ERROR_PENALTY, COLLISION_PENALTY, deductScore, starsForScore, starsForFinish, badgeForScore, canFinishLevel } from '../../resources/js/game/GameScore.js';

test('wrong code and blocked movement reduce score without dropping below zero', () => {
    assert.equal(deductScore(100, CODE_ERROR_PENALTY), 95);
    assert.equal(deductScore(95, COLLISION_PENALTY), 85);
    assert.equal(deductScore(4, COLLISION_PENALTY), 0);
});

test('every completed level earns a badge, with quality determined only by score', () => {
    for (const [score, tier] of [[1, 'Tuntas'], [69, 'Tuntas'], [70, 'Perunggu'], [84, 'Perunggu'], [85, 'Perak'], [99, 'Perak'], [100, 'Emas']]) {
        assert.equal(badgeForScore(1, score).tier, tier);
    }
    assert.equal(badgeForScore(3, 10).title, 'Sahabat Bekantan');
});

test('FINISH requires all training challenges and successful evaluation', () => {
    const success = { reachedFinish: true, missionSuccess: true };
    assert.equal(canFinishLevel(new Set([1, 2, 3]), 4, success), true);
    assert.equal(canFinishLevel(new Set([1, 3]), 4, success), false);
    assert.equal(canFinishLevel(new Set([1, 2, 3]), 4, { ...success, missionSuccess: false }), false);
    assert.equal(canFinishLevel(new Set([1, 2, 3]), 4, { ...success, reachedFinish: false }), false);
    // Level 1 dapat menyerahkan air di C3 lalu berjalan ke FINISH dalam satu Run.
    assert.equal(canFinishLevel(new Set([1, 2]), 3, success), true);
    assert.equal(canFinishLevel(new Set([1, 2]), 3, success, 2), false);
});

test('finish gives stars only after evaluation, at the exact percentage thresholds', () => {
    assert.equal(starsForScore(100, false), 0);
    assert.equal(starsForScore(69, true), 0);
    assert.equal(starsForScore(70, true), 1);
    assert.equal(starsForScore(84, true), 1);
    assert.equal(starsForScore(85, true), 2);
    assert.equal(starsForScore(99, true), 2);
    assert.equal(starsForScore(100, true), 3);
    assert.equal(starsForFinish(100, false), 2);
    assert.equal(starsForFinish(85, false), 2);
    assert.equal(starsForFinish(70, false), 1);
    assert.equal(starsForFinish(69, false), 0);
});
