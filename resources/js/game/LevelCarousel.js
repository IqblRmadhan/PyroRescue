export function initLevelCarousel(root) {
    const levels = [...root.querySelectorAll('[data-level]')];
    const steps = [...root.querySelectorAll('[data-carousel-step]')];
    const status = root.querySelector('[data-carousel-status]');
    if (!levels.length || !status) return;

    let currentIndex = 0;

    function showLevel(index) {
        currentIndex = (index + levels.length) % levels.length;
        levels.forEach((level, levelIndex) => {
            const isCurrent = levelIndex === currentIndex;
            const position = (levelIndex - currentIndex + levels.length) % levels.length;
            level.classList.toggle('is-current', isCurrent);
            level.classList.toggle('is-next', position === 1);
            level.classList.toggle('is-previous', position === levels.length - 1);
            level.toggleAttribute('inert', !isCurrent);
            if (isCurrent) level.removeAttribute('aria-hidden');
            else level.setAttribute('aria-hidden', 'true');
        });

        steps.forEach((step, stepIndex) => {
            const isCurrent = stepIndex === currentIndex;
            step.classList.toggle('is-current', isCurrent);
            if (isCurrent) step.setAttribute('aria-current', 'step');
            else step.removeAttribute('aria-current');
        });

        const title = levels[currentIndex].querySelector('h2')?.textContent ?? '';
        status.textContent = `Level ${currentIndex + 1} dari ${levels.length} · ${title}`;
    }

    root.querySelector('[data-carousel-previous]')?.addEventListener('click', () => showLevel(currentIndex - 1));
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => showLevel(currentIndex + 1));
    steps.forEach((step, index) => step.addEventListener('click', () => showLevel(index)));
    root.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        showLevel(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    });

    showLevel(0);
}
