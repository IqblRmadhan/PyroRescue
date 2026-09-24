// Area sprite pada PNG asli: [x, y, lebar, tinggi], dalam piksel.
const characterFrameCount = 6;
const walkFrameRegions = {
    'walk-south': [190, 260],
    'walk-east': [455, 260],
    'walk-north': [725, 260],
    'walk-west': [990, 260],
};
const idleFrameRegions = {
    'idle-south': [190, 260],
    'idle-east': [455, 260],
    'idle-north': [725, 260],
    'idle-west': [990, 260],
};
const sprayFrameRegions = {
    'spray-north': [0, 181],
    'spray-north-east': [181, 180],
    'spray-east': [361, 160],
    'spray-south-east': [520, 160],
    'spray-south': [680, 185],
    'spray-south-west': [865, 170],
    'spray-west': [1035, 145],
    'spray-north-west': [1180, 175],
};
const sprayFramePivots = {
    'spray-north': [
        [0.619, 0.972], [0.547, 0.972], [0.478, 0.972],
        [0.412, 0.972], [0.401, 0.972], [0.392, 0.972],
    ],
    'spray-north-east': [
        [0.608, 0.85], [0.575, 0.85], [0.459, 0.85],
        [0.395, 0.85], [0.395, 0.85], [0.403, 0.85],
    ],
    'spray-east': [
        [0.514, 0.85], [0.445, 0.85], [0.508, 0.85],
        [0.37, 0.85], [0.445, 0.85], [0.362, 0.85],
    ],
    'spray-south-east': [
        [0.55, 0.85], [0.503, 0.856], [0.461, 0.856],
        [0.409, 0.85], [0.403, 0.85], [0.395, 0.85],
    ],
    'spray-south': [
        [0.572, 0.611], [0.522, 0.622], [0.464, 0.627],
        [0.414, 0.622], [0.387, 0.622], [0.392, 0.622],
    ],
    'spray-south-west': [
        [0.555, 0.759], [0.486, 0.765], [0.456, 0.753],
        [0.412, 0.765], [0.401, 0.765], [0.367, 0.765],
    ],
    'spray-west': [
        [0.63, 0.897], [0.569, 0.897], [0.525, 0.897],
        [0.464, 0.89], [0.436, 0.883], [0.428, 0.869],
    ],
    'spray-north-west': [
        [0.624, 0.937], [0.561, 0.937], [0.503, 0.937],
        [0.5, 0.943], [0.481, 0.943], [0.459, 0.949],
    ],
};
const respawnFrameRegions = {
    reset: [180, 310],
    spawn: [540, 340],
};

function createFrames(frameRegions, frameWidth = 181) {
    const frames = {};

    for (const [animation, [top, height]] of Object.entries(frameRegions)) {
        for (let column = 0; column < characterFrameCount; column += 1) {
            frames[`${animation}-${column + 1}`] = [
                column * frameWidth,
                top,
                frameWidth,
                height,
            ];
        }
    }

    return frames;
}

function animationFrameNames(animation, reverse = false) {
    const frames = Array.from(
        { length: characterFrameCount },
        (_, index) => `${animation}-${index + 1}`,
    );

    return reverse ? frames.reverse() : frames;
}

function createFramePivots(animationPivots) {
    return Object.fromEntries(Object.entries(animationPivots).flatMap(([animation, pivots]) => (
        pivots.map((pivot, index) => [`${animation}-${index + 1}`, pivot])
    )));
}

function createGridFrames(imageWidth, imageHeight, rowNames, columnCount = 6) {
    const frames = {};

    for (let row = 0; row < rowNames.length; row += 1) {
        const top = Math.round(row * imageHeight / rowNames.length);
        const bottom = Math.round((row + 1) * imageHeight / rowNames.length);

        for (let column = 0; column < columnCount; column += 1) {
            const left = Math.round(column * imageWidth / columnCount);
            const right = Math.round((column + 1) * imageWidth / columnCount);
            frames[`${rowNames[row]}-${column + 1}`] = [
                left,
                top,
                right - left,
                bottom - top,
            ];
        }
    }

    return frames;
}

export const firefighterAnimations = {
    ...Object.fromEntries(Object.keys(walkFrameRegions).map((animation) => [
        animation,
        { texture: 'firefighterWalk', frames: animationFrameNames(animation) },
    ])),
    ...Object.fromEntries(Object.keys(idleFrameRegions).map((animation) => [
        animation,
        { texture: 'firefighterIdle', frames: animationFrameNames(animation) },
    ])),
    ...Object.fromEntries(Object.keys(sprayFrameRegions).map((animation) => [
        animation,
        { texture: 'firefighterSpray', frames: animationFrameNames(animation) },
    ])),
    reset: {
        texture: 'firefighterRespawn',
        frames: animationFrameNames('reset', true),
    },
    spawn: {
        texture: 'firefighterRespawn',
        frames: animationFrameNames('spawn'),
    },
};

export const npcAnimations = {
    'post1-idle': {
        texture: 'npcPost1',
        frames: animationFrameNames('idle'),
        frameRate: 4,
        repeat: -1,
    },
    'post1-give-water': {
        texture: 'npcPost1',
        frames: animationFrameNames('give-water'),
        frameRate: 7,
        repeat: 0,
    },
    'post2-idle': {
        texture: 'npcPost2',
        frames: animationFrameNames('idle'),
        frameRate: 4,
        repeat: -1,
    },
    'post2-receive-water': {
        texture: 'npcPost2',
        frames: animationFrameNames('receive-water'),
        frameRate: 7,
        repeat: 0,
    },
};

export const level1Assets = {
    groundTerrain: {
        file: 'tiles/ground.png',
        frames: {
            grass: [60, 70, 140, 140],
            dirt: [60, 270, 140, 140],
        },
    },
    waterTerrain: {
        file: 'tiles/water.png',
        frames: {
            water: [65, 75, 155, 150],
        },
    },
    firefighterWalk: {
        file: 'characters/firefighter-walk.png',
        frames: createFrames(walkFrameRegions),
    },
    firefighterIdle: {
        file: 'characters/firefighter-idle.png',
        frames: createFrames(idleFrameRegions),
    },
    firefighterSpray: {
        file: 'characters/firefighter-spray.png',
        frames: createFrames(sprayFrameRegions),
        pivots: createFramePivots(sprayFramePivots),
    },
    firefighterRespawn: {
        file: 'characters/firefighter-respawn.png',
        frames: createFrames(respawnFrameRegions, 256),
    },
    npcPost1: {
        file: 'characters/npc-post1.png',
        frames: createGridFrames(2172, 724, ['idle', 'give-water']),
    },
    npcPost2: {
        file: 'characters/npc-post2.png',
        frames: createGridFrames(1774, 887, ['idle', 'receive-water']),
    },
    actionMarker: {
        file: 'effects/action-marker.png',
        frames: {
            pulse1: [58, 249, 246, 246],
            pulse2: [420, 249, 246, 246],
            pulse3: [782, 249, 246, 246],
            pulse4: [1144, 249, 246, 246],
            pulse5: [1506, 249, 246, 246],
            pulse6: [1868, 249, 246, 246],
        },
    },
    burningTree: {
        file: 'objects/burning-tree.png',
        frames: {
            healthy: [0, 0, 40, 40],
            small1: [40, 0, 40, 40],
            small2: [80, 0, 40, 40],
            small3: [120, 0, 40, 40],
            medium1: [0, 40, 40, 40],
            medium2: [40, 40, 40, 40],
            medium3: [80, 40, 40, 40],
            medium4: [120, 40, 40, 40],
            large1: [0, 80, 40, 40],
            large2: [40, 80, 40, 40],
            large3: [80, 80, 40, 40],
            large4: [120, 80, 40, 40],
        },
    },
    waterPump: {
        file: 'objects/water-pump.png',
        frames: {
            idle: [0, 0, 80, 80],
            start: [80, 0, 80, 80],
            stream: [160, 0, 80, 80],
            flow: [0, 80, 80, 80],
            slow: [80, 80, 80, 80],
            drop: [160, 80, 80, 80],
        },
    },
};

export const burningTreeFramesByWater = {
    1: ['small1', 'small2', 'small3'],
    2: ['medium1', 'medium2', 'medium3', 'medium4'],
    3: ['large1', 'large2', 'large3', 'large4'],
};

// Simpan map final 1600 x 1200 pada lokasi ini.
export const level1MapImage = 'maps/level1-map.png';
export const level1MapShadowImage = 'maps/shadow_level1.png';
