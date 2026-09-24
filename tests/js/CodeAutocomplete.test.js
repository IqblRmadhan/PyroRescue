import test from 'node:test';
import assert from 'node:assert/strict';
import {
    applyAutocompleteSuggestion,
    createLevel1Suggestions,
    getAutocompleteMatches,
    getCompletionContext,
} from '../../resources/js/game/CodeAutocomplete.js';

test('autocomplete filters commands from the current prefix', () => {
    const suggestions = createLevel1Suggestions(2);

    assert.deepEqual(
        getAutocompleteMatches(suggestions, 'ka').map(({ label }) => label),
        ['kanan(angka)'],
    );
    assert.deepEqual(
        getAutocompleteMatches(suggestions, 'is').map(({ label }) => label),
        ['isi_air = angka'],
    );
});

test('autocomplete replaces only the active line and selects its number', () => {
    const value = 'atas(3)\n  is';
    const context = getCompletionContext(value, value.length);
    const suggestion = createLevel1Suggestions(2)[4];
    const completion = applyAutocompleteSuggestion(value, context, suggestion);

    assert.equal(completion.value, 'atas(3)\n  isi_air = 2');
    assert.equal(completion.value.slice(completion.selectionStart, completion.selectionEnd), '2');
});

test('autocomplete can show every supported Level 1 command', () => {
    const suggestions = createLevel1Suggestions(2);

    assert.equal(getAutocompleteMatches(suggestions, '').length, 5);
    assert.deepEqual(
        suggestions.slice(0, 2).map(({ value }) => value),
        ['atas(1)', 'bawah(1)'],
    );
    assert.equal(suggestions.at(-1).value, 'isi_air = 2');
    assert.equal(suggestions[0].description.includes('ke atas'), true);
    assert.equal(suggestions[0].example, 'atas(3)');
    assert.equal(suggestions[0].parameter, 'angka');
});

test('Challenge 3 autocomplete offers variable transfer instead of a new water value', () => {
    const suggestions = createLevel1Suggestions(5, 3);

    assert.equal(suggestions.length, 5);
    assert.equal(suggestions.at(-1).value, 'air_pos_2 = isi_air');
    assert.equal(suggestions.at(-1).kind, 'Assignment variabel');
    assert.equal(suggestions.at(-1).example, 'air_pos_2 = isi_air');
    assert.equal(suggestions.some(({ value }) => value.startsWith('isi_air =')), false);
});

test('every movement keeps its direction, example and editable step number', () => {
    const suggestions = createLevel1Suggestions();
    const directions = ['atas', 'bawah', 'kanan', 'kiri'];
    const examples = ['atas(3)', 'bawah(2)', 'kanan(4)', 'kiri(2)'];

    for (const [index, direction] of directions.entries()) {
        const suggestion = suggestions[index];
        const completion = applyAutocompleteSuggestion('', getCompletionContext('', 0), suggestion);
        assert.equal(suggestion.label, `${direction}(angka)`);
        assert.equal(suggestion.example, examples[index]);
        assert.equal(completion.value, `${direction}(1)`);
        assert.equal(completion.value.slice(completion.selectionStart, completion.selectionEnd), '1');
    }
});

test('completion preserves neighbouring lines and indentation in the middle of code', () => {
    const code = 'atas(3)\n  ka\nbawah(2)';
    const caret = code.indexOf('ka') + 2;
    const suggestion = getAutocompleteMatches(createLevel1Suggestions(), 'ka')[0];
    const completion = applyAutocompleteSuggestion(code, getCompletionContext(code, caret), suggestion);

    assert.equal(completion.value, 'atas(3)\n  kanan(1)\nbawah(2)');
    assert.equal(completion.value.slice(completion.selectionStart, completion.selectionEnd), '1');
});

test('assignment completion selects the whole number, including multiple digits', () => {
    const suggestion = createLevel1Suggestions(12)[4];
    const completion = applyAutocompleteSuggestion('is', getCompletionContext('is', 2), suggestion);

    assert.equal(completion.value, 'isi_air = 12');
    assert.equal(completion.value.slice(completion.selectionStart, completion.selectionEnd), '12');
});

test('autocomplete does not suggest commands after an argument or unsupported syntax', () => {
    for (const query of ['atas(', 'isi_air =', 'ka1', 'print(', 'tidak_ada']) {
        assert.deepEqual(getAutocompleteMatches(createLevel1Suggestions(), query), []);
    }
});
