import './bootstrap';

const gamePrototype = document.querySelector('.game-prototype');

if (gamePrototype) {
    const hasMobileUserAgent = navigator.userAgentData?.mobile === true
        || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const hasMobileScreen = window.matchMedia('(pointer: coarse)').matches
        && Math.min(window.screen.width, window.screen.height) <= 1024;
    let isMobileMode = false;

    const fitDesktopStage = () => {
        if (isMobileMode) {
            gamePrototype.style.removeProperty('--game-stage-scale');
            return;
        }

        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const bottomHeight = Number.parseFloat(
            getComputedStyle(gamePrototype).getPropertyValue('--game-bottom-height'),
        ) || 0;
        const bottomGap = Number.parseFloat(
            getComputedStyle(gamePrototype).getPropertyValue('--game-bottom-gap'),
        ) || 0;
        const horizontalScale = viewportWidth / 1672;
        const verticalScale = Math.max(viewportHeight - bottomHeight - bottomGap, 1) / 941;
        gamePrototype.style.setProperty(
            '--game-stage-scale',
            String(Math.min(horizontalScale, verticalScale)),
        );
    };

    const updateLayoutMode = () => {
        const browserWindowWidth = window.outerWidth > 0
            ? window.outerWidth
            : window.innerWidth;
        isMobileMode = hasMobileUserAgent
            || hasMobileScreen
            || browserWindowWidth <= 700;
        gamePrototype.classList.toggle('game-mobile', isMobileMode);
        fitDesktopStage();
    };

    const preventKeyboardZoom = (event) => {
        const zoomKeys = ['+', '-', '=', '0', 'Add', 'Subtract'];

        if ((event.ctrlKey || event.metaKey) && zoomKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const preventWheelZoom = (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    };

    const preventGestureZoom = (event) => event.preventDefault();

    updateLayoutMode();
    window.addEventListener('resize', updateLayoutMode);
    window.visualViewport?.addEventListener('resize', updateLayoutMode);
    window.addEventListener('keydown', preventKeyboardZoom, { capture: true });
    window.addEventListener('wheel', preventWheelZoom, { passive: false, capture: true });
    window.addEventListener('gesturestart', preventGestureZoom, { passive: false });
    window.addEventListener('gesturechange', preventGestureZoom, { passive: false });
    window.addEventListener('gestureend', preventGestureZoom, { passive: false });
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
