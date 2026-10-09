import test from 'node:test';
import assert from 'node:assert/strict';
import * as mapLabels from '../../resources/js/game/PumpLabel.js';

test('map labels stay readable when the camera zooms out', () => {
    assert.equal(typeof mapLabels.getMapLabelScale, 'function');
    assert.equal(mapLabels.getMapLabelScale(1.15), 1);
    assert.equal(mapLabels.getMapLabelScale(0.5), 2);
    assert.equal(mapLabels.getMapLabelScale(0.4), 2.5);
    assert.equal(mapLabels.getMapLabelScale(0.2), 5);
});

test('map label categories share typography but keep distinct colors', () => {
    assert.equal(typeof mapLabels.getMapLabelTheme, 'function');

    const pump = mapLabels.getMapLabelTheme('pump');
    const post = mapLabels.getMapLabelTheme('post');
    const fire = mapLabels.getMapLabelTheme('fire');

    assert.notEqual(pump.backgroundColor, fire.backgroundColor);
    assert.notEqual(pump.borderColor, fire.borderColor);
    assert.notEqual(pump.backgroundColor, post.backgroundColor);
    assert.doesNotMatch(pump.fontFamily, /PixelFont/i);
    assert.equal(pump.fontFamily, fire.fontFamily);
    assert.equal(pump.fontFamily, post.fontFamily);
});

test('label board geometry ends in a centered downward pointer', () => {
    assert.equal(typeof mapLabels.getPointerLabelGeometry, 'function');

    const geometry = mapLabels.getPointerLabelGeometry(100);

    assert.deepEqual(geometry.board, { x: -61, y: -38, width: 122, height: 30 });
    assert.deepEqual(geometry.pointer, [-7, -8, 7, -8, 0, 0]);
    assert.equal(geometry.textY, -23);
});

test('top-edge label can sit below its target with an upward pointer', () => {
    const geometry = mapLabels.getPointerLabelGeometry(100, 'below');

    assert.deepEqual(geometry.board, { x: -61, y: 8, width: 122, height: 30 });
    assert.deepEqual(geometry.pointer, [-7, 8, 7, 8, 0, 0]);
    assert.equal(geometry.textY, 23);
});

test('pump label points to the visual center of the pump body', () => {
    assert.equal(typeof mapLabels.getPumpLabelPosition, 'function');
    assert.deepEqual(
        mapLabels.getPumpLabelPosition(620, 180),
        { x: 620, y: 138 },
    );
});

test('post labels use the shared pointer-board geometry', () => {
    const graphicsList = [];
    const createGraphics = () => {
        const graphics = {
            roundedRectangles: [],
            clear() {
                this.roundedRectangles = [];
                return this;
            },
            fillStyle(color) {
                this.color = color;
                return this;
            },
            fillRoundedRect(x, y, width, height, radius) {
                this.roundedRectangles.push({ x, y, width, height, radius, color: this.color });
                return this;
            },
            lineStyle() {
                return this;
            },
            strokeRoundedRect() {
                return this;
            },
            fillTriangle() {
                return this;
            },
        };
        graphicsList.push(graphics);
        return graphics;
    };
    const scene = {
        add: {
            graphics: createGraphics,
            text(x, y, text, style) {
                return {
                    width: text.length * 10,
                    style,
                    setOrigin() { return this; },
                    setY() { return this; },
                    setColor() { return this; },
                    setStroke() { return this; },
                    setText(nextText) {
                        this.width = nextText.length * 10;
                        return this;
                    },
                };
            },
            container(x, y) {
                return {
                    x,
                    y,
                    setDepth() { return this; },
                    setScale() { return this; },
                };
            },
        },
    };

    assert.equal(typeof mapLabels.addPostLabel, 'function');
    mapLabels.addPostLabel(scene, 100, 200, 'POS 1');

    assert.deepEqual(graphicsList[0].roundedRectangles[0], {
        x: -54,
        y: -38,
        width: 108,
        height: 30,
        radius: 6,
        color: mapLabels.getMapLabelTheme('post').backgroundColor,
    });
});
