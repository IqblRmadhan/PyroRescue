import test from 'node:test';
import assert from 'node:assert/strict';
import { isLevel2Walkable, level2Map } from '../../resources/js/game/Level2Map.js';

// Rute dihitung dari jalan pada PNG. Menangkap celah collision yang membuat misi buntu.
test('the three fire markers and finish are reachable in order without crossing terrain', () => {
    let column = 0;
    let row = 5;
    const routes = [
        { steps: [[17, 0], [0, 3], [2, 0]], end: [19, 8] },
        { steps: [[-2, 0], [0, -6], [13, 0], [0, 2], [4, 0], [0, 2]], end: [34, 6] },
        { steps: [[4, 0], [0, 12]], end: [38, 18] },
        { steps: [[0, 5], [-17, 0], [0, 6]], end: [21, 29] },
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
