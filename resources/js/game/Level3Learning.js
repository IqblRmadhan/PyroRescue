import Level1Learning from './Level1Learning.js';
import challenges from './Level3Challenges.js';

export default class Level3Learning extends Level1Learning {
    constructor(root) {
        const lessons = Object.fromEntries(Object.entries(challenges).map(([number, challenge]) => [number, {
            title: challenge.title,
            code: challenge.example,
            explanation: challenge.lesson,
            effect: challenge.effect,
        }]));
        super(root, { lessons });
    }
}
