import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { level3Map, isLevel3Walkable, level3WorldToTile } from '../../resources/js/game/Level3Map.js';
import { level3Assets, level3MapImage, level3MapShadowImage } from '../../resources/js/game/Level3Assets.js';

function readWebpDimensions(image) {
    assert.equal(image.toString('ascii', 0, 4), 'RIFF');
    assert.equal(image.toString('ascii', 8, 12), 'WEBP');

    const chunkType = image.toString('ascii', 12, 16);
    if (chunkType === 'VP8X') {
        return [image.readUIntLE(24, 3) + 1, image.readUIntLE(27, 3) + 1];
    }
    if (chunkType === 'VP8 ') {
        return [image.readUInt16LE(26) & 0x3fff, image.readUInt16LE(28) & 0x3fff];
    }

    throw new Error(`Unsupported WebP chunk: ${chunkType}`);
}

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
        ...Object.values(level3Map.fires).map(fire => fire.action), level3Map.post,
        level3Map.tower, level3Map.crossing, level3Map.northWatch, level3Map.alternative,
        level3Map.evaluationStart, level3Map.finish]) {
        assert.equal(visited.has(`${target.column},${target.row}`), true);
    }
    for (const [column, row] of [[-1, 0], [40, 18], [0, 30], [10, 10], [32, 8], [25, 22]]) {
        assert.equal(isLevel3Walkable(column, row), false, 'water is blocked');
    }
});

test('Level 3 uses only the central pump and converts debug clicks to grid tiles', () => {
    assert.deepEqual(level3Map.pump, level3Map.evaluationPump);
    assert.deepEqual(level3Map.pump.action, { column: 22, row: 18 });
    assert.deepEqual(level3WorldToTile(899, 759), { column: 22, row: 18 });
    assert.equal(isLevel3Walkable(22, 18), true);
    assert.notDeepEqual(level3Map.pump.action, level3Map.crossing);
});

test('map and shadow align and all asset frames stay within their source images', () => {
    for (const file of [level3MapImage, level3MapShadowImage]) {
        const webp = readFileSync(`public/assets/${file}`);
        assert.deepEqual(readWebpDimensions(webp), [1600, 1200]);
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
