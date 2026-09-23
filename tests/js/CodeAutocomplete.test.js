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
    const value = 'maju(3)\n  is';
    const context = getCompletionContext(value, value.length);
    const suggestion = createLevel1Suggestions(2)[4];
    const completion = applyAutocompleteSuggestion(value, context, suggestion);

    assert.equal(completion.value, 'maju(3)\n  isi_air = 2');
    assert.equal(completion.value.slice(completion.selectionStart, completion.selectionEnd), '2');
});

test('autocomplete can show every supported Level 1 command', () => {
    const suggestions = createLevel1Suggestions(2);

    assert.equal(getAutocompleteMatches(suggestions, '').length, 5);
    assert.equal(suggestions.at(-1).value, 'isi_air = 2');
});

test('Challenge 3 autocomplete offers variable transfer instead of a new water value', () => {
    const suggestions = createLevel1Suggestions(5, 3);

    assert.equal(suggestions.length, 5);
    assert.equal(suggestions.at(-1).value, 'air_pos_2 = isi_air');
    assert.equal(suggestions.some(({ value }) => value.startsWith('isi_air =')), false);
});
