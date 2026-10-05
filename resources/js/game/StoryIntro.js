import { gameAudio, getAudioButtonPresentation } from './GameAudio.js';

export class StoryTypewriter {
    constructor({
        delay = 30,
        reducedMotion = false,
        schedule = (callback, wait) => setTimeout(callback, wait),
        cancelSchedule = (timerId) => clearTimeout(timerId),
    } = {}) {
        this.delay = delay;
        this.reducedMotion = reducedMotion;
        this.schedule = schedule;
        this.cancelSchedule = cancelSchedule;
        this.timerId = null;
        this.typing = false;
    }

    start(text, onUpdate, onComplete = () => {}) {
        this.cancel();
        this.characters = [...String(text)];
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;
        this.characterIndex = 0;

        if (this.reducedMotion || this.characters.length === 0) {
            this.onUpdate(this.characters.join(''));
            this.onComplete();
            return false;
        }

        this.typing = true;
        this.onUpdate('');
        this.scheduleNextCharacter();
        return true;
    }

    scheduleNextCharacter() {
        this.timerId = this.schedule(() => {
            if (!this.typing) return;

            this.characterIndex += 1;
            this.onUpdate(this.characters.slice(0, this.characterIndex).join(''));

            if (this.characterIndex >= this.characters.length) {
                this.typing = false;
                this.timerId = null;
                this.onComplete();
                return;
            }

            this.scheduleNextCharacter();
        }, this.delay);
    }

    complete() {
        if (!this.typing) return false;

        if (this.timerId !== null) this.cancelSchedule(this.timerId);
        this.timerId = null;
        this.typing = false;
        this.onUpdate(this.characters.join(''));
        this.onComplete();
        return true;
    }

    cancel() {
        if (this.timerId !== null) this.cancelSchedule(this.timerId);
        this.timerId = null;
        this.typing = false;
    }

    isTyping() {
        return this.typing;
    }
}

export function getStoryNextButtonPresentation({
    isTyping,
    isLastSlide,
    levelNumber = '1',
}) {
    if (isTyping) {
        return {
            label: 'TAMPILKAN TEKS',
            ariaLabel: 'Tampilkan seluruh teks',
            action: 'reveal',
        };
    }

    if (isLastSlide) {
        return {
            label: 'MULAI MISI',
            ariaLabel: `Mulai misi Level ${levelNumber}`,
            action: 'start',
        };
    }

    return {
        label: 'LANJUT',
        ariaLabel: 'Lanjut ke adegan berikutnya',
        action: 'next',
    };
}

export default class StoryIntro {
    constructor(root, { onComplete = () => {} } = {}) {
        this.root = root;
        this.slides = [...root.querySelectorAll('[data-story-slide]')];
        this.progressItems = [...root.querySelectorAll('.story-progress span')];
        this.nextButton = root.querySelector('#story-next');
        this.nextLabel = root.querySelector('.story-next__label');
        this.skipButton = root.querySelector('#story-skip');
        this.audioButton = root.querySelector('#story-audio-toggle');
        this.audioButtonIcon = root.querySelector('.story-audio-toggle__icon');
        this.audioButtonLabel = root.querySelector('.story-audio-toggle__label');
        this.status = root.querySelector('#story-status');
        this.gamePage = document.getElementById(root.dataset.gamePage);
        this.levelNumber = root.dataset.levelNumber ?? '1';
        this.storyTexts = this.slides.map((slide) => {
            const paragraph = slide.querySelector('.story-dialogue p');
            const text = paragraph?.textContent.trim() ?? '';
            paragraph?.setAttribute('aria-label', text);
            return { paragraph, text };
        });
        this.typewriter = new StoryTypewriter({
            reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
        });
        this.onComplete = onComplete;
        this.currentIndex = 0;
        this.finished = false;

        this.handleKeydown = this.handleKeydown.bind(this);
        this.showNext = this.showNext.bind(this);
        this.finish = this.finish.bind(this);
        this.toggleAudio = this.toggleAudio.bind(this);
        this.resumeAudio = this.resumeAudio.bind(this);

        this.nextButton.addEventListener('click', this.showNext);
        this.skipButton.addEventListener('click', this.finish);
        this.audioButton.addEventListener('click', this.toggleAudio);
        window.addEventListener('pointerdown', this.resumeAudio, { capture: true });
        window.addEventListener('keydown', this.handleKeydown);
        document.body.classList.add('story-is-open');

        if (!gameAudio.isMuted()) void gameAudio.preload();
        this.renderAudioButton();
        this.showSlide(0);
        this.nextButton.focus();
    }

    renderAudioButton() {
        const presentation = getAudioButtonPresentation(gameAudio.isMuted());
        this.audioButtonIcon.textContent = presentation.icon;
        this.audioButtonLabel.textContent = presentation.label;
        this.audioButton.setAttribute('aria-label', presentation.ariaLabel);
        this.audioButton.setAttribute('aria-pressed', String(presentation.pressed));
    }

    toggleAudio() {
        const wasMuted = gameAudio.isMuted();
        if (!wasMuted) gameAudio.play('uiClick');
        const isMuted = gameAudio.toggleMuted();
        this.renderAudioButton();

        if (!isMuted) {
            void gameAudio.preload();
            void gameAudio.unlock().then((ready) => {
                if (ready) gameAudio.play('uiClick');
            });
        }
    }

    resumeAudio() {
        if (!gameAudio.isMuted()) void gameAudio.unlock();
    }

    showSlide(index) {
        this.typewriter.cancel();
        this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));

        this.slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === this.currentIndex;

            slide.hidden = !isActive;
            slide.classList.toggle('is-active', isActive);
        });

        this.progressItems.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === this.currentIndex);
        });

        this.status.textContent = `Adegan ${this.currentIndex + 1} dari ${this.slides.length}`;

        const currentStory = this.storyTexts[this.currentIndex];
        if (currentStory.paragraph) {
            this.typewriter.start(
                currentStory.text,
                (text) => { currentStory.paragraph.textContent = text; },
                () => this.renderNextButton(),
            );
        }

        this.renderNextButton();
    }

    renderNextButton() {
        const presentation = getStoryNextButtonPresentation({
            isTyping: this.typewriter.isTyping(),
            isLastSlide: this.currentIndex === this.slides.length - 1,
            levelNumber: this.levelNumber,
        });

        this.nextLabel.textContent = presentation.label;
        this.nextButton.setAttribute('aria-label', presentation.ariaLabel);
        this.nextButton.dataset.action = presentation.action;
        this.nextButton.classList.toggle('story-next--typing', presentation.action === 'reveal');
        this.root.classList.toggle('story-is-typing', presentation.action === 'reveal');
    }

    showNext() {
        if (this.typewriter.complete()) {
            gameAudio.play('uiClick');
            return;
        }

        if (this.currentIndex >= this.slides.length - 1) {
            gameAudio.play('run');
            this.finish(false);
            return;
        }

        gameAudio.play('storyNext');
        this.showSlide(this.currentIndex + 1);
    }

    showPrevious() {
        if (this.currentIndex > 0) {
            gameAudio.play('storyNext');
            this.showSlide(this.currentIndex - 1);
        }
    }

    handleKeydown(event) {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.showNext();
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.showPrevious();
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            this.finish();
        }
    }

    finish(playSound = true) {
        if (this.finished) {
            return;
        }

        if (playSound !== false) gameAudio.play('run');

        this.finished = true;
        this.typewriter.cancel();
        this.nextButton.removeEventListener('click', this.showNext);
        this.skipButton.removeEventListener('click', this.finish);
        this.audioButton.removeEventListener('click', this.toggleAudio);
        window.removeEventListener('pointerdown', this.resumeAudio, { capture: true });
        window.removeEventListener('keydown', this.handleKeydown);
        document.body.classList.remove('story-is-open');
        this.root.classList.remove('story-is-typing');
        this.root.hidden = true;
        this.gamePage?.removeAttribute('inert');
        this.skipButton.blur();
        this.nextButton.blur();
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        this.onComplete();
    }
}
