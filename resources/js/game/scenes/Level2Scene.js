import Phaser from 'phaser';
import { firefighterAnimations } from '../Level1Assets.js';
import { level2Assets } from '../Level2Assets.js';
import { isLevel2Walkable, level2Map, level2TileToWorld } from '../Level2Map.js';
import { enableMapCameraControls } from '../MapCameraControls.js';
import { addFireLabel, addPumpLabel } from '../PumpLabel.js';
import challenges, {
    getFirePresentation,
    isPlayerNearBurningFire,
} from '../Level2Challenges.js';

const playerScale = 0.245;
// Air sedikit tembus pandang agar bayangan tepi sungai di bawahnya tetap terlihat.
const waterLayerAlpha = 0.72;

export default class Level2Scene extends Phaser.Scene {
    constructor({
        assetBaseUrl,
        onReady,
        onLoadError,
        onStateChange = () => {},
        onAudio = () => {},
    }) {
        super('Level2Scene');
        this.assetBaseUrl = assetBaseUrl;
        this.onReady = onReady;
        this.onLoadError = onLoadError;
        this.onStateChange = onStateChange;
        this.onAudio = onAudio;
        this.challengeNumber = 1;
        this.sprays = 0;
        this.water = 0;
    }

    preload() {
        this.loadFailed = false;
        this.load.on('loaderror', () => {
            this.loadFailed = true;
            this.onLoadError();
        });
        for (const [key, asset] of Object.entries(level2Assets)) {
            this.load.image(key, `${this.assetBaseUrl}/${asset.file}`);
        }
        this.load.image('level2Map', `${this.assetBaseUrl}/maps/level2-map.png`);
        this.load.image('level2Shadow', `${this.assetBaseUrl}/maps/shadow_level2.png`);
    }

    create() {
        if (this.loadFailed) return;
        for (const [key, asset] of Object.entries(level2Assets)) {
            const texture = this.textures.get(key);
            for (const [name, bounds] of Object.entries(asset.frames)) {
                const frame = texture.add(name, 0, ...bounds);
                if (frame && asset.pivots?.[name]) {
                    frame.customPivot = true;
                    [frame.pivotX, frame.pivotY] = asset.pivots[name];
                }
            }
        }
        this.createAnimations();
        this.drawMap();
        this.drawMissionObjects();
        const camera = this.cameras.main;
        camera.setBounds(0, 0, level2Map.width, level2Map.height).setZoom(1.15).setRoundPixels(true);
        enableMapCameraControls(this, level2Map);
        this.resetChallenge(1).then(() => this.onReady());
    }

    createAnimations() {
        for (const [name, animation] of Object.entries(firefighterAnimations)) {
            const repeats = name.startsWith('walk') || name.startsWith('idle');
            this.anims.create({
                key: `level2-player-${name}`,
                frames: animation.frames.map((frame) => ({ key: animation.texture, frame })),
                frameRate: name.startsWith('walk') ? 9 : name.startsWith('idle') ? 6 : 12,
                repeat: repeats ? -1 : 0,
            });
        }
        for (const key of ['fireC1', 'fireC2', 'fireC3']) {
            this.anims.create({
                key: `${key}-burn`,
                frames: ['fire1', 'fire2', 'fire3', 'fire4'].map((frame) => ({ key, frame })),
                frameRate: 7, repeat: -1,
            });
        }
        this.anims.create({
            key: 'level2-marker',
            frames: ['pulse1', 'pulse2', 'pulse3', 'pulse4', 'pulse5', 'pulse6']
                .map((frame) => ({ key: 'actionMarker', frame })),
            frameRate: 8, repeat: -1,
        });
        this.anims.create({
            key: 'level2-pump-flow',
            frames: ['idle', 'start', 'stream', 'flow', 'slow', 'drop']
                .map((frame) => ({ key: 'waterPump', frame })),
            frameRate: 10, repeat: 0,
        });
    }

    drawMap() {
        // Geser bayangan sedikit agar tepiannya muncul di air, di bawah peta.
        this.add.image(24, 24, 'level2Shadow').setOrigin(0).setDepth(0);
        this.waterLayer = this.add.tileSprite(0, 0, 1600, 1200, 'waterTerrain', 'water')
            .setOrigin(0).setTileScale(0.45).setAlpha(waterLayerAlpha).setDepth(1);
        this.add.image(0, 0, 'level2Map').setOrigin(0).setDepth(2);
        const grid = this.add.graphics().setDepth(3).lineStyle(1, 0x17382d, 0.22);
        for (let x = 0; x <= 1600; x += 40) grid.lineBetween(x, 0, x, 1200);
        for (let y = 0; y <= 1200; y += 40) grid.lineBetween(0, y, 1600, y);
    }

    drawMissionObjects() {
        this.drawPumpStation();
        this.fires = {};
        this.fireLabels = {};
        this.fireMarkers = {};
        for (const [number, fire] of Object.entries(level2Map.fires)) {
            const texture = challenges[number].texture;
            this.fires[number] = this.add.sprite(fire.x, fire.y, texture, 'fire1')
                .setOrigin(0.5, 1).setDisplaySize(fire.size, fire.size).setDepth(5)
                .play(`${texture}-burn`);
            const label = fire.label ?? {
                x: fire.x,
                y: fire.y - fire.size - 4,
                placement: 'above',
            };
            this.fireLabels[number] = addFireLabel(
                this,
                label.x,
                label.y,
                '',
                label.placement,
            );

            const marker = level2TileToWorld(fire.action.column, fire.action.row);
            this.fireMarkers[number] = this.add.sprite(marker.x, marker.y, 'actionMarker', 'pulse1')
                .setDisplaySize(20, 20).setDepth(7).play('level2-marker');
        }
        const finish = level2TileToWorld(level2Map.finish.column, level2Map.finish.row);
        this.finishMarker = this.add.sprite(finish.x, finish.y, 'actionMarker', 'pulse1')
            .setDisplaySize(20, 20).setDepth(7).setVisible(false).play('level2-marker');
        this.playerShadow = this.add.ellipse(0, 0, 24, 6, 0x172b1b, 0.24).setDepth(8);
        this.player = this.add.sprite(0, 0, 'firefighterIdle', 'idle-east-1')
            .setOrigin(0.5, 0.9).setScale(playerScale).setDepth(9);
        this.finishSign = this.add.text(finish.x, finish.y - 35, 'FINISH', {
            fontFamily: 'monospace', fontSize: '16px', color: '#fff8df',
            backgroundColor: '#1b503e', padding: { x: 8, y: 6 },
        }).setOrigin(0.5, 1).setDepth(10).setVisible(false);
    }

    drawPumpStation() {
        const { x, y, spriteOffsetX = 0, action } = level2Map.pump;
        // Dua pohon di bawah jalan sudah ada pada PNG. Tutup hanya dua pohon
        // di atas jalan, lalu letakkan pompa di area rumput bekas pohon itu.
        const mapImage = this.textures.get('level2Map').getSourceImage();
        const drawGrassClearing = (key, left, top, width, height) => {
            const clearing = this.textures.createCanvas(key, width, height);
            const context = clearing.getContext();
            for (let row = 0; row < height; row += 68) {
                for (let column = 0; column < width; column += 50) {
                    context.drawImage(mapImage, 720, 115, 50, 68, column, row, 50, 68);
                }
            }
            const pixels = context.getImageData(0, 0, width, height);
            for (let row = 0; row < height; row++) {
                for (let column = 0; column < width; column++) {
                    const distance = Math.min(column, row, width - 1 - column, height - 1 - row);
                    pixels.data[(row * width + column) * 4 + 3] *= Math.min(1, distance / 8);
                }
            }
            context.putImageData(pixels, 0, 0);
            clearing.refresh();
            this.add.image(left, top, key).setOrigin(0).setDepth(2.5);
        };
        drawGrassClearing('level2UpperRoundTreeClearing', 541, 104, 92, 94);
        drawGrassClearing('level2UpperPineTreeClearing', 615, 86, 72, 112);

        // Jalan tetap memakai tekstur aslinya pada batas kedua area rumput.
        const road = this.textures.createCanvas('level2PumpRoadEdge', 150, 20);
        road.getContext().drawImage(mapImage, 540, 196, 150, 20, 0, 0, 150, 20);
        road.refresh();
        this.add.image(540, 196, 'level2PumpRoadEdge').setOrigin(0).setDepth(2.6);
        const roadSide = this.textures.createCanvas('level2PumpRoadSide', 16, 112);
        roadSide.getContext().drawImage(mapImage, 684, 86, 16, 112, 0, 0, 16, 112);
        roadSide.refresh();
        this.add.image(684, 86, 'level2PumpRoadSide').setOrigin(0).setDepth(2.6);

        this.pump = this.add.sprite(x + spriteOffsetX, y, 'waterPump', 'idle')
            .setOrigin(0.5, 0.9).setDisplaySize(52, 52).setDepth(7);
        this.pumpLabel = addPumpLabel(this, x, y);
        const marker = level2TileToWorld(action.column, action.row);
        this.pumpMarker = this.add.sprite(marker.x, marker.y, 'actionMarker', 'pulse1')
            .setDisplaySize(20, 20).setDepth(7).play('level2-marker');
    }

    update() {
        const zoom = this.cameras.main.zoom;
        this.pumpLabel?.setZoom(zoom);
        for (const label of Object.values(this.fireLabels ?? {})) label.setZoom(zoom);
        if (this.waterLayer) {
            this.waterLayer.tilePositionY += 0.08;
            this.waterLayer.tilePositionX += 0.02;
        }
    }

    setChallenge(challengeNumber) {
        this.challengeNumber = challengeNumber;
        this.requiredWater = challenges[challengeNumber].requiredWater;
        this.sprays = 0;
        this.pumpMarker.setAlpha(challengeNumber === 1 ? 1 : 0.55);
        this.updateFires();
        this.publishState();
    }

    updateFires() {
        for (const [number, sprite] of Object.entries(this.fires)) {
            const presentation = getFirePresentation(number, this.challengeNumber, this.sprays);
            if (presentation.completed) sprite.stop().setFrame('extinguished');
            else sprite.play(`${challenges[number].texture}-burn`, true);

            const label = this.fireLabels[number].setText(presentation.label);
            const marker = this.fireMarkers[number];
            if (presentation.completed) {
                label.setTheme('completed');
                marker.setVisible(false);
            } else {
                const isActive = Number(number) === this.challengeNumber;
                label.setTheme(isActive ? 'fire' : 'fireInactive');
                marker.setVisible(true).setAlpha(1).setDisplaySize(20, 20);
            }
        }
        const finishedFire = this.challengeNumber === 3 && this.sprays === this.requiredWater;
        this.finishMarker.setVisible(finishedFire);
        this.finishSign.setVisible(this.challengeNumber === 3).setAlpha(finishedFire ? 1 : 0.6);
    }

    isAt(target) {
        return this.playerColumn === target.column && this.playerRow === target.row;
    }

    publishState() {
        this.onStateChange({
            water: this.water,
            atPump: this.isAt(level2Map.pump.action),
            sprays: this.sprays,
            requiredWater: this.requiredWater,
            atFire: this.isAt(level2Map.fires[this.challengeNumber].action),
            fireOut: this.sprays === this.requiredWater,
            atFinish: this.isAt(level2Map.finish) && this.sprays === this.requiredWater,
            fireNearby: isPlayerNearBurningFire({
                column: this.playerColumn,
                row: this.playerRow,
                challengeNumber: this.challengeNumber,
                sprays: this.sprays,
            }),
        });
    }

    async runCommands(commands) {
        const requested = commands.filter((command) => command.type === 'spray').length;
        const remaining = this.requiredWater - this.sprays;
        if (requested > remaining) {
            return { status: 'error', missionSuccess: false, message: `Api ini membutuhkan ${remaining} semprotan lagi. Sesuaikan jumlah semprotan sebelum Run.` };
        }
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        for (const command of commands) {
            if (command.type === 'move') {
                if (!await this.move(command.direction)) {
                    return { status: 'error', missionSuccess: false, message: 'Petak di depan bukan jalan. Periksa urutan gerakanmu.' };
                }
            } else if (command.type === 'setWater') {
                if (!this.isAt(level2Map.pump.action)) {
                    return { status: 'error', missionSuccess: false, message: 'Berdirilah di penanda merah sebelah pompa sebelum menulis isi_air = 6.' };
                }
                await this.fillWater(command.amount);
            } else if (command.type === 'spray') {
                if (!this.isAt(level2Map.fires[this.challengeNumber].action)) {
                    return { status: 'error', missionSuccess: false, message: 'Berdirilah di penanda merah dekat api sebelum menjalankan semprot().' };
                }
                if (this.water === 0) {
                    return { status: 'error', missionSuccess: false, message: 'Tangki kosong. Kembali ke pompa, lalu tulis isi_air = 6 untuk mengambil pasokan air.' };
                }
                await this.spray();
            }
        }
        const fireOut = this.sprays === this.requiredWater;
        const missionSuccess = fireOut && (this.challengeNumber < 3 || this.isAt(level2Map.finish));
        return {
            status: missionSuccess ? 'success' : 'progress',
            missionSuccess,
            message: missionSuccess ? 'Berhasil! Api sudah padam dan target challenge terpenuhi.'
                : fireOut ? 'Semua api padam. Ikuti jalan ke petak FINISH untuk menyelesaikan Level 2.'
                    : `Api belum padam. Dilakukan: ${this.sprays}; dibutuhkan: ${this.requiredWater}. Datangi penanda lalu jalankan semprot().`,
        };
    }

    async fillWater(amount) {
        this.onAudio('pump');
        await new Promise((resolve) => {
            this.pump.once(Phaser.Animations.Events.ANIMATION_COMPLETE, resolve);
            this.pump.play('level2-pump-flow', true);
        });
        this.pump.stop().setFrame('idle');
        this.water = amount;
        this.onAudio('water');
        this.publishState();
    }

    async spray() {
        const fire = level2Map.fires[this.challengeNumber];
        const stream = this.add.graphics().setDepth(8);
        stream.lineStyle(5, 0x86deff, 0.85);
        stream.lineBetween(this.player.x, this.player.y - 22, fire.x, fire.y - fire.size * 0.4);
        this.onAudio('spray');
        await this.playPlayerAnimation(`spray-${fire.direction}`);
        stream.destroy();
        this.water -= 1;
        this.sprays += 1;
        if (this.sprays === this.requiredWater) this.onAudio('fireOut');
        this.updateFires();
        this.publishState();
        this.setPlayerIdle(fire.direction);
    }

    async move(direction) {
        const [dx, dy] = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] }[direction];
        const column = this.playerColumn + dx;
        const row = this.playerRow + dy;
        this.direction = direction;
        if (!isLevel2Walkable(column, row)) {
            this.onAudio('blocked');
            this.setPlayerIdle(direction);
            return false;
        }
        const target = level2TileToWorld(column, row);
        this.onAudio('step');
        this.player.play(`level2-player-walk-${direction}`, true).setOrigin(0.5, 0.9).setScale(playerScale);
        await new Promise((resolve) => this.tweens.add({
            targets: this.player, x: target.x, y: target.y, duration: 230, ease: 'Linear',
            onUpdate: () => this.syncPlayerShadow(), onComplete: resolve,
        }));
        this.playerColumn = column;
        this.playerRow = row;
        this.setPlayerIdle(direction);
        this.publishState();
        return true;
    }

    syncPlayerShadow() {
        this.playerShadow.setPosition(this.player.x, this.player.y + 4);
    }

    setPlayerIdle(direction) {
        this.direction = direction;
        this.player.play(`level2-player-idle-${direction}`, true).setOrigin(0.5, 0.9).setScale(playerScale);
        this.syncPlayerShadow();
    }

    playPlayerAnimation(name) {
        return new Promise((resolve) => {
            this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, resolve);
            this.player.play(`level2-player-${name}`, true).setOrigin(0.5, 0.9).setScale(playerScale);
        });
    }

    async resetChallenge(challengeNumber = this.challengeNumber, animateReset = false) {
        if (animateReset) await this.playPlayerAnimation('reset');
        const checkpoint = challengeNumber === 1 ? level2Map.start : level2Map.fires[challengeNumber - 1].action;
        this.playerColumn = checkpoint.column;
        this.playerRow = checkpoint.row;
        this.water = { 1: 0, 2: 4, 3: 1 }[challengeNumber] ?? 0;
        this.pump.stop().setFrame('idle');
        const position = level2TileToWorld(checkpoint.column, checkpoint.row);
        this.player.setPosition(position.x, position.y);
        this.syncPlayerShadow();
        this.setChallenge(challengeNumber);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09).centerOn(position.x, position.y);
        await this.playPlayerAnimation('spawn');
        this.setPlayerIdle('east');
    }
}
