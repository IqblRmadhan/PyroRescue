import Phaser from 'phaser';
import { firefighterAnimations } from '../Level1Assets.js';
import {
    addLevel2MapShadow,
    level2Assets,
    level2MapImage,
    level2MapShadowImage,
} from '../Level2Assets.js';
import {
    getLevel2FinishVisual,
    isLevel2Walkable,
    level2Map,
    level2TileToWorld,
} from '../Level2Map.js';
import { enableMapCameraControls } from '../MapCameraControls.js';
import { addFinishTile } from '../FinishPoint.js';
import { getChallengeMarkerStyle, getMarkerTexture, showChallengeMarker } from '../MapMarkers.js';
import { addFireLabel, addPumpLabel } from '../PumpLabel.js';
import challenges, {
    getFirePresentation,
    getPumpAnimationCycleCount,
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
        this.load.image('level2Map', `${this.assetBaseUrl}/${level2MapImage}`);
        this.load.image('level2Shadow', `${this.assetBaseUrl}/${level2MapShadowImage}`);
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
        for (const key of ['fireC1', 'fireC2', 'fireC3', 'fireEval']) {
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
            key: 'level2-pump-marker',
            frames: ['pulse1', 'pulse2', 'pulse3', 'pulse4', 'pulse5', 'pulse6']
                .map((frame) => ({ key: 'waterPumpAction', frame })),
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
        addLevel2MapShadow(this, level2Map.width, level2Map.height);
        this.waterLayer = this.add.tileSprite(0, 0, 1600, 1200, 'waterTerrain', 'water')
            .setOrigin(0).setTileScale(0.45).setAlpha(waterLayerAlpha).setDepth(1);
        this.add.image(0, 0, 'level2Map').setOrigin(0).setDepth(2);
        const grid = this.add.graphics().setDepth(3).lineStyle(1, 0x17382d, 0.22);
        for (let x = 0; x <= 1600; x += 40) grid.lineBetween(x, 0, x, 1200);
        for (let y = 0; y <= 1200; y += 40) grid.lineBetween(0, y, 1600, y);
    }

    drawMissionObjects() {
        this.drawPumpStation();
        this.drawEvaluationPump();
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
            this.fireMarkers[number] = this.add.sprite(marker.x, marker.y, getMarkerTexture('fire'), 'pulse1')
                .setDisplaySize(24, 24).setDepth(7).play('level2-marker');
        }
        const finishTile = getLevel2FinishVisual(level2Map).tile;
        const finish = level2TileToWorld(finishTile.column, finishTile.row);
        this.playerShadow = this.add.ellipse(0, 0, 24, 6, 0x172b1b, 0.24).setDepth(8);
        this.player = this.add.sprite(0, 0, 'firefighterIdle', 'idle-east-1')
            .setOrigin(0.5, 0.9).setScale(playerScale).setDepth(9);
        this.finishTile = addFinishTile(this, finish.x, finish.y).setAlpha(0.7);
    }

    drawPumpStation() {
        const { x, y, spriteOffsetX = 0, action } = level2Map.pump;
        this.pump = this.add.sprite(x + spriteOffsetX, y, 'waterPump', 'idle')
            .setOrigin(0.5, 0.9).setDisplaySize(52, 52).setDepth(7);
        this.pumpLabel = addPumpLabel(this, x, y);
        const marker = level2TileToWorld(action.column, action.row);
        const markerSize = getChallengeMarkerStyle(1, 1, 'pump').size;
        this.pumpMarker = this.add.sprite(marker.x, marker.y, getMarkerTexture('pump'), 'pulse1')
            .setDisplaySize(markerSize, markerSize).setDepth(7).play('level2-pump-marker');
    }

    drawEvaluationPump() {
        const { x, y, action } = level2Map.evaluationPump;
        this.evaluationPump = this.add.sprite(x, y, 'waterPump', 'idle')
            .setOrigin(0.5, 0.9).setDisplaySize(52, 52).setDepth(7);
        this.evaluationPumpLabel = addPumpLabel(this, x, y);
        const marker = level2TileToWorld(action.column, action.row);
        const markerSize = getChallengeMarkerStyle(4, 1, 'pump').size;
        this.evaluationPumpMarker = this.add.sprite(marker.x, marker.y, getMarkerTexture('pump'), 'pulse1')
            .setDisplaySize(markerSize, markerSize).setDepth(7).play('level2-pump-marker');
    }

    update() {
        const zoom = this.cameras.main.zoom;
        this.pumpLabel?.setZoom(zoom);
        this.evaluationPumpLabel?.setZoom(zoom);
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
        showChallengeMarker(this.pumpMarker, null, 1, challengeNumber, 'pump');
        showChallengeMarker(this.evaluationPumpMarker, null, 4, challengeNumber, 'pump');
        this.updateFires();
        this.publishState();
    }

    updateFires() {
        for (const [number, sprite] of Object.entries(this.fires)) {
            const presentation = getFirePresentation(number, this.challengeNumber, this.sprays);
            if (presentation.completed) sprite.stop().setFrame('extinguished');
            else sprite.play(`${challenges[number].texture}-burn`, true);

            const label = this.fireLabels[number].setText(presentation.label);
            label.container.setVisible(true);
            const marker = this.fireMarkers[number];
            if (presentation.completed) {
                label.setTheme('completed');
            } else {
                const isActive = Number(number) === this.challengeNumber;
                label.setTheme(isActive ? 'fire' : 'fireInactive');
            }
            showChallengeMarker(marker, null, Number(number), this.challengeNumber);
        }
        const finishedFire = this.challengeNumber === 4 && this.sprays === this.requiredWater;
        this.finishTile.setAlpha(finishedFire ? 1 : this.challengeNumber === 4 ? 0.9 : 0.7);
    }

    isAt(target) {
        return this.playerColumn === target.column && this.playerRow === target.row;
    }

    publishState() {
        this.onStateChange({
            water: this.water,
            atPump: this.isAt((this.challengeNumber === 4 ? level2Map.evaluationPump : level2Map.pump).action),
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
            return { status: 'error', missionSuccess: false, message: this.challengeNumber === 4
                ? 'Jumlah semprotan melebihi kebutuhan api evaluasi.'
                : `Api ini membutuhkan ${remaining} semprotan lagi. Sesuaikan jumlah semprotan sebelum Run.` };
        }
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        for (const command of commands) {
            if (command.type === 'move') {
                if (!await this.move(command.direction)) {
                    return { status: 'error', missionSuccess: false, message: 'Petak di depan bukan jalan. Periksa urutan gerakanmu.' };
                }
            } else if (command.type === 'setWater') {
                const pump = this.challengeNumber === 4 ? level2Map.evaluationPump : level2Map.pump;
                if (!this.isAt(pump.action)) {
                    return { status: 'error', missionSuccess: false, message: 'Berdirilah tepat di petak bertanda merah di samping pompa.' };
                }
                await this.fillWater(command.amount, this.challengeNumber === 4 ? this.evaluationPump : this.pump);
            } else if (command.type === 'spray') {
                if (!this.isAt(level2Map.fires[this.challengeNumber].action)) {
                    return { status: 'error', missionSuccess: false, message: 'Berdirilah di penanda merah dekat api sebelum menjalankan semprot().' };
                }
                if (this.water === 0) {
                    return { status: 'error', missionSuccess: false, message: 'Tangki kosong. Ambil air di pompa sebelum menyemprot.' };
                }
                await this.spray();
            }
        }
        const fireOut = this.sprays === this.requiredWater;
        const missionSuccess = fireOut && (this.challengeNumber < 4 || this.isAt(level2Map.finish));
        return {
            status: missionSuccess ? 'success' : 'progress',
            missionSuccess,
            message: missionSuccess ? 'Berhasil! Api sudah padam dan target challenge terpenuhi.'
                : fireOut ? 'Semua api padam. Ikuti jalan ke petak FINISH untuk menyelesaikan Level 2.'
                    : this.challengeNumber === 4 ? 'Api evaluasi belum padam.'
                    : `Api belum padam. Dilakukan: ${this.sprays}; dibutuhkan: ${this.requiredWater}. Datangi penanda lalu jalankan semprot().`,
        };
    }

    async fillWater(amount, pump = this.pump) {
        const cycleCount = getPumpAnimationCycleCount(amount);
        if (cycleCount > 0) this.onAudio('pump');
        for (let cycle = 0; cycle < cycleCount; cycle += 1) {
            await new Promise((resolve) => {
                pump.once(Phaser.Animations.Events.ANIMATION_COMPLETE, resolve);
                pump.play('level2-pump-flow');
            });
            pump.stop().setFrame('idle');
        }
        this.water = amount;
        if (cycleCount > 0) this.onAudio('water');
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
            this.player.play(`level2-player-${name}`, true).setOrigin(0.5, 0.9);
            // Frame semprot 145–185 px; idle/jalan 260 px. Samakan tinggi tampilannya.
            const scale = name.startsWith('spray-')
                ? playerScale * 260 / this.player.frame.height : playerScale;
            this.player.setScale(scale);
        });
    }

    async resetChallenge(challengeNumber = this.challengeNumber, animateReset = false) {
        if (animateReset) await this.playPlayerAnimation('reset');
        let checkpoint = level2Map.start;
        if (challengeNumber === 4) checkpoint = level2Map.evaluationStart;
        else if (challengeNumber > 1) checkpoint = level2Map.fires[challengeNumber - 1].action;
        this.playerColumn = checkpoint.column;
        this.playerRow = checkpoint.row;
        this.water = { 1: 0, 2: 4, 3: 3, 4: 0 }[challengeNumber] ?? 0;
        this.pump.stop().setFrame('idle');
        this.evaluationPump.stop().setFrame('idle');
        const position = level2TileToWorld(checkpoint.column, checkpoint.row);
        this.player.setPosition(position.x, position.y);
        this.syncPlayerShadow();
        this.setChallenge(challengeNumber);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09).centerOn(position.x, position.y);
        await this.playPlayerAnimation('spawn');
        this.setPlayerIdle(checkpoint.direction ?? 'east');
    }
}
