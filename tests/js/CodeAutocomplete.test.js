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
        getAutocompleteMatches(suggestions, 'j').map(({ label }) => label),
        ['jumlah_air = angka'],
    );
});

test('autocomplete replaces only the active line and selects its number', () => {
    const value = 'atas(3)\n  ju';
    const context = getCompletionContext(value, value.length);
    const suggestion = createLevel1Suggestions(2)[4];
    const completion = applyAutocompleteSuggestion(value, context, suggestion);

    assert.equal(completion.value, 'atas(3)\n  jumlah_air = 2');
    assert.equal(completion.value.slice(completion.selectionStart, completion.selectionEnd), '2');
});

test('autocomplete can show every supported Level 1 command', () => {
    const suggestions = createLevel1Suggestions(2);

    assert.equal(getAutocompleteMatches(suggestions, '').length, 6);
    assert.equal(suggestions.at(-1).value, 'semprot(jumlah_air)');
});
