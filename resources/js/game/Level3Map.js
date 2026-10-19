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
road(23, 18, 23, 26);

export const level3Map = {
    width: 1600, height: 1200, tileSize: 40, columns: 40, rows: 30,
    start: { column: 7, row: 18, direction: 'east' },
    evaluationStart: { column: 29, row: 6, direction: 'north' },
    // Level 3 memakai satu pompa di persimpangan tengah. Pompa dekat pos evakuasi dihapus.
    pump: { x: 900, y: 700, action: { column: 22, row: 18 }, capacity: 5 },
    evaluationPump: { x: 900, y: 700, action: { column: 22, row: 18 }, capacity: 5 },
    post: { column: 17, row: 13 },
    tower: { column: 23, row: 18 },
    crossing: { column: 24, row: 18 },
    northWatch: { column: 24, row: 12 },
    alternative: { column: 26, row: 12 },
    habitat: { column: 29, row: 5 },
    finish: { column: 34, row: 18 },
    fires: {
        1: { x: 1380, y: 495, size: 170, action: { column: 32, row: 12 }, direction: 'east' },
        2: { x: 1040, y: 1030, size: 170, action: { column: 23, row: 25 }, direction: 'east' },
        4: { x: 1250, y: 250, size: 150, action: { column: 29, row: 5 }, direction: 'east' },
    },
    bekantan: {
        1: { x: 1360, y: 530, size: 56 },
        2: { x: 1005, y: 1055, size: 56 },
        4: { x: 1205, y: 270, size: 56 },
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
