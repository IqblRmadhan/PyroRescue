import { level1Map } from './Level1Map.js';

// Tekstur kecil dibuat sekali, lalu dipakai ulang oleh semua awan dan asap.
function createTexture(scene, key, width, height, puffs) {
    if (scene.textures.exists(key)) return;

    const texture = scene.textures.createCanvas(key, width, height);
    const context = texture.getContext();

    for (const [x, y, radius] of puffs) {
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.55)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    texture.refresh();
}

function createCloudTexture(scene) {
    if (scene.textures.exists('level1-cloud')) return;

    const texture = scene.textures.createCanvas('level1-cloud', 224, 96);
    const context = texture.getContext();
    const rows = [
        [8, 88, 136], [16, 64, 152], [24, 48, 176], [32, 32, 192],
        [40, 16, 208], [48, 8, 216], [56, 16, 208], [64, 32, 200],
        [72, 48, 184], [80, 72, 160],
    ];

    context.fillStyle = '#d8e8e9';
    for (const [y, left, right] of rows) {
        context.fillRect(left, y, right - left, 8);
    }

    context.fillStyle = '#fffdf2';
    for (const [y, left, right] of rows.slice(0, 7)) {
        context.fillRect(left + 8, y, right - left - 24, 8);
    }

    texture.refresh();
}

export function createLevel1Atmosphere(scene) {
    createCloudTexture(scene);
    createTexture(scene, 'level1-smoke', 64, 64, [[32, 32, 31]]);

    const clouds = [
        [330, 720, 1.05], [530, 825, 1.2], [610, 1035, 0.95],
        [1050, 690, 1.15], [1370, 390, 1.05], [440, 230, 1.2],
        [1250, 990, 1.1],
    ].map(([x, y, scale], index) => ({
        image: scene.add.image(x, y, 'level1-cloud').setScale(scale).setAlpha(0.48).setDepth(13),
        shadow: scene.add.image(x + 38, y + 52, 'level1-cloud')
            .setScale(scale).setTint(0x24444b).setAlpha(0.12).setDepth(4),
        speed: 18 + index * 1.5,
        baseY: y,
        phase: index,
    }));

    // Dua sumber di lahan terbakar; satu kepulan kecil dari kendaraan pemadam.
    const sources = [
        { x: 1250, y: 292, rise: 125, drift: 38, scale: 1.3, alpha: 0.21 },
        { x: 1380, y: 345, rise: 145, drift: 44, scale: 1.5, alpha: 0.18 },
        { x: 83, y: 1045, rise: 70, drift: -25, scale: 0.65, alpha: 0.26 },
    ];
    const smoke = sources.flatMap((source) => (
        Array.from({ length: 5 }, (_, index) => ({
            image: scene.add.image(source.x, source.y, 'level1-smoke')
                .setTint(0xaeb6b3).setAlpha(0).setDepth(12),
            source,
            age: index / 5,
        }))
    ));
    let elapsed = 0;

    // Scene mengelola umur sprite; tidak ada timer DOM atau objek yang terus bertambah.
    function update(delta) {
        const seconds = Math.min(delta, 100) / 1000;
        elapsed += seconds;

        for (const cloud of clouds) {
            cloud.image.x += cloud.speed * seconds;
            if (cloud.image.x > level1Map.width + 150) cloud.image.x = -150;
            cloud.image.y = cloud.baseY + Math.sin(elapsed * 0.55 + cloud.phase) * 7;
            cloud.shadow.setPosition(cloud.image.x + 38, cloud.image.y + 52);
        }

        for (const puff of smoke) {
            puff.age = (puff.age + seconds / 7) % 1;
            const { source, age } = puff;
            puff.image.setPosition(
                source.x + source.drift * age + Math.sin(age * Math.PI * 2) * 5,
                source.y - source.rise * age,
            );
            puff.image.setScale(source.scale * (0.2 + age));
            puff.image.setAlpha(Math.sin(age * Math.PI) * source.alpha);
        }
    }

    update(0);
    return { update };
}
