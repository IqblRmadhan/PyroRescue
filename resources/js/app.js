import '../css/splash.css';
import '../css/page-loader.css';
import '../css/auth-refresh.css';
import '../css/menu-dashboard.css';
import '../css/level1-tutorial.css';
import '../css/profile.css';
import { initPageLoader, waitForStoryImages } from './PageLoader.js';
import { initMenuMusic } from './game/MenuMusic.js';
import { initPlayerPreferences } from './game/PlayerPreferences.js';

initPlayerPreferences();

const isGamePage = Boolean(document.getElementById('game-container'));
const pageLoader = document.body.matches('.splash-page, .auth-page, .main-menu-page, .profile-page') || isGamePage
    ? initPageLoader() : null;
if (document.body.matches('.auth-page')) {
    import('./AuthPassword.js').then(({ initAuthPassword }) => initAuthPassword());
}
if (document.body.matches('.main-menu-page')) {
    initMenuMusic(document.querySelector('[data-menu-music-toggle]'));
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

if (isGamePage) {
    window.addEventListener('pyro:game-ready', () => {
        requestAnimationFrame(() => requestAnimationFrame(() => pageLoader.hide()));
    }, { once: true });
    window.addEventListener('pyro:game-load-error', () => pageLoader.hide(), { once: true });
    const startGame = (() => {
        let gameModule;

        return () => {
            const levelNumber = document.getElementById('game-container').dataset.level;
            pageLoader.show(`Menyiapkan peta Level ${levelNumber}...`, 'Memuat peta, karakter, dan animasi');
            gameModule ??= import('./game/main.js').catch(error => {
                console.error('Game tidak dapat dimuat.', error);
                pageLoader.hide();
                document.getElementById('game-container').textContent = 'Game gagal dimuat. Muat ulang halaman untuk mencoba lagi.';
            });

            return gameModule;
        };
    })();

    const storyElement = document.getElementById('level-story');

    if (storyElement) {
        Promise.all([import('./game/StoryIntro.js'), waitForStoryImages(storyElement)])
            .then(([{ default: StoryIntro }]) => {
                storyElement.classList.add('story-entering');
                pageLoader.hide();
                storyElement.removeAttribute('inert');
                new StoryIntro(storyElement, { onComplete: startGame });
            }).catch(error => {
                console.error('Cerita pembuka tidak dapat dimuat.', error);
                pageLoader.hide();
                storyElement.hidden = true;
                document.getElementById('prototype-page').removeAttribute('inert');
                startGame();
            });
    } else {
        startGame();
    }
}
