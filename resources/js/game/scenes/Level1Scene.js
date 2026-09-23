import Phaser from 'phaser';
import {
    firefighterAnimations,
    level1Assets,
    level1MapImage,
    level1MapShadowImage,
} from '../Level1Assets.js';
import { getTerrain, isOnTile, isWalkable, level1Map, tileToWorld } from '../Level1Map.js';

const cameraZoom = 1.15;
const waterLayerAlpha = 0.84;
const playerScale = 0.245;
const playerShadowOffsetY = 4;
const pumpDisplaySize = 52;
const actionMarkerDisplaySize = 20;
const pumpCyclePause = 100;

export default class Level1Scene extends Phaser.Scene {
    constructor({ assetBaseUrl, onReady, onLoadError, onStateChange = () => {} }) {
        super('Level1Scene');
        this.challengeNumber = 1;
        this.requiredWater = 3;
        this.postWater = 0;
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
        this.resetChallenge(1).then(() => this.onReady());
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

        this.actionMarker = this.add.sprite(
            waterActionPosition.x,
            waterActionPosition.y,
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

    setChallenge(challengeNumber) {
        this.challengeNumber = challengeNumber;
        this.requiredWater = challengeNumber === 1 ? 3 : 5;
        const targets = {
            1: level1Map.waterAction,
            2: level1Map.post1Action,
            3: level1Map.post2Action,
        };
        const target = targets[challengeNumber] ?? targets[1];
        const markerPosition = tileToWorld(target.column, target.row);

        this.actionMarker.setPosition(markerPosition.x, markerPosition.y);
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
                const result = this.challengeNumber === 1
                    ? await this.fillWater(command.amount)
                    : this.challengeNumber === 2
                        ? await this.updateWaterAtPost(command.amount)
                        : { success: false, message: 'Challenge 3 hanya menggunakan air_pos_2 = isi_air.' };
                if (!result.success) {
                    return { missionSuccess: false, message: result.message };
                }
                continue;
            }

            if (command.type === 'transferWater') {
                const result = await this.transferWaterToPost();
                if (!result.success) {
                    return { missionSuccess: false, message: result.message };
                }
            }
        }

        if (this.challengeNumber === 1 && this.water === this.requiredWater) {
            return {
                missionSuccess: true,
                message: `Berhasil! Variabel isi_air sekarang menyimpan nilai ${this.water}.`,
            };
        }

        if (this.challengeNumber === 2 && this.water === this.requiredWater) {
            return {
                missionSuccess: true,
                message: `Berhasil! 3 unit bawaan ditambah 2 unit bantuan menjadi ${this.water} unit di isi_air.`,
            };
        }

        if (this.challengeNumber === 3 && this.postWater === this.requiredWater) {
            return {
                missionSuccess: true,
                message: `Berhasil! Penjaga Pos 2 menerima ${this.postWater} unit air.`,
            };
        }

        return {
            missionSuccess: false,
            message: this.getIncompleteChallengeMessage(),
        };
    }

    getIncompleteChallengeMessage() {
        if (this.challengeNumber === 1) {
            return `Tangki berisi ${this.water} unit. Isi isi_air dengan tepat ${this.requiredWater} unit di pompa.`;
        }

        if (this.challengeNumber === 2) {
            if (isOnTile(this.playerColumn, this.playerRow, level1Map.post1Action)) {
                return `Kamu tiba di Pos 1. Penjaga memberikan 2 unit bantuan untuk Pos 2; tulis isi_air = ${this.requiredWater}.`;
            }

            return `Bawa ${this.water} unit air ke Pos 1. Penjaga menyiapkan 2 unit tambahan untuk Pos 2.`;
        }

        return 'Pergi ke Pos 2 dan berikan seluruh persediaan dengan air_pos_2 = isi_air.';
    }

    async fillWater(amount) {
        if (!isOnTile(this.playerColumn, this.playerRow, level1Map.waterAction)) {
            return {
                success: false,
                message: 'Untuk mengisi isi_air, berdirilah tepat di penanda merah dekat pompa.',
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

    async updateWaterAtPost(amount) {
        if (!isOnTile(this.playerColumn, this.playerRow, level1Map.post1Action)) {
            return {
                success: false,
                message: 'Pergi ke penanda merah di Pos 1 sebelum mengubah isi_air.',
            };
        }

        if (this.water < amount) {
            for (let total = this.water + 1; total <= amount; total += 1) {
                await this.wait(250);
                this.setWater(total);
            }
        } else {
            await this.wait(250);
            this.setWater(amount);
        }

        return { success: true };
    }

    async transferWaterToPost() {
        if (!isOnTile(this.playerColumn, this.playerRow, level1Map.post2Action)) {
            return {
                success: false,
                message: 'Pergi ke penanda merah di Pos 2 sebelum memberikan air.',
            };
        }

        if (this.water !== this.requiredWater) {
            return {
                success: false,
                message: `Pos 2 membutuhkan ${this.requiredWater} unit dari isi_air.`,
            };
        }

        await this.wait(350);
        this.postWater = this.water;
        this.water = 0;
        this.publishState();

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

    publishState() {
        this.onStateChange({
            water: this.water ?? 0,
            postWater: this.postWater ?? 0,
            requiredWater: this.requiredWater,
            challengeNumber: this.challengeNumber,
            atPump: isOnTile(this.playerColumn, this.playerRow, level1Map.waterAction),
            atPost1: isOnTile(this.playerColumn, this.playerRow, level1Map.post1Action),
            atPost2: isOnTile(this.playerColumn, this.playerRow, level1Map.post2Action),
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

    async resetChallenge(challengeNumber = this.challengeNumber, animateReset = false) {
        this.tweens.killTweensOf(this.player);

        if (animateReset) {
            await this.playPlayerAnimation('player-reset');
        }

        const checkpoints = {
            1: { ...level1Map.start, water: 0 },
            2: { ...level1Map.waterAction, direction: 'north', water: 3 },
            3: { ...level1Map.post1Action, direction: 'east', water: 5 },
        };
        const checkpoint = checkpoints[challengeNumber] ?? checkpoints[1];
        const checkpointPosition = tileToWorld(checkpoint.column, checkpoint.row);
        this.playerColumn = checkpoint.column;
        this.playerRow = checkpoint.row;
        this.direction = checkpoint.direction;
        this.player.setPosition(checkpointPosition.x, checkpointPosition.y)
            .stop().setTexture('firefighterIdle', `idle-${this.direction}-1`).setScale(playerScale);
        this.syncPlayerShadow();
        this.water = checkpoint.water;
        this.postWater = 0;
        this.setChallenge(challengeNumber);
        this.pump.stop().setFrame('idle');
        this.cameras.main.centerOn(checkpointPosition.x, checkpointPosition.y);
        await this.playPlayerAnimation('player-spawn');
        this.setPlayerIdle(this.direction);
    }
}
