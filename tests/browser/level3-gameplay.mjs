import assert from 'node:assert/strict';
import { level3Map as map, isLevel3Walkable } from '../../resources/js/game/Level3Map.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const origin = process.env.GAME_URL ?? 'http://127.0.0.1:8765';
const state = () => page.evaluate(() => window.pyroGame.scene.getScene('Level3Scene').mission.snapshot());
async function dismiss() {
    for (let i = 0; await page.locator('#feedback').evaluate(el => el.open); i++) {
        assert.ok(i < 30);
        await page.locator('#feedback-ok').click();
    }
}
async function run(code, expectError = false) {
    await dismiss();
    await page.locator('#code-editor').fill(code);
    await page.locator('#run-code').click();
    await page.waitForFunction(() => document.querySelector('#feedback').open || !document.querySelector('#run-code').disabled || !document.querySelector('#level-result').hidden);
    const error = await page.locator('#code-error').textContent();
    if (expectError) assert.ok(error, 'Expected rejected program');
    else assert.equal(error, '', code);
    await dismiss();
    console.log('RUN', code.split('\n')[0], JSON.stringify(await state()));
}
function route(start, target) {
    const queue = [{ ...start, commands: [] }], seen = new Set();
    for (let index = 0; index < queue.length; index++) {
        const current = queue[index];
        if (current.column === target.column && current.row === target.row) return current.commands.join('\n');
        for (const [name, dx, dy] of [['kanan',1,0],['kiri',-1,0],['atas',0,-1],['bawah',0,1]]) {
            const column = current.column + dx, row = current.row + dy, key = `${column},${row}`;
            if (seen.has(key) || !isLevel3Walkable(column,row)) continue;
            seen.add(key); queue.push({ column,row,commands:[...current.commands, `${name}(1)`] });
        }
    }
    throw Error('No route');
}
async function go(target) {
    const code = route(await state(), target);
    if (code) await run(code);
}
async function debugTeleport(target) {
    await dismiss();
    const position = await page.evaluate(({ column, row }) => {
        const scene = window.pyroGame.scene.getScene('Level3Scene');
        const camera = scene.cameras.main;
        const bounds = scene.game.canvas.getBoundingClientRect();
        const worldX = column * 40 + 20, worldY = row * 40 + 20;
        return {
            x: (worldX - camera.worldView.x) * camera.zoom * bounds.width / scene.scale.width,
            y: (worldY - camera.worldView.y) * camera.zoom * bounds.height / scene.scale.height,
        };
    }, target);
    await page.locator('#game-container canvas').click({ position, modifiers: ['Control'] });
    await page.waitForFunction(({ column, row }) => {
        const scene = window.pyroGame.scene.getScene('Level3Scene');
        return scene.playerColumn === column && scene.playerRow === row;
    }, target);
    assert.equal(await page.locator('#feedback').evaluate(element => element.open), true,
        'debug teleport keeps the travel guidance visible');
    await dismiss();
}
const routeCode = 'if jalur_aman:\n    maju(3)\nelse:\n    kanan(2)';
const waterCode = 'if isi_air >= kebutuhan_air:\n    for i in range(kebutuhan_air):\n        semprot()\nelse:\n    mundur(1)';
const nestedCode = 'if hewan_terjebak:\n    if api_padam:\n        selamatkan_hewan()\n    else:\n        mundur(1)\nelse:\n    lanjut_patroli()';
const habitatCode = 'if hewan_terjebak:\n    if api_padam:\n        if jalur_aman:\n            selamatkan_hewan()\n        else:\n            kiri(2)\n    else:\n        mundur(1)\nelse:\n    lanjut_patroli()';
const evaluationCode = 'if jalur_aman:\n    if hewan_terjebak:\n        if api_padam:\n            selamatkan_hewan()\n        else:\n            if isi_air >= kebutuhan_air:\n                for i in range(kebutuhan_air):\n                    semprot()\n                if api_padam:\n                    selamatkan_hewan()\n                else:\n                    mundur(1)\n            else:\n                mundur(1)\n    else:\n        lanjut_patroli()\nelse:\n    kanan(2)';
try {
    await page.goto(`${origin}/login`);
    await page.getByRole('button', { name: 'Main sebagai Tamu' }).click();
    await page.waitForURL('**/main-menu');
    await page.goto(`${origin}/game/3`);
    await page.locator('#story-skip').waitFor({ state: 'visible' });
    await page.screenshot({ path: 'storage/app/level3-commander.png' });
    await page.locator('#story-next').click();
    await page.screenshot({ path: 'storage/app/level3-player.png' });
    await page.locator('#story-skip').click();
    await page.waitForFunction(() => window.pyroGame?.scene.getScene('Level3Scene')?.player);
    await page.waitForFunction(() => document.querySelector('#feedback').open);
    await page.screenshot({ path: 'storage/app/level3-briefing.png' });
    await page.evaluate(() => {
        const scene = window.pyroGame.scene.getScene('Level3Scene');
        scene.tweens.timeScale = 10; scene.anims.globalTimeScale = 10; scene.time.timeScale = 10;
    });
    assert.equal(await page.locator('#target-list').evaluate(element => getComputedStyle(element).display), 'grid');
    assert.equal(await page.evaluate(() => window.pyroGame.scene.getScene('Level3Scene').children.list
        .filter(child => child.texture?.key === 'waterPump').length), 1);
    assert.deepEqual(await page.evaluate(() => {
        const scene = window.pyroGame.scene.getScene('Level3Scene');
        return {
            pump: [scene.pumpMarker.texture.key, scene.pumpMarker.x, scene.pumpMarker.y, scene.pumpMarker.visible],
            crossing: [scene.routeMarker.texture.key, scene.routeMarker.x, scene.routeMarker.y, scene.routeMarker.visible],
            fog: scene.routeFog.visible,
        };
    }), { pump: ['waterPumpAction', 900, 740, true], crossing: ['actionMarker', 980, 740, true], fog: true });
    await debugTeleport({ column: 14, row: 18 });
    assert.equal(await page.locator('#hud-water').isHidden(), true);
    await go(map.post); await go(map.pump.action); await run('isi_air = 4');
    await go(map.crossing); await run(routeCode);
    assert.equal(await page.evaluate(() => window.pyroGame.scene.getScene('Level3Scene').routeFog.visible), false);
    await go(map.fires[1].action); await run('for i in range(2):\n    semprot()');
    await run('if api_padam:\n    selamatkan_hewan()\nelse:\n    mundur(1)');
    assert.equal((await state()).rescued.length, 0);
    await go(map.post); assert.equal((await state()).challenge, 2);
    await go(map.tower); await go(map.fires[2].action);
    await run(waterCode.replace('>=', '>'), true);
    await run(waterCode); await go(map.evaluationPump.action); await run('isi_air = 5');
    await page.locator('#reset').click();
    await page.waitForFunction(() => document.querySelector('#feedback').open || !document.querySelector('#run-code').disabled);
    await dismiss();
    assert.equal((await state()).water, 5); assert.deepEqual((await state()).rescued, [1]);
    await go(map.fires[2].action); await run(waterCode); await run(nestedCode);
    await go(map.post); assert.equal((await state()).challenge, 3);
    await go(map.northWatch); await run(routeCode);
    assert.equal((await state()).step, 3);
    await go(map.fires[4].action); await run(habitatCode);
    await go(map.evaluationPump.action); await run('isi_air = 5');
    await go(map.evaluationStart); assert.equal((await state()).challenge, 4);
    assert.deepEqual((await state()).rescued, [1,2]);
    await go(map.fires[4].action);
    await run('for i in range(4):\n    semprot()\nselamatkan_hewan()', true);
    assert.equal((await state()).sprays[4], 0, 'Reject before mutating live state');
    await run(evaluationCode); await go(map.post); await go(map.finish);
    assert.equal(await page.locator('#level-result').isVisible(), true);
    assert.equal((await state()).rescued.length, 3);
    await page.screenshot({ path: 'storage/app/level3-complete.png' });
    assert.deepEqual(errors, []);
    console.log('PASS all Level 3 missions, safety decisions, reset, escort, evaluation and finish');
} finally { await browser.close(); }
