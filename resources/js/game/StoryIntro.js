export default class StoryIntro {
    constructor(root, { onComplete = () => {} } = {}) {
        this.root = root;
        this.slides = [...root.querySelectorAll('[data-story-slide]')];
        this.progressItems = [...root.querySelectorAll('.story-progress span')];
        this.nextButton = root.querySelector('#story-next');
        this.nextLabel = root.querySelector('.story-next__label');
        this.skipButton = root.querySelector('#story-skip');
        this.status = root.querySelector('#story-status');
        this.gamePage = document.getElementById(root.dataset.gamePage);
        this.onComplete = onComplete;
        this.currentIndex = 0;
        this.finished = false;

        this.handleKeydown = this.handleKeydown.bind(this);
        this.showNext = this.showNext.bind(this);
        this.finish = this.finish.bind(this);

        this.nextButton.addEventListener('click', this.showNext);
        this.skipButton.addEventListener('click', this.finish);
        window.addEventListener('keydown', this.handleKeydown);
        document.body.classList.add('story-is-open');

        this.showSlide(0);
        this.nextButton.focus();
    }

    showSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));

        this.slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === this.currentIndex;

            slide.hidden = !isActive;
            slide.classList.toggle('is-active', isActive);
        });

        this.progressItems.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === this.currentIndex);
        });

        const isLastSlide = this.currentIndex === this.slides.length - 1;
        this.nextLabel.textContent = isLastSlide ? 'MULAI MISI' : 'LANJUT';
        this.nextButton.setAttribute(
            'aria-label',
            isLastSlide ? 'Mulai misi Level 1' : 'Lanjut ke adegan berikutnya',
        );
        this.status.textContent = `Adegan ${this.currentIndex + 1} dari ${this.slides.length}`;
    }

    showNext() {
        if (this.currentIndex >= this.slides.length - 1) {
            this.finish();
            return;
        }

        this.showSlide(this.currentIndex + 1);
    }

    showPrevious() {
        if (this.currentIndex > 0) {
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

    finish() {
        if (this.finished) {
            return;
        }

        this.finished = true;
        this.nextButton.removeEventListener('click', this.showNext);
        this.skipButton.removeEventListener('click', this.finish);
        window.removeEventListener('keydown', this.handleKeydown);
        document.body.classList.remove('story-is-open');
        this.root.hidden = true;
        this.gamePage?.removeAttribute('inert');
        this.skipButton.blur();
        this.nextButton.blur();
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        this.onComplete();
    }
}
