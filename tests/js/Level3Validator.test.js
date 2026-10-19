import test from 'node:test';
import assert from 'node:assert/strict';
import * as level3 from '../../resources/js/game/Level3Validator.js';
const parse = (code) => level3.validateLevel3(code, 4, 4);
const commands = (code) => { const result = parse(code); assert.equal(result.syntaxValid, true, result.message); return result.actions.commands; };
const evaluation = `if jalur_aman:
    if hewan_terjebak:
        if api_padam:
            selamatkan_hewan()
        else:
            if isi_air >= kebutuhan_air:
                for hitungan in range(kebutuhan_air):
                    semprot()
                if api_padam:
                    selamatkan_hewan()
                else:
                    mundur(1)
            else:
                mundur(1)
    else:
        lanjut_patroli()
else:
    kanan(2)`;
test('accepts nested evaluation and checks every scenario including equal water', () => {
    const ast = commands(evaluation);
    assert.equal(typeof level3.validateLevel3Behavior, 'function');
    assert.equal(level3.validateLevel3Behavior(ast, 'evaluation').valid, true);
    assert.equal(level3.validateLevel3Behavior(commands(evaluation.replace('>=', '>')), 'evaluation').valid, false);
    assert.equal(parse(evaluation).features.hasLoop, true);
});
test('checks route, water, rescue, nested and habitat behavior', () => {
    const examples = {
        route: 'if jalur_aman:\n  maju(3)\nelse:\n  kanan(2)',
        water: 'if isi_air >= kebutuhan_air:\n  for j in range(kebutuhan_air):\n    semprot()\nelse:\n  mundur(1)',
        rescue: 'if api_padam:\n  selamatkan_hewan()\nelse:\n  mundur(1)',
        nested: 'if hewan_terjebak:\n  if api_padam:\n    selamatkan_hewan()\n  else:\n    mundur(1)\nelse:\n  lanjut_patroli()',
        habitat: 'if hewan_terjebak:\n  if api_padam:\n    if jalur_aman:\n      selamatkan_hewan()\n    else:\n      kiri(2)\n  else:\n    mundur(1)\nelse:\n  lanjut_patroli()',
    };
    for (const [kind, code] of Object.entries(examples)) {
        assert.equal(level3.validateLevel3Behavior(commands(code), kind).valid, true, kind);
        assert.equal(level3.validateLevel3Behavior(commands('maju(1)'), kind).valid, false, kind);
    }
});
test('awaits live actions before reevaluating conditions', async () => {
    const state = { isi_air: 1, kebutuhan_air: 1, api_padam: false };
    const actions = [];
    await level3.executeLevel3Program(commands('semprot()\nif api_padam:\n  selamatkan_hewan()'), state, async (action) => {
        await Promise.resolve();
        actions.push(action.type);
        if (action.type === 'spray') { state.isi_air = 0; state.api_padam = true; }
    });
    assert.deepEqual(actions, ['spray', 'branch', 'rescue']);
    assert.equal(state.isi_air, 0);
});
test('simulates water and fire and accepts integer locals and aliases', async () => {
    const state = { isi_air: 0, kebutuhan_air: 2, api_padam: false };
    await level3.executeLevel3Program(commands('isi_air = 5\njumlah = 2\nfor n in range(jumlah):\n  semprot()'), state);
    assert.equal(state.isi_air, 3);
    assert.equal(state.api_padam, true);
    commands('atas(1)\nbawah(1)\nmaju(1)\nmundur(1)');
});
test('rejects unsafe code, malformed hidden branches, world writes and capacity overflow', () => {
    for (const code of ['api_padam = True', 'jalur_aman = 1', 'kebutuhan_air = 1', 'isi_air = 6', 'import os', '__proto__ = 2', 'for isi_air in range(2):\n  semprot()', 'if api_padam:\n  semprot()\nelse:\n  os.system("x")', 'if api_padam\n  semprot()', 'if api_padam:\nsemprot()', 'maju(1);semprot()', 'maju(-1)', 'if api_padam:\n\tsemprot()']) {
        assert.equal(parse(code).syntaxValid, false, code);
    }
});
test('stops bounded execution and fails missing locals without hanging', async () => {
    assert.equal(parse('maju(121)').syntaxValid, false);
    assert.equal(parse('for i in range(120):\n  for j in range(120):\n    maju(1)').syntaxValid, false);
    assert.equal(parse('for i in range(tidak_ada):\n  semprot()').syntaxValid, false);
    await assert.rejects(level3.executeLevel3Program(commands('semprot()'), { isi_air: 0, kebutuhan_air: 2, api_padam: false }), /air/i);
});

test('rejects incorrect decisions even if their live happy path would succeed', () => {
    const wrong = evaluation.replaceAll('mundur(1)', 'semprot()');
    assert.equal(level3.validateLevel3Behavior(commands(wrong), 'evaluation').valid, false);
    const result = level3.validateLevel3Behavior(commands(evaluation.replace('kanan(2)', 'maju(3)')), 'evaluation');
    assert.equal(result.valid, false);
    assert.match(result.message, /Kasus A/);
});
test('stops when scene rejects an action and never executes later commands', async () => {
    const seen = [];
    await assert.rejects(level3.executeLevel3Program(commands('maju(3)\nsemprot()'), {}, (action) => {
        seen.push(action.type);
        return false;
    }), /dihentikan/);
    assert.deepEqual(seen, ['move']);
});
test('runtime budget still bounds locals changed inside a loop', async () => {
    const ast = commands('jumlah = 1\nfor i in range(2):\n  maju(jumlah)\n  jumlah = 120');
    const seen = [];
    await assert.rejects(level3.executeLevel3Program(ast, {}, (action) => { seen.push(action); }), /120/);
    assert.equal(seen.length, 120);
});
