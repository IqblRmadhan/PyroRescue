import test from 'node:test';
import assert from 'node:assert/strict';
import {
    isNextTo,
    isOnTile,
    isWalkable,
    isWithinOneTile,
    level1Map,
    tileToWorld,
} from '../../resources/js/game/Level1Map.js';

test('map uses a 1600 by 1200 world with 40 by 30 hidden tiles', () => {
    assert.equal(level1Map.width, 1600);
    assert.equal(level1Map.height, 1200);
    assert.equal(level1Map.tileSize, 40);
    assert.equal(level1Map.terrain.length, 30);
    assert(level1Map.terrain.every((row) => row.length === 40));
});

test('one grid step moves exactly 40 pixels', () => {
    const start = tileToWorld(level1Map.start.column, level1Map.start.row);
    const next = tileToWorld(level1Map.start.column + 1, level1Map.start.row);

    assert.equal(next.x - start.x, 40);
    assert.equal(next.y - start.y, 0);
});

test('player respawns on the left-bottom brown road facing north', () => {
    assert.deepEqual(level1Map.start, {
        column: 4,
        row: 27,
        direction: 'north',
    });
    assert.equal(isWalkable(level1Map.start.column, level1Map.start.row), true);
});

test('all main brown-road branches are walkable', () => {
    const roadTiles = [
        [4, 13],  // loop kiri atas
        [9, 18],  // pertemuan loop kiri
        [20, 16], // jembatan tengah
        [27, 10], // loop kanan atas
        [34, 18], // jembatan kanan
        [37, 28], // jalan kanan bawah
        [6, 23],  // cabang kiri bawah
        [14, 26], // jalan bawah
    ];

    for (const [column, row] of roadTiles) {
        assert.equal(isWalkable(column, row), true, `${column},${row}`);
    }
});

test('grass and river tiles are not walkable', () => {
    const blockedTiles = [
        [0, 0],
        [12, 12],
        [16, 15],
        [25, 18],
        [30, 25],
    ];

    for (const [column, row] of blockedTiles) {
        assert.equal(isWalkable(column, row), false, `${column},${row}`);
    }
});

test('water pump is beside the road but does not occupy a walkable tile', () => {
    assert.deepEqual(level1Map.pump, { column: 3, row: 24 });
    assert.deepEqual(level1Map.waterAction, { column: 4, row: 24 });
    assert.equal(isWalkable(level1Map.pump.column, level1Map.pump.row), false);
    assert.equal(isWalkable(level1Map.waterAction.column, level1Map.waterAction.row), true);
    assert.equal(isNextTo(level1Map.waterAction.column, level1Map.waterAction.row, level1Map.pump), true);
    assert.equal(isOnTile(4, 24, level1Map.waterAction), true);
    assert.equal(isOnTile(4, 25, level1Map.waterAction), false);
    assert.equal(isNextTo(4, 25, level1Map.pump), false);
});

test('burning tree is close to the starting area and beside the lower road', () => {
    assert.deepEqual(level1Map.fire, { column: 8, row: 26 });
    assert.deepEqual(level1Map.fireAction, { column: 8, row: 27 });
    assert.equal(isWalkable(level1Map.fire.column, level1Map.fire.row), false);
    assert.equal(isWalkable(level1Map.fireAction.column, level1Map.fireAction.row), true);
    assert.equal(isNextTo(level1Map.fireAction.column, level1Map.fireAction.row, level1Map.fire), true);
    assert.equal(isOnTile(8, 27, level1Map.fireAction), true);
    assert.equal(isWithinOneTile(7, 27, level1Map.fire), true);
});
