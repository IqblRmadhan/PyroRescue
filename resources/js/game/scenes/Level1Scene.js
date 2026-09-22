import Phaser from 'phaser';
import {
    burningTreeFramesByWater,
    firefighterAnimations,
    level1Assets,
    level1MapImage,
    level1MapShadowImage,
} from '../Level1Assets.js';
import { getTerrain, isOnTile, isWalkable, level1Map, tileToWorld } from '../Level1Map.js';

const cameraZoom = 1.15;
const waterLayerAlpha = 0.84;
const playerScale = 0.245;
const playerSprayScale = 0.42;
const playerShadowOffsetY = 4;
const pumpDisplaySize = 52;
const actionMarkerDisplaySize = 20;
const pumpCyclePause = 100;
const sprayCyclePause = 300;

export default class Level1Scene extends Phaser.Scene {
    constructor({ assetBaseUrl, onReady, onLoadError, onStateChange = () => {} }) {
        super('Level1Scene');
        this.requiredWater = 3;
        this.assetBaseUrl = assetBaseUrl;
        this.onReady = onReady;
        this.onLoadError = onLoadError;
        this.onStateChange = onStateChange;
    }

    preload() {
        this.mapLoadFailed = false;
        this.load.on('loaderror', (file) => {
            if (file.key === 'levelMap') {
                this.mapLoadFailed = true;
                return;
            }

            this.onLoadError();
        });

        for (const [key, asset] of Object.entries(level1Assets)) {
            this.load.image(key, `${this.assetBaseUrl}/${asset.file}`);
        }

        this.load.image('levelMap', `${this.assetBaseUrl}/${level1MapImage}`);
        this.load.image('levelMapShadow', `${this.assetBaseUrl}/${level1MapShadowImage}`);
    }

    create() {
        if (Object.keys(level1Assets).some((key) => !this.textures.exists(key))) {
            return;
        }

        for (const [key, asset] of Object.entries(level1Assets)) {
            const texture = this.textures.get(key);

            for (const [name, bounds] of Object.entries(asset.frames)) {
                const frame = texture.add(name, 0, ...bounds);
                const pivot = asset.pivots?.[name];

                if (frame && pivot) {
                    frame.customPivot = true;
                    [frame.pivotX, frame.pivotY] = pivot;
                }
            }
        }

        this.createAnimations();
        this.drawTerrain();
        this.drawGrid();
        this.drawMissionObjects();
        this.configureCamera();
        this.resetMission();
        this.onReady();
    }

    update() {
        if (this.waterLayer) {
            this.waterLayer.tilePositionY += 0.08;
            this.waterLayer.tilePositionX += 0.02;
        }
    }

    drawTerrain() {
        this.add.image(0, 0, 'levelMapShadow')
            .setOrigin(0)
            .setDisplaySize(level1Map.width, level1Map.height)
            .setDepth(0);

        this.waterLayer = this.add.tileSprite(
            0,
            0,
            level1Map.width,
            level1Map.height,
            'waterTerrain',
            'water',
        ).setOrigin(0).setTileScale(0.45).setAlpha(waterLayerAlpha).setDepth(1);

        if (this.textures.exists('levelMap')) {
            const mapTexture = this.createMapWithTransparentWater();
            this.add.image(0, 0, mapTexture).setOrigin(0).setDepth(2);
            return;
        }

        this.drawFallbackTerrain();
    }

    createMapWithTransparentWater() {
        const textureKey = 'levelMapWithWaterCutout';

        if (this.textures.exists(textureKey)) {
            return textureKey;
        }

        const sourceImage = this.textures.get('levelMap').getSourceImage();
        const canvasTexture = this.textures.createCanvas(textureKey, level1Map.width, level1Map.height);
        const context = canvasTexture.getContext();
        context.drawImage(sourceImage, 0, 0, level1Map.width, level1Map.height);

        const imageData = context.getImageData(0, 0, level1Map.width, level1Map.height);
        const pixels = imageData.data;

        for (let index = 0; index < pixels.length; index += 4) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const darkestChannel = Math.min(red, green, blue);
            const channelSpread = Math.max(red, green, blue) - darkestChannel;

            if (darkestChannel >= 248 && channelSpread <= 7) {
                pixels[index + 3] = 0;
            } else if (darkestChannel >= 232 && channelSpread <= 12) {
                pixels[index + 3] = Math.round(255 * ((248 - darkestChannel) / 16));
            }
        }

        context.putImageData(imageData, 0, 0);
        canvasTexture.refresh();

        return textureKey;
    }

    drawFallbackTerrain() {
        this.add.rectangle(0, 0, level1Map.width, level1Map.height, 0x6f9f55)
            .setOrigin(0).setDepth(2);

        const pathMaskShape = this.make.graphics({ add: false });
        pathMaskShape.fillStyle(0xffffff);
        this.drawTerrainCells(pathMaskShape, (terrain) => terrain === 'p');

        const pathLayer = this.add.tileSprite(
            0,
            0,
            level1Map.width,
            level1Map.height,
            'groundTerrain',
            'dirt',
        ).setOrigin(0).setTileScale(0.38).setDepth(3);
        pathLayer.setMask(pathMaskShape.createGeometryMask());
    }

    drawTerrainCells(graphics, matchesTerrain, overlap = 0) {
        for (let row = 0; row < level1Map.rows; row += 1) {
            for (let column = 0; column < level1Map.columns; column += 1) {
                if (!matchesTerrain(getTerrain(column, row))) {
                    continue;
                }

                graphics.fillRect(
                    column * level1Map.tileSize - overlap,
                    row * level1Map.tileSize - overlap,
                    level1Map.tileSize + overlap * 2,
                    level1Map.tileSize + overlap * 2,
                );
            }
        }
    }

    createAnimations() {
        for (const [animation, definition] of Object.entries(firefighterAnimations)) {
            const key = `player-${animation}`;
            const isWalking = animation.startsWith('walk');
            const isIdle = animation.startsWith('idle');

            if (!this.anims.exists(key)) {
                this.anims.create({
                    key,
                    frames: definition.frames.map((frame) => ({
                        key: definition.texture,
                        frame,
                    })),
                    frameRate: isWalking ? 9 : isIdle ? 6 : 12,
                    repeat: isWalking || isIdle ? -1 : 0,
                });
            }
        }

        for (const [water, frames] of Object.entries(burningTreeFramesByWater)) {
            const key = `tree-fire-${water}`;

            if (!this.anims.exists(key)) {
                this.anims.create({
                    key,
                    frames: frames.map((frame) => ({ key: 'burningTree', frame })),
                    frameRate: 5,
                    repeat: -1,
                });
            }
        }

        if (!this.anims.exists('pump-flow')) {
            this.anims.create({
                key: 'pump-flow',
                frames: ['idle', 'start', 'stream', 'flow', 'slow', 'drop']
                    .map((frame) => ({ key: 'waterPump', frame })),
                frameRate: 10,
                repeat: 0,
            });
        }

        if (!this.anims.exists('action-marker-pulse')) {
            this.anims.create({
                key: 'action-marker-pulse',
                frames: ['pulse1', 'pulse2', 'pulse3', 'pulse4', 'pulse5', 'pulse6']
                    .map((frame) => ({ key: 'actionMarker', frame })),
                frameRate: 8,
                repeat: -1,
            });
        }
    }

    drawGrid() {
        const grid = this.add.graphics().setDepth(5);
        grid.lineStyle(1, 0x17382d, 0.22);

        for (let x = 0; x <= level1Map.width; x += level1Map.tileSize) {
            grid.lineBetween(x, 0, x, level1Map.height);
        }

        for (let y = 0; y <= level1Map.height; y += level1Map.tileSize) {
            grid.lineBetween(0, y, level1Map.width, y);
        }
    }

    drawMissionObjects() {
        const playerPosition = tileToWorld(level1Map.start.column, level1Map.start.row);
        const pumpPosition = tileToWorld(level1Map.pump.column, level1Map.pump.row);
        const waterActionPosition = tileToWorld(
            level1Map.waterAction.column,
            level1Map.waterAction.row,
        );
        const firePosition = tileToWorld(level1Map.fire.column, level1Map.fire.row);
        const fireActionPosition = tileToWorld(
            level1Map.fireAction.column,
            level1Map.fireAction.row,
        );

        this.waterActionMarker = this.add.sprite(
            waterActionPosition.x,
            waterActionPosition.y,
            'actionMarker',
            'pulse1',
        ).setDisplaySize(actionMarkerDisplaySize, actionMarkerDisplaySize).setDepth(6)
            .play('action-marker-pulse');
        this.fireActionMarker = this.add.sprite(
            fireActionPosition.x,
            fireActionPosition.y,
            'actionMarker',
            'pulse1',
        ).setDisplaySize(actionMarkerDisplaySize, actionMarkerDisplaySize).setDepth(6)
            .play('action-marker-pulse');
        this.pump = this.add.sprite(pumpPosition.x, pumpPosition.y, 'waterPump', 'idle')
            .setOrigin(0.5, 0.9)
            .setDisplaySize(pumpDisplaySize, pumpDisplaySize)
            .setDepth(7);
        this.playerShadow = this.add.ellipse(
            playerPosition.x,
            playerPosition.y + playerShadowOffsetY,
            24,
            6,
            0x172b1b,
            0.24,
        ).setDepth(9);
        this.player = this.add.sprite(playerPosition.x, playerPosition.y, 'firefighterIdle', 'idle-north-1')
            .setOrigin(0.5, 0.9).setScale(playerScale).setDepth(10);
        this.burningTree = this.add.sprite(firePosition.x, firePosition.y + 18, 'burningTree', 'healthy')
            .setOrigin(0.5, 0.8).setDisplaySize(64, 64).setDepth(7);
    }

    configureCamera() {
        const camera = this.cameras.main;
        camera.setBounds(0, 0, level1Map.width, level1Map.height);
        camera.setZoom(cameraZoom);
        camera.setRoundPixels(true);
        camera.startFollow(this.player, true, 0.09, 0.09);
        camera.centerOn(this.player.x, this.player.y);
    }

    setWater(amount) {
        this.water = amount;
        this.publishState();
    }

    async runCommands(commands) {
        this.setPlayerIdle(this.direction);

        for (const command of commands) {
            if (command.type === 'move') {
                const moved = await this.move(command.direction);
                if (!moved) {
                    return { missionSuccess: false, message: 'Petak di depan bukan jalan tanah. Periksa sequence gerakanmu.' };
                }
                continue;
            }

            if (command.type === 'setWater') {
                const result = await this.fillWater(command.amount);
                if (!result.success) {
                    return { missionSuccess: false, message: result.message };
                }
                continue;
            }

            if (command.type === 'spray') {
                const result = await this.spray(this.water);
                if (!result.missionSuccess) {
                    return result;
                }
            }
        }

        if (!commands.some((command) => command.type === 'spray')) {
            return { missionSuccess: false, message: `Air tersedia ${this.water}. Lanjutkan sequence menuju pohon terbakar.` };
        }

        return { missionSuccess: this.fireExtinguished, message: 'Api berhasil dipadamkan! Sequence dan variabelmu bekerja.' };
    }

    async fillWater(amount) {
        if (!isOnTile(this.playerColumn, this.playerRow, level1Map.waterAction)) {
            if (amount === this.water) {
                return { success: true };
            }

            return {
                success: false,
                message: 'Untuk mengubah jumlah_air, berdirilah di penanda pompa. Gunakan nilai yang sama dengan stok HUD jika ingin memakai air yang sudah dibawa.',
            };
        }

        const previousDirection = this.direction;
        const pumpDirection = this.getDirectionTo(level1Map.pump);
        this.setPlayerIdle(pumpDirection);
        this.setWater(0);

        for (let cycle = 1; cycle <= amount; cycle += 1) {
            await this.playPumpCycle();
            this.setWater(cycle);

            if (cycle < amount) {
                await this.wait(pumpCyclePause);
            }
        }

        this.setPlayerIdle(previousDirection);

        return { success: true };
    }

    playPumpCycle() {
        return new Promise((resolve) => {
            this.pump.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.pump.stop().setFrame('idle');
                resolve();
            });
            this.pump.play('pump-flow', true);
        });
    }

    async move(direction) {
        const movement = {
            north: [0, -1],
            east: [1, 0],
            south: [0, 1],
            west: [-1, 0],
        }[direction];
        const targetColumn = this.playerColumn + movement[0];
        const targetRow = this.playerRow + movement[1];

        this.direction = direction;
        this.player.play(`player-walk-${direction}`, true)
            .setOrigin(0.5, 0.9)
            .setScale(playerScale);

        if (!isWalkable(targetColumn, targetRow)) {
            this.setPlayerIdle(direction);
            return false;
        }

        const targetPosition = tileToWorld(targetColumn, targetRow);
        this.playerColumn = targetColumn;
        this.playerRow = targetRow;

        await new Promise((resolve) => {
            this.tweens.add({
                targets: this.player,
                x: targetPosition.x,
                y: targetPosition.y,
                duration: 230,
                ease: 'Linear',
                onUpdate: () => this.syncPlayerShadow(),
                onComplete: () => {
                    this.setPlayerIdle(direction);
                    resolve();
                },
            });
        });
        this.publishState();
        return true;
    }

    async spray(amount) {
        if (!isOnTile(this.playerColumn, this.playerRow, level1Map.fireAction)) {
            return {
                missionSuccess: false,
                message: 'Berdirilah tepat di atas penanda merah dekat api sebelum menyemprot.',
            };
        }

        if (amount < 1) {
            return {
                missionSuccess: false,
                message: 'Tangki air kosong. Ambil air di penanda dekat pompa terlebih dahulu.',
            };
        }

        const sprayDirection = this.getDirectionTo(level1Map.fire);
        const sprayAmount = Math.min(amount, this.currentFireLevel);
        this.direction = sprayDirection;

        for (let cycle = 1; cycle <= sprayAmount; cycle += 1) {
            await this.playSprayCycle(sprayDirection);
            this.setWater(this.water - 1);
            this.currentFireLevel -= 1;
            this.updateFireLevel();

            if (cycle < sprayAmount) {
                await this.wait(sprayCyclePause);
            }
        }

        this.setPlayerIdle(sprayDirection);
        this.fireExtinguished = this.currentFireLevel === 0;

        if (this.fireExtinguished) {
            return { missionSuccess: true, message: 'Api berhasil dipadamkan! Sequence dan variabelmu bekerja.' };
        }

        const fireSizes = { 1: 'kecil', 2: 'sedang', 3: 'besar' };
        return {
            missionSuccess: false,
            message: `Api berubah menjadi ${fireSizes[this.currentFireLevel]}. Masih perlu ${this.currentFireLevel} unit air.`,
        };
    }

    playSprayCycle(direction) {
        return new Promise((resolve) => {
            this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, resolve);
            this.player.play(`player-spray-${direction}`, true)
                .setScale(playerSprayScale);
        });
    }

    updateFireLevel() {
        if (this.currentFireLevel === 0) {
            this.burningTree.stop().setFrame('healthy');
            this.fireExtinguished = true;
            this.publishState();
            return;
        }

        this.burningTree.play(`tree-fire-${this.currentFireLevel}`);
        this.publishState();
    }

    publishState() {
        this.onStateChange({
            water: this.water ?? 0,
            requiredWater: this.requiredWater,
            atFire: isOnTile(this.playerColumn, this.playerRow, level1Map.fireAction),
            fireExtinguished: this.fireExtinguished ?? false,
        });
    }

    getDirectionTo(target) {
        const horizontal = target.column < this.playerColumn
            ? 'west'
            : target.column > this.playerColumn ? 'east' : '';
        const vertical = target.row < this.playerRow
            ? 'north'
            : target.row > this.playerRow ? 'south' : '';

        if (vertical && horizontal) {
            return `${vertical}-${horizontal}`;
        }

        return vertical || horizontal;
    }

    setPlayerIdle(direction) {
        const walkDirection = direction.includes('-')
            ? direction.split('-')[1]
            : direction;
        this.player
            .play(`player-idle-${walkDirection}`, true)
            .setOrigin(0.5, 0.9)
            .setScale(playerScale);
        this.syncPlayerShadow();
    }

    syncPlayerShadow() {
        this.playerShadow.setPosition(
            this.player.x,
            this.player.y + playerShadowOffsetY,
        );
    }

    wait(duration) {
        return new Promise((resolve) => this.time.delayedCall(duration, resolve));
    }

    playPlayerAnimation(key) {
        return new Promise((resolve) => {
            this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, resolve);
            this.player.play(key, true)
                .setOrigin(0.5, 0.9)
                .setScale(playerScale);
        });
    }

    async resetMission(animateReset = false) {
        this.tweens.killTweensOf(this.player);

        if (animateReset) {
            await this.playPlayerAnimation('player-reset');
        }

        const startPosition = tileToWorld(level1Map.start.column, level1Map.start.row);
        this.playerColumn = level1Map.start.column;
        this.playerRow = level1Map.start.row;
        this.direction = level1Map.start.direction;
        this.player.setPosition(startPosition.x, startPosition.y)
            .stop().setTexture('firefighterIdle', `idle-${this.direction}-1`).setScale(playerScale);
        this.syncPlayerShadow();
        this.setWater(0);
        this.currentFireLevel = this.requiredWater;
        this.fireExtinguished = false;
        this.updateFireLevel();
        this.pump.stop().setFrame('idle');
        this.cameras.main.centerOn(startPosition.x, startPosition.y);
        await this.playPlayerAnimation('player-spawn');
        this.setPlayerIdle(this.direction);
    }
}
