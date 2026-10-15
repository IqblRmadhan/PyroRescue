import './bootstrap';
import '../css/splash.css';
import '../css/page-loader.css';
import '../css/auth-refresh.css';
import '../css/menu-dashboard.css';
import '../css/level1-tutorial.css';
import { initPageLoader } from './PageLoader.js';

if (document.body.matches('.splash-page, .auth-page')) initPageLoader();
if (document.body.matches('.auth-page')) {
    import('./AuthPassword.js').then(({ initAuthPassword }) => initAuthPassword());
}
if (document.body.matches('.main-menu-page')) {
    import('./game/MenuMusic.js').then(({ initMenuMusic }) => {
        initMenuMusic(document.querySelector('[data-menu-music-toggle]'));
    });
    window.addEventListener('pageshow', event => {
        if (event.persisted) location.reload();
    });
}

const levelCarousel = document.querySelector('[data-level-carousel]');
if (levelCarousel) {
    import('./game/LevelCarousel.js').then(({ initLevelCarousel }) => initLevelCarousel(levelCarousel));
}

const gamePrototype = document.querySelector('.game-prototype');

if (gamePrototype) {
    import('./game/MaterialDialog.js').then(({ initMaterialDialog }) => initMaterialDialog());

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
