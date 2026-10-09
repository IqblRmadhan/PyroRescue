import Level1Learning from './Level1Learning.js';
import challenges from './Level2Challenges.js';

export default class Level2Learning extends Level1Learning {
    constructor(root) {
        const lessons = Object.fromEntries(Object.entries(challenges).map(([number, challenge]) => [number, {
            title: challenge.title,
            code: challenge.example,
            explanation: challenge.lesson,
            effect: `Di game: ${number === '1' ? 'isi_air = 6 dijalankan di pompa sebelum berangkat. ' : ''}Datangi penanda C${number}, lalu padamkan api dengan ${challenge.requiredWater} kali semprotan.`,
        }]));
        super(root, { lessons });
    }
}
