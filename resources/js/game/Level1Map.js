const columns = 40;
const rows = 30;

// Collision tetap berupa grid sederhana, walaupun visual map memakai satu PNG.
// Setiap garis di bawah mengikuti pusat petak jalan coklat pada map 40 x 30.
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

// Loop kiri dan jalan menuju jembatan tengah.
addHorizontalRoad(13, 4, 9);
addVerticalRoad(4, 13, 18);
addVerticalRoad(9, 13, 18);
addHorizontalRoad(18, 4, 14);
addVerticalRoad(14, 18, 20);
addHorizontalRoad(20, 14, 20);
addVerticalRoad(20, 11, 20);

// Jalan lurus di bagian atas yang menghubungkan kedua jembatan.
addHorizontalRoad(11, 20, 34);

// Jembatan kanan dan jalan menuju bagian bawah map.
addVerticalRoad(34, 11, 24);
addHorizontalRoad(24, 34, 37);
addVerticalRoad(37, 24, 29);

// Cabang kiri bawah sampai ujung jalan dekat kendaraan pemadam.
addVerticalRoad(6, 18, 24);
addHorizontalRoad(24, 4, 6);
addVerticalRoad(4, 24, 27);
addHorizontalRoad(27, 4, 10);
addVerticalRoad(10, 26, 27);
addHorizontalRoad(26, 10, 13);

const terrain = Array.from({ length: rows }, (_, row) => (
    Array.from({ length: columns }, (_, column) => (
        walkableTiles.has(`${column},${row}`) ? 'p' : 'g'
    )).join('')
));

export const level1Map = {
    width: 1600,
    height: 1200,
    columns,
    rows,
    tileSize: 40,
    terrain,
    start: { column: 4, row: 27, direction: 'north' },
    pump: { column: 3, row: 24 },
    waterAction: { column: 4, row: 24 },
    fire: { column: 8, row: 26 },
    fireAction: { column: 8, row: 27 },
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
