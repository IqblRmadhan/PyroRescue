// Peta Level 1 berhenti setelah jalur dari Pos 2 menuju petak FINISH.
const columns = 40;
const rows = 30;

// Collision tetap berupa grid sederhana, walaupun visual map memakai satu PNG.
// Setiap garis di bawah mengikuti pusat petak jalan coklat pada map baru 40 x 30.
const walkableTiles = new Set();

function addHorizontalRoad(row, startColumn, endColumn) {
    for (let column = startColumn; column <= endColumn; column += 1) {
        walkableTiles.add(`${column},${row}`);
    }
}

function addVerticalRoad(column, startRow, endRow) {
    for (let row = startRow; row <= endRow; row += 1) {
        walkableTiles.add(`${column},${row}`);
    }
}

// Jalan dari pompa menuju Pos 1 dan jembatan tengah.
addHorizontalRoad(18, 6, 14);
addVerticalRoad(14, 18, 20);
addHorizontalRoad(20, 14, 20);
addVerticalRoad(20, 11, 20);

// Jalan setelah Pos 2 berakhir di petak FINISH.
addHorizontalRoad(11, 20, 39);

// Cabang kiri bawah sampai ujung jalan dekat kendaraan pemadam.
addVerticalRoad(6, 18, 24);
addHorizontalRoad(24, 4, 6);
addVerticalRoad(4, 24, 27);

const terrain = Array.from({ length: rows }, (_, row) => (
    Array.from({ length: columns }, (_, column) => (
        walkableTiles.has(`${column},${row}`) ? 'p' : 'g'
    )).join('')
));

export const level1Map = {
    width: columns * 40,
    height: 1200,
    columns,
    rows,
    tileSize: 40,
    terrain,
    start: { column: 4, row: 27, direction: 'north' },
    pump: { column: 3, row: 24 },
    waterAction: { column: 4, row: 24 },
    post1Action: { column: 14, row: 19 },
    post1Npc: { column: 16, row: 19 },
    post1Sign: { x: 700, y: 635 },
    post2Action: { column: 24, row: 11 },
    post2Npc: { column: 26, row: 10 },
    post2Sign: { x: 980, y: 280 },
    finish: { column: 39, row: 11 },
};

export function getTerrain(column, row) {
    return level1Map.terrain[row]?.[column] ?? '~';
}

export function isWalkable(column, row) {
    return walkableTiles.has(`${column},${row}`);
}

export function isNextTo(column, row, target) {
    return Math.abs(column - target.column) + Math.abs(row - target.row) === 1;
}

export function isWithinOneTile(column, row, target) {
    const columnDistance = Math.abs(column - target.column);
    const rowDistance = Math.abs(row - target.row);

    return Math.max(columnDistance, rowDistance) === 1;
}

export function isOnTile(column, row, target) {
    return column === target.column && row === target.row;
}

export function tileToWorld(column, row) {
    const halfTile = level1Map.tileSize / 2;

    return {
        x: column * level1Map.tileSize + halfTile,
        y: row * level1Map.tileSize + halfTile,
    };
}
