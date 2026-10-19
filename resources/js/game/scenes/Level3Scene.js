import Level2Scene from './Level2Scene.js';
import { level3Assets, level3MapImage, level3MapShadowImage } from '../Level3Assets.js';
import { level3Map, isLevel3Walkable, level3TileToWorld, level3WorldToTile } from '../Level3Map.js';
import challenges from '../Level3Challenges.js';
import { Level3Mission } from '../Level3Mission.js';
import { executeLevel3Program, validateLevel3Behavior, getLevel3Features } from '../Level3Validator.js';
import { addFireLabel } from '../PumpLabel.js';

export default class Level3Scene extends Level2Scene {
    constructor(options) {
        super(options, {
            sceneKey: 'Level3Scene', map: level3Map, challenges,
            assets: level3Assets, mapImage: level3MapImage,
            mapShadowImage: level3MapShadowImage, isWalkable: isLevel3Walkable,
            worldToTile: level3WorldToTile, debugIsWalkable: isLevel3Walkable,
        });
        this.mission = new Level3Mission();
        this.allowFogPass = false;
        this.isWalkable = (column, row) => isLevel3Walkable(column, row)
            && (this.allowFogPass || !this.isRouteFogTile(column, row) || !this.isRouteFogLocked());
        this.onCheckpoint = options.onCheckpoint ?? (() => {});
        this.onBranch = options.onBranch ?? (() => {});
        this.onDebugTeleport = options.onDebugTeleport ?? (() => {});
        this.savedCheckpoint = options.savedCheckpoint;
    }

    createAnimations() {
        super.createAnimations();
        for (const state of ['worried', 'rescued']) this.anims.create({
            key: `bekantan-${state}`,
            frames: [1, 2, 3, 4, 5].map(number => ({ key: 'bekantan', frame: `${state}${number}` })),
            frameRate: 4, repeat: -1,
        });
    }

    // Level 3 hanya memiliki pompa di persimpangan tengah.
    drawPumpStation() {}

    drawEvaluationPump() {
        super.drawEvaluationPump();
        this.pump = this.evaluationPump;
        this.pumpLabel = this.evaluationPumpLabel;
        this.pumpMarker = this.evaluationPumpMarker;
    }

    teleportForTesting(column, row) {
        this.tweens.killTweensOf(this.player);
        const position = level3TileToWorld(column, row);
        this.playerColumn = column;
        this.playerRow = row;
        this.mission.column = column;
        this.mission.row = row;
        this.player.setPosition(position.x, position.y);
        this.setPlayerIdle(this.direction ?? 'east');
        this.checkArrival();
        this.updateFires();
        this.publishState();
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09).centerOn(position.x, position.y);
    }

    drawMissionObjects() {
        super.drawMissionObjects();
        this.bekantanSprites = {};
        for (const [number, animal] of Object.entries(this.map.bekantan)) {
            this.bekantanSprites[number] = this.add.sprite(animal.x, animal.y, 'bekantan', 'worried1')
                .setOrigin(0.5, 1).setScale(animal.size / 400).setDepth(10).play('bekantan-worried');
        }
        this.objectiveMarker = this.add.sprite(0, 0, 'actionMarker', 'pulse1')
            .setDisplaySize(28, 28).setDepth(7).play('level2-marker');
        const crossing = level3TileToWorld(this.map.crossing.column, this.map.crossing.row);
        this.routeMarker = this.add.sprite(crossing.x, crossing.y, 'actionMarker', 'pulse1')
            .setDisplaySize(24, 24).setDepth(7).play('level2-marker');
        this.createRouteFog();
        this.postLabel = addFireLabel(this, 610, 420, 'POS EVAKUASI', 'above');
    }

    createRouteFog() {
        const pixels = [
            [-32, -58, 24, 0xdce8e4, .58], [-8, -62, 20, 0xb9ceca, .48], [16, -54, 28, 0xe8efeb, .65],
            [-46, -36, 20, 0xaec5c2, .5], [-22, -34, 32, 0xd2dfdc, .62], [10, -30, 24, 0xf0f4ef, .68], [36, -38, 20, 0xb7cbc8, .5],
            [-38, -8, 28, 0xe4ece8, .62], [-8, -6, 28, 0xb8cdca, .54], [22, -10, 32, 0xd9e4e0, .66],
            [-48, 18, 20, 0xb1c7c4, .48], [-26, 22, 28, 0xe9efeb, .68], [4, 18, 24, 0xc2d4d0, .56], [30, 16, 28, 0xe1eae6, .62],
            [-34, 46, 24, 0xd3e0dc, .58], [-8, 50, 32, 0xadc4c1, .5], [24, 44, 24, 0xedf2ee, .68], [44, 52, 16, 0xb9ceca, .48],
        ];
        const blocks = pixels.map(([offsetX, offsetY, size, color, alpha], index) => {
            const block = this.add.rectangle(980 + offsetX, 660 + offsetY, size, size, color, alpha)
                .setOrigin(0.5).setDepth(11);
            block.fogBaseX = block.x;
            block.fogBaseAlpha = alpha;
            block.fogGroup = index % 3;
            return block;
        });
        this.routeFog = this.add.container(0, 0, blocks).setDepth(11);
        let phase = 0;
        this.routeFogTimer = this.time.addEvent({
            delay: 320,
            loop: true,
            callback: () => {
                phase = (phase + 1) % 3;
                for (const block of blocks) {
                    const active = block.fogGroup === phase;
                    block.x = block.fogBaseX + (active ? 8 : 0);
                    block.setAlpha(Math.min(.78, block.fogBaseAlpha + (active ? .1 : 0)));
                }
            },
        });
    }

    isRouteFogTile(column, row) {
        return column === this.map.crossing.column && row >= 15 && row <= 17;
    }

    isRouteFogLocked() {
        return this.mission?.challenge === 1 && this.mission.step <= 2;
    }

    update() {
        super.update();
        this.postLabel?.setZoom(this.cameras.main.zoom);
        this.routeFog?.setVisible(this.isRouteFogLocked());
        const following = this.mission.following;
        if (following && this.player) {
            this.bekantanSprites[following]?.setPosition(this.player.x - 24, this.player.y + 8);
        }
    }

    get activeStep() { return challenges[this.challengeNumber].steps[this.mission.step]; }

    setChallenge(challengeNumber) {
        if (this.mission.challenge !== challengeNumber) {
            const { attempts, hintsUsed } = this.mission;
            this.mission = new Level3Mission(challengeNumber);
            Object.assign(this.mission, { attempts, hintsUsed, column: this.playerColumn, row: this.playerRow });
            this.mission.saveCheckpoint();
            this.onCheckpoint(this.mission.checkpoint);
        }
        this.challengeNumber = challengeNumber;
        this.requiredWater = this.mission.requiredWater;
        this.water = this.mission.water;
        this.sprays = this.mission.sprays[this.mission.fireNumber];
        this.updateFires();
        this.publishState();
    }

    updateFires() {
        if (!this.fires) return;
        const m = this.mission;
        for (const [number, sprite] of Object.entries(this.fires)) {
            const completed = m.sprays[number] >= challenges[number].requiredWater;
            if (completed) sprite.stop().setFrame('extinguished');
            else sprite.play(`${challenges[number].texture}-burn`, true);
            this.fireLabels[number].setText(completed ? `API ${number === '4' ? 3 : number} • PADAM`
                : `API ${number === '4' ? 3 : number} • ${challenges[number].requiredWater - m.sprays[number]}×`)
                .setTheme(completed ? 'completed' : Number(number) === m.fireNumber ? 'fire' : 'fireInactive');
            this.fireMarkers[number].setVisible(!completed)
                .setAlpha(Number(number) === m.fireNumber ? 1 : 0.55);
        }
        for (const [number, sprite] of Object.entries(this.bekantanSprites ?? {})) {
            const delivered = m.rescued.includes(Number(number));
            const following = m.following === Number(number);
            sprite.play(delivered || following ? 'bekantan-rescued' : 'bekantan-worried', true);
            const home = this.map.bekantan[number];
            if (!following) sprite.setPosition(delivered ? 600 + Number(number) * 17 : home.x, delivered ? 530 : home.y);
        }
        const target = this.activeStep?.target;
        if (target) {
            for (const [number, fire] of Object.entries(this.map.fires)) {
                if (fire.action.column === target.column && fire.action.row === target.row) {
                    this.fireMarkers[number].setVisible(false);
                }
            }
            const isPump = target.column === this.map.pump.action.column && target.row === this.map.pump.action.row;
            const isCrossing = target.column === this.map.crossing.column && target.row === this.map.crossing.row;
            const point = level3TileToWorld(target.column, target.row);
            this.objectiveMarker.setPosition(point.x, point.y).setVisible(!isPump && !isCrossing);
        } else {
            this.objectiveMarker?.setVisible(false);
        }
        this.pumpMarker?.setVisible(true).setAlpha(1);
        this.routeMarker?.setVisible(m.challenge === 1 && m.step <= 2);
        this.routeFog?.setVisible(this.isRouteFogLocked());
        this.finishTile?.setAlpha(m.canFinish() ? 1 : 0.35);
    }

    publishState() {
        const m = this.mission;
        // Renderer pompa memperbarui air satu unit setiap siklus.
        m.water = this.water;
        m.column = this.playerColumn ?? m.column;
        m.row = this.playerRow ?? m.row;
        const definition = challenges[m.challenge];
        const world = m.world;
        this.onStateChange({
            water: m.water, sprays: m.sprays[m.fireNumber], requiredWater: m.requiredWater,
            atPump: this.isAt(this.map.pump.action) || this.isAt(this.map.evaluationPump.action),
            atFire: this.isAt(this.map.fires[m.fireNumber].action), atFinish: this.isAt(this.map.finish),
            fireOut: world.api_padam, apiPadam: world.api_padam, routeSafe: m.routeSafe,
            animalTrapped: world.hewan_terjebak, rescuedCount: m.rescued.length,
            extinguishedCount: [1, 2, 4].filter(n => m.sprays[n] === challenges[n].requiredWater).length,
            bekantanStatus: m.following ? 'mengikuti' : m.rescued.includes(m.fireNumber) ? 'di pos' : 'terjebak',
            step: m.step, totalSteps: definition.steps.length,
            hud: this.activeStep?.hud ?? [],
            instruction: this.activeStep?.instruction ?? 'Challenge selesai. Lanjutkan operasi berikutnya.',
            atObjective: this.activeStep ? this.isAt(this.activeStep.target) : false,
            fireNearby: Object.entries(this.map.fires).some(([n, fire]) => m.sprays[n] < challenges[n].requiredWater
                && Math.abs(m.column - fire.action.column) <= 2 && Math.abs(m.row - fire.action.row) <= 2),
        });
    }

    markChallengeComplete() {
        this.objectiveMarker.setVisible(false);
    }

    // Satu-satunya pintu perpindahan submisi: state checkpoint diambil setelah aksi nyata selesai.
    completeStep() {
        this.mission.step += 1;
        if (this.challengeNumber === 3 && this.mission.step === 3) this.mission.routeSafe = true;
        this.publishState();
        if (this.activeStep) {
            this.mission.saveCheckpoint();
            this.onCheckpoint(this.mission.checkpoint);
        }
        this.updateFires();
        this.onAudio('target');
    }

    checkArrival() {
        const m = this.mission;
        const c = m.challenge, s = m.step;
        if (this.isAt(this.map.post) && m.following) m.deliver();
        const arrival = (c === 1 && s === 0) || (c === 2 && s === 0)
            || (c === 3 && [0, 2, 5].includes(s)) || (c === 4 && [0, 3].includes(s));
        const delivery = ((c === 1 || c === 2) && s === 5) || (c === 4 && s === 2);
        if (this.activeStep && this.isAt(this.activeStep.target)
            && ((arrival && (c !== 4 || s !== 3 || m.canFinish()))
                || (delivery && m.rescued.includes(m.fireNumber)))) this.completeStep();
    }

    async runCommands(commands, onCommandComplete = () => {}) {
        this.cameras.main.panEffect.reset();
        const m = this.mission;
        const stage = this.activeStep;
        if (!stage) return { status: 'success', missionSuccess: true, message: 'Challenge selesai.' };
        const features = getLevel3Features(commands);
        // Gerakan bebas dapat membawa pemain ke target. Program keputusan diuji sebelum mengubah map.
        const decision = features.hasIf;
        if (decision) {
            if (!stage.behavior) return this.commandError('Selesaikan tujuan submisi yang sedang aktif terlebih dahulu.');
            if (!this.isAt(stage.target)) return this.commandError('Datangi penanda submisi sebelum menjalankan keputusan.');
            const behavior = validateLevel3Behavior(commands, stage.behavior);
            if (!behavior.valid) return this.commandError(behavior.message);
            if (stage.behavior === 'water' && !features.hasLoop) return this.commandError('Gunakan for untuk mengulang semprotan di dalam pemeriksaan air.');
        }
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        const world = { ...m.world, sisa_api: m.requiredWater - m.sprays[m.fireNumber] };
        const startStep = m.step;
        this.allowFogPass = decision && stage.behavior === 'route';
        try {
            await executeLevel3Program(commands, world, async command => {
                if (command.type === 'branch') {
                    this.onBranch(command);
                    await new Promise(resolve => this.time.delayedCall(140, resolve));
                } else if (command.type === 'move') {
                    if (m.challenge === 3 && m.step <= 2 && this.isAt(this.map.northWatch) && command.direction === 'north') {
                        throw new Error('Jalur utara berbahaya. Periksa jalur_aman dan gunakan jalur alternatif.');
                    }
                    if (!await this.move(command.direction)) {
                        const error = new Error('Petak di depan bukan jalur yang dapat dilalui. Ikuti daratan dan jembatan.');
                        error.collision = true;
                        throw error;
                    }
                } else if (command.type === 'setWater') {
                    const pump = this.isAt(this.map.pump.action) ? this.pump
                        : this.isAt(this.map.evaluationPump.action) ? this.evaluationPump : null;
                    if (!pump) throw new Error('Pengisian air hanya boleh dilakukan di penanda pompa.');
                    if (!((m.challenge === 1 && m.step === 1) || (m.challenge === 2 && m.step === 2)
                        || (m.challenge === 3 && m.step === 4))) throw new Error('Ikuti urutan submisi sebelum mengisi air kembali.');
                    await this.fillWater(command.amount, pump);
                    m.water = this.water;
                } else if (command.type === 'spray') {
                    const allowed = (m.challenge === 1 && m.step === 3 && features.hasLoop)
                        || (m.challenge === 2 && m.step === 3 && decision)
                        || (m.challenge === 4 && m.step === 1 && decision);
                    if (!allowed) throw new Error('Pemadaman harus mengikuti submisi dan menggunakan perulangan serta pemeriksaan yang diminta.');
                    if (!this.isAt(this.map.fires[m.fireNumber].action)) throw new Error('Berdiri di penanda api aktif sebelum menyemprot.');
                    if (m.water < 1) throw new Error('Air tidak cukup. Gunakan Ulangi untuk kembali ke checkpoint submisi.');
                    if (m.world.api_padam) throw new Error('Api sudah padam. Hindari semprotan berlebih.');
                    await this.spray();
                } else if (command.type === 'rescue') {
                    if (!decision || !['rescue', 'nested', 'evaluation'].includes(stage.behavior)) throw new Error('Periksa kondisi satwa dan api dengan percabangan yang sesuai.');
                    if (!this.isAt(this.map.fires[m.fireNumber].action) || !m.world.api_padam || !m.routeSafe) throw new Error('Penyelamatan belum aman. Periksa api, akses, dan posisi pemain.');
                    m.following = m.fireNumber;
                    this.onAudio('target');
                } else if (command.type === 'patrol') {
                    if (m.world.hewan_terjebak) throw new Error('Masih ada bekantan terjebak. Periksa kondisi sebelum melanjutkan patroli.');
                }
                Object.assign(world, m.world, { sisa_api: m.requiredWater - m.sprays[m.fireNumber] });
                this.updateFires();
                this.publishState();
                onCommandComplete(command);
            });
            if (decision && stage.behavior === 'evaluation') m.evaluationPassed = true;
            // Setiap Run menyelesaikan paling banyak satu keputusan; marker kedatangan boleh berantai.
            if (decision || (m.challenge === 1 && startStep === 1 && m.water === 4)
                || (m.challenge === 2 && startStep === 2 && m.water === 5)
                || (m.challenge === 3 && startStep === 4 && m.water === 5)
                || (m.challenge === 1 && startStep === 3 && m.world.api_padam)) this.completeStep();
            this.checkArrival();
            this.updateFires();
            this.publishState();
            const missionSuccess = m.step === challenges[m.challenge].steps.length;
            return { status: missionSuccess ? 'success' : 'progress', missionSuccess,
                reachedFinish: missionSuccess && m.challenge === 4,
                message: missionSuccess ? m.challenge === 4
                    ? 'Tiga api padam, tiga bekantan tiba di pos, dan evaluasi lulus. PyroRescue selesai!'
                    : `Challenge ${m.challenge} selesai. Checkpoint tersimpan.` : this.activeStep.instruction };
        } catch (error) { return this.commandError(error.message, error.collision); }
        finally {
            this.allowFogPass = false;
            this.onBranch(null);
        }
    }

    commandError(message, collision = false) { return { status: 'error', collision, missionSuccess: false, message }; }

    async spray() {
        // Renderer Level 2 memilih api berdasarkan nomor challenge. C3 tidak menyemprot.
        await super.spray();
        this.mission.water = this.water;
        this.mission.sprays[this.mission.fireNumber] = this.sprays;
        this.updateFires();
        this.publishState();
    }

    async resetChallenge(challengeNumber = this.challengeNumber, animateReset = false, restartLevel = false) {
        if (animateReset) await this.playPlayerAnimation('reset');
        if (restartLevel) {
            this.mission = new Level3Mission(1);
            this.savedCheckpoint = null;
        } else if (this.savedCheckpoint?.challenge === challengeNumber) {
            this.mission = new Level3Mission(challengeNumber, this.savedCheckpoint);
            this.savedCheckpoint = null;
        } else if (this.mission.challenge === challengeNumber) this.mission.restoreCheckpoint();
        else this.mission = new Level3Mission(challengeNumber);
        const m = this.mission;
        this.playerColumn = m.column;
        this.playerRow = m.row;
        this.pump.stop().setFrame('idle');
        this.evaluationPump.stop().setFrame('idle');
        const position = level3TileToWorld(m.column, m.row);
        this.player.setPosition(position.x, position.y);
        this.syncPlayerShadow();
        this.setChallenge(challengeNumber);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09).centerOn(position.x, position.y);
        await this.playPlayerAnimation('spawn');
        this.setPlayerIdle(this.isAt(this.map.start) ? this.map.start.direction : 'north');
    }
}
