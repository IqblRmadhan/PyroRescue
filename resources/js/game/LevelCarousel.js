export function getLevelImageAction({ isCurrent, href, index }) {
    if (!isCurrent) return { type: 'select', index };
    if (href) return { type: 'navigate', href };
    return { type: 'none' };
}

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
            if (isCurrent) level.removeAttribute('aria-hidden');
            else level.setAttribute('aria-hidden', 'true');
            const imageButton = level.querySelector('[data-level-image]');
            if (imageButton) {
                imageButton.tabIndex = isCurrent ? 0 : -1;
                imageButton.setAttribute('aria-label', isCurrent
                    ? imageButton.dataset.levelHref
                        ? `Mainkan ${imageButton.dataset.levelTitle}`
                        : `${imageButton.dataset.levelTitle} belum dapat dimainkan`
                    : `Pilih ${imageButton.dataset.levelTitle}`);
            }
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
    levels.forEach((level, index) => {
        level.querySelector('[data-level-image]')?.addEventListener('click', () => {
            const action = getLevelImageAction({
                isCurrent: index === currentIndex,
                href: level.querySelector('[data-level-image]').dataset.levelHref,
                index,
            });
            if (action.type === 'select') showLevel(action.index);
            if (action.type === 'navigate') window.location.href = action.href;
        });
    });
    root.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        showLevel(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    });

    showLevel(Number(root.dataset.initialLevel ?? 1) - 1);
}
