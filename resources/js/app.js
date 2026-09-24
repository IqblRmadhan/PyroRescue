import './bootstrap';

const gamePrototype = document.querySelector('.game-prototype');

if (gamePrototype) {
    const hasMobileUserAgent = navigator.userAgentData?.mobile === true
        || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const hasMobileScreen = window.matchMedia('(pointer: coarse)').matches
        && Math.min(window.screen.width, window.screen.height) <= 1024;
    const updateLayoutMode = () => {
        const isMobileMode = hasMobileUserAgent
            || hasMobileScreen
            || window.innerWidth <= 900;
        gamePrototype.classList.toggle('game-mobile', isMobileMode);
    };

    updateLayoutMode();
    window.addEventListener('resize', updateLayoutMode);
    window.visualViewport?.addEventListener('resize', updateLayoutMode);
}

if (document.getElementById('game-container')) {
    const startGame = (() => {
        let gameModule;

        return () => {
            gameModule ??= import('./game/main.js');

            return gameModule;
        };
    })();

    const storyElement = document.getElementById('level-story');

    if (storyElement) {
        import('./game/StoryIntro.js').then(({ default: StoryIntro }) => {
            new StoryIntro(storyElement, { onComplete: startGame });
        });
    } else {
        startGame();
    }
}
