import test from 'node:test';
import assert from 'node:assert/strict';
import * as Level2Map from '../../resources/js/game/Level2Map.js';
import { isLevel2Walkable, level2Map } from '../../resources/js/game/Level2Map.js';

test('Level 2 finish presentation contains only the shared checkered tile', () => {
    assert.equal(typeof Level2Map.getLevel2FinishVisual, 'function');
    assert.deepEqual(Level2Map.getLevel2FinishVisual(level2Map), {
        tile: level2Map.finish,
    });
});

// Rute dihitung dari jalan pada PNG. Menangkap celah collision yang membuat misi buntu.
test('all fire markers, evaluation pump, and finish follow the new road', () => {
    let column = 0;
    let row = 5;
    const routes = [
        { steps: [[17, 0], [0, 3], [2, 0]], end: [19, 8] },
        { steps: [[-2, 0], [0, -6], [13, 0], [0, 2], [4, 0]], end: [34, 4] },
        { steps: [[0, 2], [4, 0], [0, 11]], end: [38, 17] },
        { steps: [[0, 3]], end: [38, 20] },
        { steps: [[0, 3], [-12, 0], [0, 2], [-2, 0], [0, 2]], end: [24, 27] },
        { steps: [[0, 2]], end: [24, 29] },
    ];
    for (const route of routes) {
        for (const [dx, dy] of route.steps) {
            for (let step = 0; step < Math.abs(dx || dy); step += 1) {
                column += Math.sign(dx);
                row += Math.sign(dy);
                assert.equal(isLevel2Walkable(column, row), true, `${column},${row}`);
            }
        }
        assert.deepEqual([column, row], route.end);
    }
    assert.deepEqual(level2Map.evaluationPump.action, { column: 38, row: 20 });
    assert.deepEqual(level2Map.evaluationStart, { column: 38, row: 20, direction: 'south' });
    assert.deepEqual(level2Map.fires[4].action, { column: 24, row: 27 });
    assert.deepEqual([level2Map.finish.column, level2Map.finish.row], [24, 29]);
    for (const [x, y] of [[-1, 5], [40, 6], [24, 30], [12, 12], [22, 8], [24, 23]]) {
        assert.equal(isLevel2Walkable(x, y), false);
    }
});

test('the evaluation pump sits on the marked grass beside the lower road', () => {
    const pump = level2Map.evaluationPump;
    assert.equal(pump.x, 1480);
    assert.equal(pump.y, 840);
    assert.equal(isLevel2Walkable(pump.action.column, pump.action.row), true);
    assert.equal(pump.capacity, 6);
});

test('evaluation marker and label sit one step higher beside the final fire', () => {
    assert.deepEqual(level2Map.fires[4].action, { column: 24, row: 27 });
    assert.deepEqual(level2Map.fires[4].label, {
        x: 1100,
        y: 1080,
        placement: 'above',
    });
    assert.equal(isLevel2Walkable(24, 27), true);
});

test('C2 is the upper-right fire and C3 is the lower-right fire', () => {
    assert.deepEqual(level2Map.fires[2].action, { column: 34, row: 4 });
    assert.deepEqual(level2Map.fires[2].label, {
        x: 1370,
        y: 50,
        placement: 'above',
    });
    assert.deepEqual(level2Map.fires[3].action, { column: 38, row: 17 });
    assert.equal(level2Map.fires[2].y < level2Map.fires[3].y, true);
});

test('the pump can be reached from the starting road before C1', () => {
    assert.deepEqual(level2Map.pump.action, { column: 15, row: 5 });
    assert.deepEqual(
        { x: level2Map.pump.x, y: level2Map.pump.y },
        { x: 620, y: 180 },
    );
    assert.equal(level2Map.pump.spriteOffsetX, -4);
    assert.equal(level2Map.pump.x + level2Map.pump.spriteOffsetX, 616);
    assert.equal(isLevel2Walkable(15, 5), true);
    assert.equal(isLevel2Walkable(17, 8), true);
    assert.equal(level2Map.pump.capacity, 6);
});

test('C1 is moved down and C3 is moved right by one grid tile', () => {
    assert.equal(level2Map.fires[1].y, 475);
    assert.equal(level2Map.fires[3].x, 1450);
});

test('evaluation tree fills the marked brown clearing at the same scale as other fires', () => {
    assert.deepEqual(
        { x: level2Map.fires[4].x, y: level2Map.fires[4].y, size: level2Map.fires[4].size },
        { x: 1100, y: 1220, size: 210 },
    );
});
