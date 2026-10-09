import test from 'node:test';
import assert from 'node:assert/strict';
import MaterialDialog from '../../resources/js/game/MaterialDialog.js';

function createClassList() {
    const values = new Set();

    return {
        add(value) { values.add(value); },
        remove(value) { values.delete(value); },
        contains(value) { return values.has(value); },
    };
}

function createButton() {
    const listeners = new Map();

    return {
        attributes: new Map(),
        focused: false,
        addEventListener(type, listener) { listeners.set(type, listener); },
        click() { listeners.get('click')?.({ target: this }); },
        focus() { this.focused = true; },
        setAttribute(name, value) { this.attributes.set(name, value); },
        getAttribute(name) { return this.attributes.get(name); },
    };
}

function createFixture() {
    const openButton = createButton();
    const closeButton = createButton();
    const listeners = new Map();
    const dialog = {
        hidden: true,
        addEventListener(type, listener) { listeners.set(type, listener); },
        querySelectorAll() { return [closeButton]; },
        dispatchClick(target) { listeners.get('click')?.({ target }); },
    };
    const page = { inert: false };
    const body = { classList: createClassList() };

    return { openButton, closeButton, dialog, page, body };
}

test('material dialog opens, closes with Escape, and restores focus', () => {
    const fixture = createFixture();
    const controller = new MaterialDialog(fixture);

    fixture.openButton.click();

    assert.equal(fixture.dialog.hidden, false);
    assert.equal(fixture.page.inert, true);
    assert.equal(fixture.body.classList.contains('material-is-open'), true);
    assert.equal(fixture.openButton.getAttribute('aria-expanded'), 'true');
    assert.equal(fixture.closeButton.focused, true);

    let prevented = false;
    controller.handleKeydown({ key: 'Escape', preventDefault() { prevented = true; } });

    assert.equal(prevented, true);
    assert.equal(fixture.dialog.hidden, true);
    assert.equal(fixture.page.inert, false);
    assert.equal(fixture.body.classList.contains('material-is-open'), false);
    assert.equal(fixture.openButton.getAttribute('aria-expanded'), 'false');
    assert.equal(fixture.openButton.focused, true);
});

test('material dialog closes when its backdrop or close button is clicked', () => {
    const fixture = createFixture();
    const controller = new MaterialDialog(fixture);

    controller.open();
    fixture.dialog.dispatchClick(fixture.dialog);
    assert.equal(fixture.dialog.hidden, true);

    controller.open();
    fixture.closeButton.click();
    assert.equal(fixture.dialog.hidden, true);
});
