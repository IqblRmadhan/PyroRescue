// Grid 40 px mengikuti daratan dan jembatan map Level 3 (1600 x 1200).
const walkableTiles = new Set();
function road(column, row, endColumn, endRow) {
    for (let x = column; x <= endColumn; x += 1) {
        for (let y = row; y <= endRow; y += 1) walkableTiles.add(`${x},${y}`);
    }
}

road(3, 17, 7, 17);
road(7, 17, 7, 18);
road(7, 18, 37, 18);
road(17, 4, 17, 18);
road(17, 4, 32, 4);
road(32, 0, 32, 4);
road(29, 4, 29, 6);
road(19, 12, 32, 12);
road(17, 12, 19, 12);
road(24, 4, 24, 18);
road(32, 12, 32, 18);
road(14, 18, 14, 25);
road(14, 25, 23, 25);
road(22, 24, 22, 24);
road(23, 18, 23, 26);

export const level3Map = {
    width: 1600, height: 1200, tileSize: 40, columns: 40, rows: 30,
    start: { column: 7, row: 18, direction: 'east' },
    evaluationStart: { column: 19, row: 4, direction: 'east' },
    // Level 3 memakai satu pompa di persimpangan tengah. Pompa dekat pos evakuasi dihapus.
    pump: { x: 900, y: 700, action: { column: 22, row: 18 }, capacity: 5 },
    evaluationPump: { x: 900, y: 700, action: { column: 22, row: 18 }, capacity: 5 },
    post: { column: 17, row: 13 },
    tower: { column: 23, row: 18 },
    crossing: { column: 24, row: 18 },
    northWatch: { column: 24, row: 12 },
    alternative: { column: 26, row: 12 },
    habitat: { column: 20, row: 4 },
    finish: { column: 34, row: 18 },
    fires: {
        1: { x: 1380, y: 495, size: 170, action: { column: 32, row: 12 }, direction: 'east' },
        2: { x: 960, y: 1070, size: 170, action: { column: 22, row: 24 }, direction: 'east', flipX: true },
        4: { x: 780, y: 245, size: 220, action: { column: 20, row: 4 }, direction: 'south', flipX: true },
    },
    bekantan: {
        1: { x: 1360, y: 530, size: 34, sheetSize: 29 },
        2: { x: 1005, y: 1055, size: 34, sheetSize: 29 },
        4: { x: 760, y: 285, size: 34, sheetSize: 29 },
    },
};

export function isLevel3Walkable(column, row) {
    return walkableTiles.has(`${column},${row}`);
}

export function level3TileToWorld(column, row) {
    return { x: column * 40 + 20, y: row * 40 + 20 };
}

export function level3WorldToTile(x, y) {
    return { column: Math.floor(x / level3Map.tileSize), row: Math.floor(y / level3Map.tileSize) };
}
