import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const appCss = readFileSync(new URL('../../resources/css/app.css', import.meta.url), 'utf8');

test('level three story reuses the shared story layout without portrait overrides', () => {
    assert.doesNotMatch(appCss, /\.level-story\[data-level-number=['"]3['"]\]/);
});
