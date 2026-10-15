import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { level3Map, isLevel3Walkable } from '../../resources/js/game/Level3Map.js';
import { level3Assets, level3MapImage, level3MapShadowImage } from '../../resources/js/game/Level3Assets.js';

test('every Level 3 interaction and checkpoint is reachable from the start', () => {
    const visited = new Set();
    const queue = [level3Map.start];
    while (queue.length) {
        const { column, row } = queue.shift();
        const key = `${column},${row}`;
        if (visited.has(key) || !isLevel3Walkable(column, row)) continue;
        visited.add(key);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) queue.push({ column: column + dx, row: row + dy });
    }
    for (const target of [level3Map.pump.action, level3Map.evaluationPump.action, level3Map.habitat,
        level3Map.fires[1].action, level3Map.fires[4].action, level3Map.evaluationStart, level3Map.finish]) {
        assert.equal(visited.has(`${target.column},${target.row}`), true);
    }
    for (const [column, row] of [[-1, 0], [40, 18], [0, 30], [10, 10], [32, 8], [25, 22]]) {
        assert.equal(isLevel3Walkable(column, row), false, 'water is blocked');
    }
});

test('map and shadow align and all asset frames stay within original PNGs', () => {
    for (const file of [level3MapImage, level3MapShadowImage]) {
        const png = readFileSync(`public/assets/${file}`);
        assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1600, 1200]);
    }
    for (const asset of Object.values(level3Assets)) {
        assert.equal(existsSync(`public/assets/${asset.file}`), true, asset.file);
        const png = readFileSync(`public/assets/${asset.file}`);
        const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
        for (const [x, y, w, h] of Object.values(asset.frames)) {
            assert.ok(x >= 0 && y >= 0 && x + w <= width && y + h <= height, asset.file);
        }
    }
});
