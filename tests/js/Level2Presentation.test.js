import test from 'node:test';
import assert from 'node:assert/strict';
import challenges, * as level2Config from '../../resources/js/game/Level2Challenges.js';

test('fire presentation distinguishes active, upcoming, and extinguished fires', () => {
    assert.equal(typeof level2Config.getFirePresentation, 'function');

    assert.deepEqual(level2Config.getFirePresentation(1, 1, 0, challenges), {
        completed: false,
        label: 'C1 • 2× SEMPROT',
        markerState: 'visible',
    });
    assert.deepEqual(level2Config.getFirePresentation(2, 1, 0, challenges), {
        completed: false,
        label: 'C2 • 1× SEMPROT',
        markerState: 'visible',
    });
    assert.equal(level2Config.getFirePresentation(3, 1, 0, challenges).label, 'C3 • 3× SEMPROT');
    assert.deepEqual(level2Config.getFirePresentation(1, 2, 0, challenges), {
        completed: true,
        label: 'C1 • PADAM',
        markerState: 'completed',
    });
});

test('active fire label shows the remaining sprays', () => {
    assert.equal(typeof level2Config.getFirePresentation, 'function');
    assert.equal(level2Config.getFirePresentation(3, 3, 1, challenges).label, 'C3 • SISA 2 SEMPROT');
});

test('pump animation cycles follow the assigned water amount', () => {
    assert.equal(level2Config.getPumpAnimationCycleCount(0), 0);
    assert.equal(level2Config.getPumpAnimationCycleCount(3), 3);
    assert.equal(level2Config.getPumpAnimationCycleCount(6), 6);
});

test('evaluation water target follows its three-spray requirement', () => {
    assert.equal(level2Config.getLevel2WaterTarget(1, challenges), 6);
    assert.equal(level2Config.getLevel2WaterTarget(4, challenges), 3);
    assert.equal(level2Config.getLevel2WaterCapacity(1), 6);
    assert.equal(level2Config.getLevel2WaterCapacity(4), 6);
    assert.equal(level2Config.isLevel2WaterTargetComplete(1, 3, challenges), false);
    assert.equal(level2Config.isLevel2WaterTargetComplete(1, 6, challenges), true);
    assert.equal(level2Config.isLevel2WaterTargetComplete(4, 2, challenges), false);
    assert.equal(level2Config.isLevel2WaterTargetComplete(4, 3, challenges), true);
    assert.equal(level2Config.isLevel2WaterTargetComplete(4, 6, challenges), true);
});

test('route hints follow the relocated C2 marker', () => {
    assert.match(challenges[2].hints[1], /bawah\(2\), kanan\(4\)\./);
    assert.doesNotMatch(challenges[2].hints[1], /kanan\(4\), bawah\(2\)/);
    assert.match(challenges[3].hints[1], /bawah\(2\), kanan\(4\), bawah\(11\)/);
    assert.deepEqual(challenges[4].hints, []);
    assert.equal(challenges[4].texture, 'fireEval');
    assert.equal(challenges[4].requiredWater, 3);
    assert.equal(challenges[2].requiredWater, 1);
    assert.equal(challenges[3].requiredWater, 3);
    assert.equal(level2Config.getFirePresentation(4, 4, 0, challenges).label, 'EVALUASI');
    assert.equal(level2Config.getFirePresentation(4, 4, 2, challenges).label, 'EVALUASI');
    assert.equal(level2Config.getFirePresentation(4, 4, 3, challenges).label, 'EVALUASI • PADAM');
});
