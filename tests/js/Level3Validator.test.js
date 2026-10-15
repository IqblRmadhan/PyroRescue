import test from 'node:test';
import assert from 'node:assert/strict';
import CodeValidator from '../../resources/js/game/CodeValidator.js';
import { resolveBekantanStatus } from '../../resources/js/game/Level3Validator.js';
import { createLevel3Suggestions } from '../../resources/js/game/CodeAutocomplete.js';
import { getGuideInstruction, explainExecutedCommands } from '../../resources/js/game/MissionGuide.js';

const validator = new CodeValidator();
const loop = (count) => `jumlah_semprot = ${count}\nfor i in range(jumlah_semprot):\n    semprot()`;
const branch = 'if api_padam:\n    status_bekantan = "selamat"\nelse:\n    status_bekantan = "tunggu"';
const validate = (code, challenge = 4) => validator.validateConditional(code, challenge === 4 ? 4 : 3, challenge);

test('Level 3 accepts the module solutions and keeps runtime branch after sprays', () => {
    assert.equal(validate(loop(3), 1).conceptValid, true);
    assert.equal(validate('if api_padam:\n    status_bekantan = "aman"', 2).conceptValid, true);
    assert.equal(validate(branch, 3).conceptValid, true);
    const result = validate(`isi_air = 4\nbawah(7)\n${loop(4)}\n${branch}\nbawah(1)`);
    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    const commands = result.actions.commands;
    assert.equal(commands[0].type, 'setWater');
    assert.equal(commands.filter((command) => command.type === 'spray').length, 4);
    assert.deepEqual(commands.at(-2), { type: 'conditional', whenTrue: 'selamat', whenFalse: 'tunggu', evaluationCountValid: true });
    assert.equal(commands.at(-1).type, 'move');
    assert.equal(result.missionSuccess, false, 'only the live scene can establish success');
});

test('both branches use real fire state and if without else preserves existing status', () => {
    const command = validate(branch, 3).actions.commands[0];
    assert.equal(resolveBekantanStatus(command, true, 'tunggu'), 'selamat');
    assert.equal(resolveBekantanStatus(command, false, 'aman'), 'tunggu');
    assert.equal(resolveBekantanStatus({ whenTrue: 'aman', whenFalse: null }, false, 'tunggu'), 'tunggu');
    assert.equal(validate(`${loop(2)}\n${branch}`).conceptValid, true, 'too few sprays must reach the False branch');
});

test('evaluation checks jumlah_semprot = 4, not only the expanded spray total', () => {
    const result = validate(`jumlah_semprot = 2\nfor i in range(jumlah_semprot):\n    semprot()\n    semprot()\n${branch}`);
    assert.equal(result.actions.sprayCount, 4);
    assert.equal(result.actions.commands.at(-1).evaluationCountValid, false);
    assert.equal(validate(`${loop(4)}\n${branch}`).actions.commands.at(-1).evaluationCountValid, true);
});

test('movement and pump runs do not require the full mission program', () => {
    for (const challenge of [1, 2, 3, 4]) {
        assert.equal(validate('kanan(2)\nbawah(1)', challenge).conceptValid, true);
    }
    assert.equal(validate('isi_air = 4').conceptValid, true);
});

test('checks concept in both branches and rejects attempts to skip integration', () => {
    for (const code of [
        'semprot()\nsemprot()\nsemprot()',
        'for i in range(3):\n    semprot()',
    ]) assert.equal(validate(code, 1).conceptValid, false, code);
    assert.equal(validate('status_bekantan = "aman"', 2).syntaxValid, false);
    assert.equal(validate('if api_padam:\n    status_bekantan = "selamat"', 3).conceptValid, false);
    assert.equal(validate(branch.replace('"tunggu"', '"selamat"'), 3).conceptValid, false);
    assert.equal(validate(branch).conceptValid, false);
    assert.equal(validate(loop(4)).conceptValid, false);
    assert.equal(validate(`${branch}\n${loop(4)}`).conceptValid, false);
    assert.equal(validate(`${loop(4)}\n${branch}\n${branch}`).conceptValid, false);
});

test('unsafe syntax, fake conditions, bad indentation and oversized programs return no actions', () => {
    for (const code of [
        'api_padam = True', 'api_padam = "True"', 'import os', '__import__("os").system("echo test")',
        'exec("print(1)")', 'if True:\n    status_bekantan = "selamat"',
        'if api_padam = True:\n    status_bekantan = "aman"',
        'if api_padam\n    status_bekantan = "aman"', 'else:\n    status_bekantan = "tunggu"',
        'if api_padam:\nstatus_bekantan = "aman"',
        'if api_padam:\n    status_bekantan = "selamat"\nelse:\n  status_bekantan = "tunggu"',
        'if api_padam:\n    import os', 'kanan(121)', 'kanan(9007199254740992)', 'isi_air = 7',
        'for i in range(jumlah_semprot):\n    semprot()',
        'jumlah_semprot = 3\nfor api_padam in range(jumlah_semprot):\n    semprot()',
        'jumlah_semprot = 120\nfor i in range(jumlah_semprot):\n    semprot()\n    semprot()',
        'kanan(1)\n'.repeat(121),
    ]) {
        const result = validate(code);
        assert.equal(result.syntaxValid, false, code);
        assert.equal(result.actions, null, code);
    }
});

test('comments, CRLF, single quotes, and consistent indentation are supported', () => {
    const code = `# evaluasi\r\n${loop(4)}\n\n${branch}`.replaceAll('"', "'");
    assert.equal(validate(code).conceptValid, true);
});

test('Level 3 teaching and evaluation match the current state', () => {
    assert.match(getGuideInstruction({ levelNumber: 3, challengeNumber: 2, state: { atHabitat: true } }), /aman/);
    assert.match(getGuideInstruction({ levelNumber: 3, challengeNumber: 3, state: { atHabitat: true } }), /tunggu/);
    assert.deepEqual(createLevel3Suggestions(4, 4), []);
    assert.deepEqual(explainExecutedCommands({ levelNumber: 3, challengeNumber: 4, commands: [{ type: 'spray' }] }), []);
    for (const challenge of [1, 2, 3]) {
        for (const suggestion of createLevel3Suggestions(3, challenge)) {
            assert.ok(!suggestion.value.includes('isi_air = 6'));
        }
    }
});
