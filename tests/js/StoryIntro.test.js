import test from 'node:test';
import assert from 'node:assert/strict';
import * as storyModule from '../../resources/js/game/StoryIntro.js';

function createFakeTimers() {
    let nextId = 1;
    const callbacks = new Map();

    return {
        schedule(callback) {
            const id = nextId;
            nextId += 1;
            callbacks.set(id, callback);
            return id;
        },
        cancel(id) {
            callbacks.delete(id);
        },
        runNext() {
            const entry = callbacks.entries().next().value;
            assert.ok(entry, 'expected a pending typewriter timer');
            const [id, callback] = entry;
            callbacks.delete(id);
            callback();
        },
        pendingCount() {
            return callbacks.size;
        },
    };
}

test('story text appears one character at a time and completes after the final character', () => {
    assert.equal(typeof storyModule.StoryTypewriter, 'function');
    const timers = createFakeTimers();
    const updates = [];
    let completed = 0;
    const typewriter = new storyModule.StoryTypewriter({
        schedule: timers.schedule,
        cancelSchedule: timers.cancel,
    });

    assert.equal(typewriter.start('Api', (text) => updates.push(text), () => { completed += 1; }), true);
    assert.deepEqual(updates, ['']);

    timers.runNext();
    timers.runNext();
    timers.runNext();

    assert.deepEqual(updates, ['', 'A', 'Ap', 'Api']);
    assert.equal(typewriter.isTyping(), false);
    assert.equal(completed, 1);
});

test('typewriter can reveal the full sentence immediately and cancel pending timers', () => {
    assert.equal(typeof storyModule.StoryTypewriter, 'function');
    const timers = createFakeTimers();
    const updates = [];
    let completed = 0;
    const typewriter = new storyModule.StoryTypewriter({
        schedule: timers.schedule,
        cancelSchedule: timers.cancel,
    });

    typewriter.start('Api', (text) => updates.push(text), () => { completed += 1; });
    timers.runNext();

    assert.equal(typewriter.complete(), true);
    assert.equal(updates.at(-1), 'Api');
    assert.equal(timers.pendingCount(), 0);
    assert.equal(completed, 1);
    assert.equal(typewriter.complete(), false);
});

test('reduced motion displays the complete sentence without scheduling animation', () => {
    assert.equal(typeof storyModule.StoryTypewriter, 'function');
    const timers = createFakeTimers();
    const updates = [];
    let completed = 0;
    const typewriter = new storyModule.StoryTypewriter({
        reducedMotion: true,
        schedule: timers.schedule,
        cancelSchedule: timers.cancel,
    });

    assert.equal(typewriter.start('Api', (text) => updates.push(text), () => { completed += 1; }), false);
    assert.deepEqual(updates, ['Api']);
    assert.equal(timers.pendingCount(), 0);
    assert.equal(completed, 1);
});

test('story action button reflects typing, navigation, and final mission states', () => {
    assert.equal(typeof storyModule.getStoryNextButtonPresentation, 'function');

    assert.deepEqual(storyModule.getStoryNextButtonPresentation({ isTyping: true, isLastSlide: false }), {
        label: 'TAMPILKAN TEKS',
        ariaLabel: 'Tampilkan seluruh teks',
        action: 'reveal',
    });
    assert.deepEqual(storyModule.getStoryNextButtonPresentation({ isTyping: false, isLastSlide: false }), {
        label: 'LANJUT',
        ariaLabel: 'Lanjut ke adegan berikutnya',
        action: 'next',
    });
    assert.deepEqual(storyModule.getStoryNextButtonPresentation({
        isTyping: false,
        isLastSlide: true,
        levelNumber: '2',
    }), {
        label: 'MULAI MISI',
        ariaLabel: 'Mulai misi Level 2',
        action: 'start',
    });
});
