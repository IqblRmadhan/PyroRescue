// Satu renderer untuk materi semua level; isi materi berada di Level*Challenges.js.
export default class LearningPanel {
    constructor(root, challenges) {
        this.root = root;
        this.challenges = challenges;
    }

    setChallenge(challengeNumber) {
        const current = this.challenges[challengeNumber];
        const lesson = current?.lesson && current?.example ? current : this.challenges[3];
        this.root.querySelector('#lesson-title').textContent = lesson.lessonTitle ?? lesson.title;
        this.root.querySelector('#lesson-code').textContent = lesson.example;
        this.root.querySelector('#lesson-explanation').textContent = lesson.lesson;
        this.root.querySelector('#lesson-effect').textContent = lesson.effect;
        for (const step of this.root.querySelectorAll('[data-lesson-step]')) {
            if (Number(step.dataset.lessonStep) === challengeNumber) {
                step.setAttribute('aria-current', 'step');
            } else {
                step.removeAttribute('aria-current');
            }
        }
    }
}
