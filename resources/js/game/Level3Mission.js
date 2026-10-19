import { level3Map } from './Level3Map.js';

// Keadaan misi berupa data biasa agar Reset, penyimpanan, dan tes memakai aturan yang sama.
export class Level3Mission {
    constructor(challenge = 1, saved = null) {
        const start = challenge === 1 ? level3Map.start
            : challenge === 4 ? level3Map.evaluationStart : level3Map.post;
        Object.assign(this, {
            challenge, step: 0, column: start.column, row: start.row,
            water: { 1: 0, 2: 2, 3: 2, 4: 5 }[challenge],
            sprays: { 1: challenge > 1 ? 2 : 0, 2: challenge > 2 ? 3 : 0, 4: 0 },
            rescued: challenge > 2 ? [1, 2] : challenge === 2 ? [1] : [],
            following: null, routeSafe: challenge !== 3, evaluationPassed: false,
            attempts: 0, hintsUsed: 0,
        }, saved ?? {});
        this.saveCheckpoint();
    }

    get fireNumber() { return this.challenge >= 3 ? 4 : this.challenge; }
    get requiredWater() { return { 1: 2, 2: 3, 4: 4 }[this.fireNumber]; }
    get world() {
        return {
            isi_air: this.water, kebutuhan_air: this.requiredWater,
            api_padam: this.sprays[this.fireNumber] >= this.requiredWater,
            hewan_terjebak: !this.rescued.includes(this.fireNumber) && this.following !== this.fireNumber,
            jalur_aman: this.routeSafe,
        };
    }

    snapshot() {
        const { challenge, step, column, row, water, sprays, rescued, following,
            routeSafe, evaluationPassed, attempts, hintsUsed } = this;
        return structuredClone({ challenge, step, column, row, water, sprays, rescued,
            following, routeSafe, evaluationPassed, attempts, hintsUsed });
    }

    saveCheckpoint() { this.checkpoint = this.snapshot(); }
    restoreCheckpoint() {
        const { attempts, hintsUsed } = this;
        Object.assign(this, structuredClone(this.checkpoint), { attempts, hintsUsed });
    }
    deliver() {
        if (this.following !== null && !this.rescued.includes(this.following)) this.rescued.push(this.following);
        this.following = null;
    }
    canFinish() {
        return this.evaluationPassed && this.rescued.length === 3
            && this.sprays[1] === 2 && this.sprays[2] === 3 && this.sprays[4] === 4;
    }
}
