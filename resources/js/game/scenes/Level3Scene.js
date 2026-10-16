import Level2Scene from './Level2Scene.js';
import { level3Assets, level3MapImage, level3MapShadowImage } from '../Level3Assets.js';
import { level3Map, isLevel3Walkable, level3TileToWorld } from '../Level3Map.js';
import challenges from '../Level3Challenges.js';
import { resolveBekantanStatus } from '../Level3Validator.js';
import { addFireLabel } from '../PumpLabel.js';
import { showChallengeMarker } from '../MapMarkers.js';

export default class Level3Scene extends Level2Scene {
    constructor(options) {
        super(options, {
            sceneKey: 'Level3Scene', map: level3Map, challenges,
            assets: level3Assets, mapImage: level3MapImage,
            mapShadowImage: level3MapShadowImage, isWalkable: isLevel3Walkable,
        });
    }

    createAnimations() {
        super.createAnimations();
        for (const state of ['worried', 'rescued']) {
            this.anims.create({
                key: `bekantan-${state}`,
                frames: [1, 2, 3, 4, 5].map((number) => ({ key: 'bekantan', frame: `${state}${number}` })),
                frameRate: 4,
                repeat: -1,
            });
        }
    }

    drawMissionObjects() {
        super.drawMissionObjects();
        this.bekantanSprites = {};
        for (const [number, animal] of Object.entries(this.map.bekantan)) {
            this.bekantanSprites[number] = this.add.sprite(animal.x, animal.y, 'bekantan', 'worried1')
                .setOrigin(0.5, 1).setScale(animal.size / 400).setDepth(6)
                .play('bekantan-worried');
        }
        const marker = level3TileToWorld(this.map.habitat.column, this.map.habitat.row);
        this.habitatMarker = this.add.sprite(marker.x, marker.y, 'actionMarker', 'pulse1')
            .setDisplaySize(24, 24).setDepth(7).play('level2-marker');
        this.habitatLabel = addFireLabel(this, 740, 620, 'BEKANTAN', 'below');
    }

    update() {
        super.update();
        this.habitatLabel?.setZoom(this.cameras.main.zoom);
    }

    setChallenge(challengeNumber) {
        this.challengeNumber = challengeNumber;
        this.requiredWater = challenges[challengeNumber].requiredWater;
        // C2 dan C3 memeriksa api habitat yang sudah padam pada C1.
        this.sprays = challengeNumber === 2 || challengeNumber === 3 ? 3 : 0;
        this.bekantanStatus = challengeNumber === 3 ? 'aman' : 'tunggu';
        this.conditionChecked = false;
        this.evaluationProgramComplete = false;
        if (challengeNumber === 4) this.water = 0;
        showChallengeMarker(this.pumpMarker, null, 1, challengeNumber, 'pump');
        showChallengeMarker(this.evaluationPumpMarker, null, 4, challengeNumber, 'pump');
        this.updateFires();
        this.publishState();
    }

    updateFires() {
        for (const [number, sprite] of Object.entries(this.fires)) {
            const fireNumber = Number(number);
            const completed = fireNumber === 1
                ? this.challengeNumber > 1 || this.sprays >= 3
                : this.challengeNumber === 4 && this.sprays >= 4;
            const active = fireNumber === this.challengeNumber;
            if (completed) sprite.stop().setFrame('extinguished');
            else sprite.play(`${challenges[number].texture}-burn`, true);
            const title = fireNumber === 1 ? 'HABITAT' : 'EVALUASI';
            const remaining = challenges[number].requiredWater - (active ? this.sprays : 0);
            this.fireLabels[number].setText(completed ? `${title} • PADAM` : `${title} • ${remaining}× SEMPROT`)
                .setTheme(completed ? 'completed' : active ? 'fire' : 'fireInactive');
            showChallengeMarker(this.fireMarkers[number], null, fireNumber, this.challengeNumber);
        }
        showChallengeMarker(this.habitatMarker, null, this.challengeNumber === 3 ? 3 : 2, this.challengeNumber);
        this.updateBekantan();
        this.finishTile.setAlpha(this.evaluationProgramComplete ? 1 : 0.7);
    }

    updateBekantan() {
        for (const [number, sprite] of Object.entries(this.bekantanSprites)) {
            let status = this.bekantanStatus;
            if (Number(number) === 1 && this.challengeNumber === 4) status = 'selamat';
            if (Number(number) === 4 && this.challengeNumber < 4) status = 'tunggu';
            const animation = status === 'aman' || status === 'selamat'
                ? 'bekantan-rescued' : 'bekantan-worried';
            // Jangan mulai ulang animasi setiap kali kondisi game diperbarui.
            sprite.play(animation, true);
        }
        const status = this.challengeNumber === 4 ? 'selamat' : this.bekantanStatus;
        this.habitatLabel.setText(`BEKANTAN: ${status.toUpperCase()}`)
            .setTheme(status === 'tunggu' ? 'fireInactive' : 'completed');
    }

    publishState() {
        const fireNumber = this.challengeNumber === 4 ? 4 : 1;
        const fireOut = this.sprays === this.requiredWater;
        const fireNearby = Object.entries(this.map.fires).some(([number, fire]) => {
            const burning = Number(number) === 1 ? this.challengeNumber === 1 && !fireOut
                : this.challengeNumber < 4 || !fireOut;
            return burning && Math.abs(this.playerColumn - fire.action.column) <= 2
                && Math.abs(this.playerRow - fire.action.row) <= 2;
        });
        this.onStateChange({
            water: this.water, sprays: this.sprays, requiredWater: this.requiredWater,
            atPump: this.isAt((this.challengeNumber === 4 ? this.map.evaluationPump : this.map.pump).action),
            atFire: this.isAt(this.map.fires[fireNumber].action),
            atHabitat: this.isAt(this.challengeNumber === 4 ? this.map.fires[4].action : this.map.habitat),
            fireOut, apiPadam: fireOut, bekantanStatus: this.bekantanStatus,
            conditionChecked: this.conditionChecked,
            rescued: this.bekantanStatus === 'selamat' && this.conditionChecked
                && (this.challengeNumber !== 4 || this.evaluationProgramComplete),
            atFinish: this.isAt(this.map.finish),
            fireNearby,
        });
    }

    async runCommands(commands, onCommandComplete = () => {}) {
        const error = (message, collision = false) => ({ status: 'error', collision, missionSuccess: false, message });
        const requested = commands.filter((command) => command.type === 'spray').length;
        if (requested > this.requiredWater - this.sprays) {
            return error(this.challengeNumber === 4
                ? 'Jumlah semprotan melebihi sisa kebutuhan. Gunakan Ulangi untuk mencoba program evaluasi dari awal.'
                : `Api membutuhkan ${this.requiredWater - this.sprays} semprotan lagi.`);
        }
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        for (const command of commands) {
            if (command.type === 'move') {
                if (!await this.move(command.direction)) return error('Petak di depan bukan jalur yang dapat dilalui. Ikuti daratan dan jembatan.', true);
                onCommandComplete(command);
                if (this.isAt(this.map.finish)) {
                    const missionSuccess = this.challengeNumber === 4 && this.evaluationProgramComplete;
                    return { status: 'finish', reachedFinish: true, missionSuccess,
                        message: missionSuccess ? 'FINISH tercapai. Evaluasi penyelamatan selesai.'
                            : 'FINISH tercapai, tetapi tiga challenge dan evaluasi belum selesai.' };
                }
                continue;
            } else if (command.type === 'setWater') {
                const pump = this.challengeNumber === 4 ? this.map.evaluationPump : this.map.pump;
                if (!this.isAt(pump.action)) return error('Datangi titik biru pompa untuk mengisi air.');
                await this.fillWater(command.amount, this.challengeNumber === 4 ? this.evaluationPump : this.pump);
            } else if (command.type === 'spray') {
                const fire = this.map.fires[this.challengeNumber];
                if (!fire || !this.isAt(fire.action)) return error('Berdirilah di penanda merah api aktif sebelum menyemprot.');
                if (this.water === 0) return error('Air habis. Isi tangki di pompa sebelum menyemprot lagi.');
                await this.spray();
            } else if (command.type === 'conditional') {
                const target = this.challengeNumber === 4 ? this.map.fires[4].action : this.map.habitat;
                if (!this.isAt(target)) return error('Datangi penanda bekantan sebelum memeriksa kondisi penyelamatan.');
                const fireOut = this.sprays === this.requiredWater;
                this.bekantanStatus = resolveBekantanStatus(command, fireOut, this.bekantanStatus);
                this.conditionChecked = true;
                if (this.challengeNumber === 4) {
                    this.evaluationProgramComplete = fireOut && requested === 4
                        && command.evaluationCountValid && this.bekantanStatus === 'selamat';
                }
                this.updateFires();
                this.publishState();
                onCommandComplete({ ...command, fireOut, status: this.bekantanStatus });
                continue;
            }
            onCommandComplete(command);
        }
        const missionSuccess = this.challengeNumber === 1 ? this.sprays === 3
            : this.challengeNumber === 2 ? this.conditionChecked && this.bekantanStatus === 'aman'
                : this.challengeNumber === 3 ? this.conditionChecked && this.bekantanStatus === 'selamat'
                    : this.evaluationProgramComplete && this.isAt(this.map.finish);
        if (missionSuccess) this.onAudio('challengeComplete');
        return {
            status: missionSuccess ? 'success' : 'progress', missionSuccess,
            message: missionSuccess ? this.challengeNumber === 1
                ? 'Api habitat padam! Sistem mengubah api_padam menjadi True. Sekarang periksa keselamatan bekantan.'
                : 'Berhasil! Kondisi api diperiksa dan target penyelamatan terpenuhi.'
                : this.evaluationProgramComplete ? 'Bekantan selamat! Ikuti jalur satu petak ke bawah menuju FINISH.'
                    : this.challengeNumber === 4 && this.conditionChecked ? 'Bekantan belum berhasil diselamatkan. Gunakan Ulangi dan perbaiki program evaluasi.'
                        : 'Ikuti penanda misi untuk melanjutkan penyelamatan.',
        };
    }

    async resetChallenge(challengeNumber = this.challengeNumber, animateReset = false) {
        if (animateReset) await this.playPlayerAnimation('reset');
        const checkpoint = challengeNumber === 4 ? this.map.evaluationStart
            : challengeNumber === 3 ? this.map.habitat
                : challengeNumber === 2 ? this.map.fires[1].action : this.map.start;
        this.playerColumn = checkpoint.column;
        this.playerRow = checkpoint.row;
        this.water = 0;
        this.pump.stop().setFrame('idle');
        this.evaluationPump.stop().setFrame('idle');
        const position = level3TileToWorld(checkpoint.column, checkpoint.row);
        this.player.setPosition(position.x, position.y);
        this.syncPlayerShadow();
        this.setChallenge(challengeNumber);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09).centerOn(position.x, position.y);
        await this.playPlayerAnimation('spawn');
        this.setPlayerIdle(checkpoint.direction ?? 'south');
    }
}
