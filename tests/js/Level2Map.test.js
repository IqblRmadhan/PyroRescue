import test from 'node:test';
import assert from 'node:assert/strict';
import { isLevel2Walkable, level2Map } from '../../resources/js/game/Level2Map.js';

// Rute dihitung dari jalan pada PNG. Menangkap celah collision yang membuat misi buntu.
test('the three fire markers and finish are reachable in order without crossing terrain', () => {
    let column = 0;
    let row = 5;
    const routes = [
        { steps: [[17, 0], [0, 3], [2, 0]], end: [19, 8] },
        { steps: [[-2, 0], [0, -6], [13, 0], [0, 2], [4, 0]], end: [34, 4] },
        { steps: [[0, 2], [4, 0], [0, 11]], end: [38, 17] },
        { steps: [[0, 6], [-17, 0], [0, 6]], end: [21, 29] },
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
    assert.deepEqual([level2Map.finish.column, level2Map.finish.row], [21, 29]);
    for (const [x, y] of [[-1, 5], [40, 6], [21, 30], [12, 12], [22, 8]]) {
        assert.equal(isLevel2Walkable(x, y), false);
    }
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
