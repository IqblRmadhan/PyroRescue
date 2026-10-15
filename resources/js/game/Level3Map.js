// Grid 40 px mengikuti daratan dan jembatan pada map sementara (1600 x 1200).
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
road(19, 12, 32, 12);
road(17, 12, 19, 12);
road(24, 4, 24, 18);
road(32, 12, 32, 18);
road(14, 18, 14, 25);
road(14, 25, 23, 25);
road(23, 18, 23, 26);

export const level3Map = {
    width: 1600, height: 1200, tileSize: 40, columns: 40, rows: 30,
    start: { column: 3, row: 17, direction: 'east' },
    evaluationStart: { column: 23, row: 18, direction: 'south' },
    pump: { x: 300, y: 660, action: { column: 7, row: 17 }, capacity: 6 },
    evaluationPump: { x: 895, y: 715, action: { column: 23, row: 18 }, capacity: 6 },
    habitat: { column: 17, row: 14 },
    finish: { column: 23, row: 26 },
    fires: {
        1: { x: 620, y: 520, size: 170, action: { column: 17, row: 12 }, direction: 'west' },
        4: { x: 1040, y: 1030, size: 185, action: { column: 23, row: 25 }, direction: 'east' },
    },
    bekantan: {
        1: { x: 745, y: 605, size: 56 },
        4: { x: 875, y: 1055, size: 56 },
    },
};

export function isLevel3Walkable(column, row) {
    return walkableTiles.has(`${column},${row}`);
}

export function level3TileToWorld(column, row) {
    return { x: column * 40 + 20, y: row * 40 + 20 };
}
