import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const chromeCandidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
].filter(Boolean);
const chromePath = chromeCandidates.find(existsSync);

function readMetric(html, name) {
    const match = html.match(new RegExp(`data-${name}="([^"]*)"`));
    assert.ok(match, `metric ${name} is available`);
    return match[1];
}

function measureGameViewport(width, height) {
    const temporaryDirectory = mkdtempSync(path.join(tmpdir(), 'pyrorescue-viewport-'));
    const htmlPath = path.join(temporaryDirectory, 'viewport.html');
    const appCss = pathToFileURL(path.resolve('resources/css/app.css')).href;
    const tutorialCss = pathToFileURL(path.resolve('resources/css/level1-tutorial.css')).href;
    const profilePath = path.join(temporaryDirectory, 'chrome-profile');

    writeFileSync(htmlPath, `<!doctype html>
        <html><head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="${appCss}">
            <link rel="stylesheet" href="${tutorialCss}">
        </head><body class="game-prototype game-workspace game-scale-80">
            <div class="prototype-page">
                <header class="game-header">
                    <div class="game-brand-logo"></div>
                    <div class="level-title wood-sign"><h1>Tepi Sungai Terbakar</h1></div>
                    <div class="forest-message wood-sign">Python · Variabel</div>
                </header>
                <main class="game-layout">
                    <section class="game-area wood-frame"><div id="game-container"></div></section>
                    <aside class="game-panel wood-frame">
                        <section class="mission-card"><div><h2>Challenge</h2><ul class="target-list"><li>Target misi</li></ul></div></section>
                        <div class="panel-content">
                            <div class="code-editor-wrapper"><div class="code-editor-screen"></div></div>
                            <div class="game-buttons"><button class="game-action-button">Run</button></div>
                            <button class="game-guide-button">Baca Materi</button>
                        </div>
                    </aside>
                </main>
                <footer class="game-tutorial-footer"><button class="game-tutorial-open">Cara Bermain</button></footer>
            </div>
            <output id="metrics"></output>
            <script>
                const metrics = document.getElementById('metrics');
                const scrolling = document.scrollingElement;
                metrics.dataset.innerWidth = window.innerWidth;
                metrics.dataset.innerHeight = window.innerHeight;
                metrics.dataset.scrollHeight = scrolling.scrollHeight;
                metrics.dataset.overflowY = getComputedStyle(document.body).overflowY;
                metrics.dataset.footerBottom = Math.ceil(document.querySelector('.game-tutorial-footer').getBoundingClientRect().bottom);
                const wrapper = document.querySelector('.code-editor-wrapper');
                const screen = document.querySelector('.code-editor-screen');
                const wrapperRect = wrapper.getBoundingClientRect();
                const screenRect = screen.getBoundingClientRect();
                metrics.dataset.wrapperWidth = Math.round(wrapperRect.width);
                metrics.dataset.wrapperHeight = Math.round(wrapperRect.height);
                metrics.dataset.screenTopInset = Math.round(screenRect.top - wrapperRect.top);
                metrics.dataset.screenLeftInset = Math.round(screenRect.left - wrapperRect.left);
            </script>
        </body></html>`);

    try {
        const html = execFileSync(chromePath, [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            `--user-data-dir=${profilePath}`,
            `--window-size=${width},${height}`,
            '--dump-dom',
            pathToFileURL(htmlPath).href,
        ], { encoding: 'utf8', timeout: 20_000 });

        return {
            innerWidth: Number(readMetric(html, 'inner-width')),
            innerHeight: Number(readMetric(html, 'inner-height')),
            scrollHeight: Number(readMetric(html, 'scroll-height')),
            overflowY: readMetric(html, 'overflow-y'),
            footerBottom: Number(readMetric(html, 'footer-bottom')),
            wrapperWidth: Number(readMetric(html, 'wrapper-width')),
            wrapperHeight: Number(readMetric(html, 'wrapper-height')),
            screenTopInset: Number(readMetric(html, 'screen-top-inset')),
            screenLeftInset: Number(readMetric(html, 'screen-left-inset')),
        };
    } finally {
        rmSync(temporaryDirectory, { recursive: true, force: true });
    }
}

test('desktop game fills common laptop viewports without page scrolling', { skip: !chromePath }, () => {
    for (const viewport of [[1366, 768], [1920, 1080]]) {
        const metrics = measureGameViewport(...viewport);
        assert.ok(metrics.innerWidth >= 901);
        assert.equal(metrics.overflowY, 'hidden');
        assert.ok(metrics.scrollHeight <= metrics.innerHeight);
        assert.ok(metrics.footerBottom <= metrics.innerHeight);
        assert.ok(metrics.wrapperWidth > 0);
        assert.ok(metrics.wrapperHeight > 0);
        assert.ok(
            Math.abs((metrics.wrapperWidth / metrics.wrapperHeight) - 1.5) < 0.05,
            `PyroPad frame keeps its 3:2 ratio, received ${metrics.wrapperWidth}x${metrics.wrapperHeight}`,
        );
        assert.ok(metrics.screenTopInset > 0);
        assert.ok(metrics.screenLeftInset > 0);
    }
});

test('mobile game keeps its vertical scrolling layout', { skip: !chromePath }, () => {
    const metrics = measureGameViewport(800, 900);

    assert.ok(metrics.innerWidth <= 900);
    assert.notEqual(metrics.overflowY, 'hidden');
});
