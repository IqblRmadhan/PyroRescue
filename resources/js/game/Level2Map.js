// Petak 40 piksel mengikuti pusat jalan pada level2-map-v2.png (1600 x 1200).
const walkableTiles = new Set();
function road(column, row, endColumn, endRow) {
    for (let x = column; x <= endColumn; x += 1) {
        for (let y = row; y <= endRow; y += 1) walkableTiles.add(`${x},${y}`);
    }
}

road(0, 5, 17, 5);
road(17, 2, 17, 8);
road(17, 8, 19, 8);
road(17, 2, 30, 2);
road(30, 2, 30, 4);
road(30, 4, 34, 4);
road(34, 4, 34, 6);
road(34, 6, 38, 6);
road(38, 6, 38, 23);
road(26, 23, 38, 23);
road(26, 23, 26, 25);
road(24, 25, 26, 25);
road(24, 25, 24, 29);

export const level2Map = {
    width: 1600, height: 1200, tileSize: 40, columns: 40, rows: 30,
    start: { column: 0, row: 5, direction: 'east' },
    evaluationStart: { column: 38, row: 20, direction: 'south' },
    pump: { x: 620, y: 180, spriteOffsetX: -4, action: { column: 15, row: 5 }, capacity: 6 },
    evaluationPump: { x: 1480, y: 840, action: { column: 38, row: 20 }, capacity: 6 },
    finish: { column: 24, row: 29 },
    fires: {
        1: { x: 900, y: 475, size: 180, action: { column: 19, row: 8 }, direction: 'east' },
        2: {
            x: 1410, y: 205, size: 190, action: { column: 34, row: 4 },
            direction: 'north', label: { x: 1370, y: 50, placement: 'above' },
        },
        3: { x: 1450, y: 780, size: 225, action: { column: 38, row: 17 }, direction: 'west' },
        4: { x: 1100, y: 1220, size: 210, action: { column: 24, row: 25 }, direction: 'east' },
    },
};

export function isLevel2Walkable(column, row) {
    return walkableTiles.has(`${column},${row}`);
}

export function level2TileToWorld(column, row) {
    return { x: column * 40 + 20, y: row * 40 + 20 };
}
