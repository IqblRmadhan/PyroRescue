import test from 'node:test';
import assert from 'node:assert/strict';
import {
    isNextTo,
    isOnTile,
    isWalkable,
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
        [27, 11], // jalan lurus bagian atas
        [34, 18], // jembatan kanan
        [37, 28], // jalan kanan bawah
        [6, 23],  // cabang kiri bawah
        [13, 26], // ujung jalan bawah
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
        [22, 7],  // jalur map lama
        [27, 10], // jalur map lama
        [16, 26], // melewati ujung jalan buntu
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

test('Pos 1 interaction point is on the middle-left road', () => {
    assert.deepEqual(level1Map.post1Action, { column: 14, row: 18 });
    assert.equal(isWalkable(level1Map.post1Action.column, level1Map.post1Action.row), true);
    assert.equal(isOnTile(14, 18, level1Map.post1Action), true);
});

test('the road from the pump to Pos 1 is fully walkable', () => {
    for (let column = level1Map.waterAction.column; column <= 6; column += 1) {
        assert.equal(isWalkable(column, level1Map.waterAction.row), true, `${column},24`);
    }

    for (let row = level1Map.waterAction.row; row >= level1Map.post1Action.row; row -= 1) {
        assert.equal(isWalkable(6, row), true, `6,${row}`);
    }

    for (let column = 6; column <= level1Map.post1Action.column; column += 1) {
        assert.equal(isWalkable(column, level1Map.post1Action.row), true, `${column},18`);
    }
});

test('Pos 2 and the route from Pos 1 are fully walkable', () => {
    assert.deepEqual(level1Map.post2Action, { column: 24, row: 11 });

    for (let row = 18; row <= 20; row += 1) {
        assert.equal(isWalkable(14, row), true, `14,${row}`);
    }

    for (let column = 14; column <= 20; column += 1) {
        assert.equal(isWalkable(column, 20), true, `${column},20`);
    }

    for (let row = 20; row >= 11; row -= 1) {
        assert.equal(isWalkable(20, row), true, `20,${row}`);
    }

    for (let column = 20; column <= level1Map.post2Action.column; column += 1) {
        assert.equal(isWalkable(column, level1Map.post2Action.row), true, `${column},11`);
    }
});
