// Level 3 has a dedicated complete flow in level3-gameplay.mjs.
// Jalankan dengan server Laravel aktif dan Playwright yang sudah tersedia.
// PLAYWRIGHT_MODULE dapat berisi URL file modul Playwright di luar proyek.
import assert from 'node:assert/strict';
import { level1Map, isWalkable } from '../../resources/js/game/Level1Map.js';
import { level2Map, isLevel2Walkable } from '../../resources/js/game/Level2Map.js';
import { level3Map, isLevel3Walkable } from '../../resources/js/game/Level3Map.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const origin = process.env.GAME_URL ?? 'http://127.0.0.1:8000';
const errors = [];
page.on('pageerror', error => errors.push(error.message));

async function dismissGuide() {
    for (let count = 0; await page.locator('#feedback').evaluate(dialog => dialog.open); count++) {
        assert.ok(count < 15, 'Dialog harus selesai setelah semua penjelasan dibaca');
        await page.locator('#feedback-ok').click();
    }
}

async function run(code) {
    await page.locator('#code-editor').fill(code);
    await page.locator('#run-code').click();
    await page.waitForFunction(() => document.querySelector('#feedback').open
        || !document.querySelector('#run-code').disabled || !document.querySelector('#level-result').hidden);
    await dismissGuide();
}

async function checkMaterial(expectedTitle, expectedCode) {
    await page.locator('#material-open').click();
    assert.equal(await page.locator('#lesson-title').textContent(), expectedTitle);
    assert.equal(await page.locator('#lesson-code').textContent(), expectedCode);
    assert.ok((await page.locator('#lesson-effect').textContent()).length > 10);
    await page.keyboard.press('Escape');
}

// Cari jalur legal, lalu tetap jalankan setiap langkah melalui editor dan tombol Run.
function route(start, target, walkable) {
    const queue = [{ ...start, commands: [] }];
    const visited = new Set([`${start.column},${start.row}`]);
    for (let index = 0; index < queue.length; index++) {
        const current = queue[index];
        if (current.column === target.column && current.row === target.row) return current.commands;
        for (const [command, dx, dy] of [['kanan', 1, 0], ['kiri', -1, 0], ['atas', 0, -1], ['bawah', 0, 1]]) {
            const column = current.column + dx;
            const row = current.row + dy;
            const key = `${column},${row}`;
            if (!walkable(column, row) || visited.has(key)) continue;
            visited.add(key);
            queue.push({ column, row, commands: [...current.commands, `${command}(1)`] });
        }
    }
    assert.fail('Target harus dapat dicapai melalui jalur peta');
}

async function goTo(target, walkable) {
    const start = await page.evaluate(() => {
        const scene = window.pyroGame.scene.getScenes(true)[0];
        return { column: scene.playerColumn, row: scene.playerRow };
    });
    const commands = route(start, target, walkable);
    if (commands.length) await run(commands.join('\n'));
    assert.equal(await page.locator('#code-error').textContent(), '');
}

async function checkResetLock() {
    // Tahan Promise agar klik selama reset dapat direproduksi tanpa bergantung kecepatan CPU.
    await page.evaluate(() => {
        const scene = window.pyroGame.scene.getScenes(true)[0];
        const original = scene.resetChallenge.bind(scene);
        scene.resetChallenge = async (...args) => {
            await new Promise(resolve => { window.releaseTestReset = resolve; });
            scene.resetChallenge = original;
            return original(...args);
        };
    });
    await page.locator('#reset').click();
    assert.equal(await page.locator('#run-code').isDisabled(), true);
    assert.equal(await page.locator('#reset').isDisabled(), true);
    assert.equal(await page.locator('#tutorial-open').isDisabled(), true);
    await page.locator('#tutorial-open').dispatchEvent('click');
    assert.equal(await page.locator('#level1-tutorial').isVisible(), false);
    await page.evaluate(() => window.releaseTestReset());
    await page.waitForFunction(() => document.querySelector('#feedback').open);
    await dismissGuide();
    await page.locator('#tutorial-open').click();
    await page.locator('[data-tutorial-skip]').click();
    assert.equal(await page.locator('#run-code').isEnabled(), true);
}

try {
    await page.goto(`${origin}/login`);
    await page.getByRole('button', { name: 'Main sebagai Tamu' }).click();
    await page.waitForURL('**/main-menu');

    for (const level of [1, 2]) {
        await page.goto(`${origin}/game/${level}`);
        await page.locator('#story-skip').click();
        if (level === 1) await page.locator('[data-tutorial-skip]').click();
        await page.waitForFunction(() => document.querySelector('#feedback').open);
        await dismissGuide();
        await page.evaluate(() => {
            const scene = window.pyroGame.scene.getScenes(true)[0];
            scene.tweens.timeScale = 10;
            scene.anims.globalTimeScale = 10;
        });

        for (const button of ['#music-toggle', '#audio-toggle']) {
            const before = await page.locator(button).getAttribute('aria-pressed');
            await page.locator(button).click();
            assert.notEqual(await page.locator(button).getAttribute('aria-pressed'), before);
            await page.locator(button).click();
            assert.equal(await page.locator(button).getAttribute('aria-pressed'), before);
        }
        if (level === 1) {
            await checkResetLock();
            await run('isi_ air = 3');
            assert.ok(await page.locator('#code-error').textContent());
            assert.equal(await page.locator('#score-value').textContent(), '95');
        }
        if (level === 2) {
            await run('for i in range(1):\n\u00a0\u00a0\u00a0\u00a0semprot()');
            assert.match(await page.locator('#code-error').textContent(), /indentasi/);
            assert.equal(await page.locator('#score-value').textContent(), '95');
        }
        await page.locator('#clear-code').click();
        assert.equal(await page.locator('#code-editor').inputValue(), '');

        const [map, walkable] = level === 1 ? [level1Map, isWalkable]
            : level === 2 ? [level2Map, isLevel2Walkable] : [level3Map, isLevel3Walkable];
        for (const challenge of [1, 2, 3, 4]) {
            const current = await page.evaluate(() => window.pyroGame.scene.getScenes(true)[0].challengeNumber);
            assert.equal(current, challenge);
            if (challenge < 4) {
                const titles = level === 1 ? ['1. Membuat variabel', '2. Menjaga nilai variabel', '3. Menggunakan nilai variabel']
                    : level === 2 ? ['Challenge 1 - Mengenal Semprotan', 'Challenge 2 - Mengulang Semprotan', 'Challenge 3 - Variabel dalam Perulangan']
                        : ['Challenge 1 - Memadamkan Api di Habitat', 'Challenge 2 - Memeriksa Kondisi Api dengan if', 'Challenge 3 - Menentukan Tindakan dengan if/else'];
                const codes = level === 1 ? ['isi_air = 5', '# isi_air tetap 5 selama perjalanan', 'air_pos = isi_air']
                    : level === 2 ? ['isi_air = 6\nsemprot()\nsemprot()', 'for i in range(1):\n    semprot()', 'jumlah_semprot = 3\nfor i in range(jumlah_semprot):\n    semprot()']
                        : ['jumlah_semprot = 3\nfor i in range(jumlah_semprot):\n    semprot()', 'if api_padam:\n    status_bekantan = "aman"', 'if api_padam:\n    status_bekantan = "selamat"\nelse:\n    status_bekantan = "tunggu"'];
                await checkMaterial(titles[challenge - 1], codes[challenge - 1]);
            } else if (level > 1) {
                assert.equal(await page.locator('#material-open').isVisible(), false);
                assert.equal(await page.locator('#hint').isVisible(), false);
                await page.locator('#code-editor').fill('isi');
                assert.equal(await page.locator('#code-suggestions').isVisible(), false);
            }

            if (level === 1) {
                await goTo([null, map.waterAction, map.post1Action, map.post2Action, map.finish][challenge], walkable);
                if (challenge === 1 || challenge === 3) await run(['', 'isi_air = 5', '', 'air_pos = isi_air'][challenge]);
            } else {
                if (challenge === 1 || challenge === 4) {
                    await goTo((challenge === 1 ? map.pump : map.evaluationPump).action, walkable);
                    await run(`isi_air = ${level === 2 ? challenge === 1 ? 6 : 3 : challenge === 1 ? 3 : 4}`);
                }
                if (level === 3 && (challenge === 2 || challenge === 3)) {
                    await goTo(map.habitat, walkable);
                    await run(challenge === 2 ? 'if api_padam:\n    status_bekantan = "aman"'
                        : 'if api_padam:\n    status_bekantan = "selamat"\nelse:\n    status_bekantan = "tunggu"');
                } else {
                    await goTo(map.fires[challenge].action, walkable);
                    let code = level === 2 && challenge === 1 ? 'semprot()\nsemprot()'
                        : level === 2 && challenge === 2 ? 'for i in range(1):\n    semprot()'
                            : `jumlah_semprot = ${level === 3 && challenge === 4 ? 4 : 3}\nfor i in range(jumlah_semprot):\n    semprot()`;
                    if (level === 3 && challenge === 4) code += '\nif api_padam:\n    status_bekantan = "selamat"\nelse:\n    status_bekantan = "tunggu"';
                    await run(code);
                }
                if (challenge === 4) await goTo(map.finish, walkable);
            }
            assert.equal(await page.locator('#code-error').textContent(), '');
        }
        assert.equal(await page.locator('#level-result').isVisible(), true);
        assert.equal(await page.locator('#result-score').textContent(), level === 3 ? '100%' : '95%');
        console.log(`PASS Level ${level}: materi C1–C3, evaluasi, FINISH, kontrol audio, dan hasil`);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: validator memberi feedback, reset mengunci tutorial, tanpa error JavaScript');
} finally {
    await browser.close();
}
