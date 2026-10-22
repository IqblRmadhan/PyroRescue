import test from 'node:test';
import assert from 'node:assert/strict';
import GameSettingsMenu from '../../resources/js/game/GameSettingsMenu.js';

function createEventTarget() {
    const listeners = new Map();

    return {
        addEventListener(type, listener) { listeners.set(type, listener); },
        dispatch(type, event) { listeners.get(type)?.(event); },
    };
}

function createFixture() {
    const toggleListeners = new Map();
    const toggleButton = {
        attributes: new Map(),
        focused: false,
        addEventListener(type, listener) { toggleListeners.set(type, listener); },
        click() { toggleListeners.get('click')?.({ target: this }); },
        focus() { this.focused = true; },
        setAttribute(name, value) { this.attributes.set(name, value); },
        getAttribute(name) { return this.attributes.get(name); },
    };
    const menu = { hidden: true };
    const container = {
        contains(target) { return target === toggleButton || target === menu; },
    };
    const documentRoot = createEventTarget();
    const eventTarget = createEventTarget();

    return { toggleButton, menu, container, documentRoot, eventTarget };
}

test('settings menu toggles from its button and updates accessibility state', () => {
    const fixture = createFixture();
    new GameSettingsMenu(fixture);

    fixture.toggleButton.click();
    assert.equal(fixture.menu.hidden, false);
    assert.equal(fixture.toggleButton.getAttribute('aria-expanded'), 'true');

    fixture.toggleButton.click();
    assert.equal(fixture.menu.hidden, true);
    assert.equal(fixture.toggleButton.getAttribute('aria-expanded'), 'false');
});

test('settings menu closes on outside click or Escape and restores focus', () => {
    const fixture = createFixture();
    new GameSettingsMenu(fixture);

    fixture.toggleButton.click();
    fixture.documentRoot.dispatch('pointerdown', { target: {} });
    assert.equal(fixture.menu.hidden, true);

    fixture.toggleButton.click();
    let prevented = false;
    fixture.eventTarget.dispatch('keydown', {
        key: 'Escape',
        preventDefault() { prevented = true; },
    });

    assert.equal(prevented, true);
    assert.equal(fixture.menu.hidden, true);
    assert.equal(fixture.toggleButton.focused, true);
});
