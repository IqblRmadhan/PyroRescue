// Gesture hanya ditangani di canvas agar scroll pada editor tetap normal.
export function enableMapCameraControls(scene, map) {
    const camera = scene.cameras.main;
    const canvas = scene.game.canvas;
    let drag = null;

    function limitZoom(zoom) {
        const minimum = Math.min(camera.width / map.width, camera.height / map.height, 1.15);
        return Math.max(minimum, Math.min(2.5, zoom));
    }

    function updateBounds() {
        // Saat seluruh map terlihat, ruang kosong di kedua sisi dibuat seimbang.
        const width = Math.max(map.width, camera.width / camera.zoom);
        const height = Math.max(map.height, camera.height / camera.zoom);
        camera.setBounds((map.width - width) / 2, (map.height - height) / 2, width, height);
        camera.setScroll(camera.clampX(camera.scrollX), camera.clampY(camera.scrollY));
    }

    function pan(deltaX, deltaY) {
        camera.stopFollow();
        camera.setScroll(
            camera.clampX(camera.scrollX + deltaX / camera.zoom),
            camera.clampY(camera.scrollY + deltaY / camera.zoom),
        );
    }

    function onWheel(event) {
        event.preventDefault();
        const bounds = canvas.getBoundingClientRect();
        const scaleX = scene.scale.width / bounds.width;
        const scaleY = scene.scale.height / bounds.height;
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1;

        // Pinch touchpad dikirim browser sebagai wheel dengan ctrlKey.
        if (event.ctrlKey || event.metaKey) {
            camera.stopFollow();
            const previousZoom = camera.zoom;
            const zoom = limitZoom(previousZoom * Math.exp(-event.deltaY * unit * 0.01));
            const x = (event.clientX - bounds.left) * scaleX - camera.x - camera.width / 2;
            const y = (event.clientY - bounds.top) * scaleY - camera.y - camera.height / 2;
            camera.setZoom(zoom);
            // Pertahankan titik dunia di bawah kursor selama zoom.
            camera.setScroll(
                camera.scrollX + x * (1 / previousZoom - 1 / zoom),
                camera.scrollY + y * (1 / previousZoom - 1 / zoom),
            );
            updateBounds();
            return;
        }

        pan(event.deltaX * unit * scaleX, event.deltaY * unit * scaleY);
    }

    function onPointerDown(event) {
        if (event.button !== 0 || !event.isPrimary) return;
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = 'grabbing';
    }

    function onPointerMove(event) {
        if (!drag || drag.id !== event.pointerId) return;
        const bounds = canvas.getBoundingClientRect();
        pan(
            (drag.x - event.clientX) * scene.scale.width / bounds.width,
            (drag.y - event.clientY) * scene.scale.height / bounds.height,
        );
        drag.x = event.clientX;
        drag.y = event.clientY;
    }

    function stopDrag() {
        const pointerId = drag?.id;
        drag = null;
        if (pointerId !== undefined && canvas.hasPointerCapture(pointerId)) {
            canvas.releasePointerCapture(pointerId);
        }
        canvas.style.cursor = 'grab';
    }

    function onResize() {
        camera.setZoom(limitZoom(camera.zoom));
        updateBounds();
    }

    canvas.style.cursor = 'grab';
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('lostpointercapture', stopDrag);
    scene.scale.on('resize', onResize);
    onResize();

    scene.events.once('shutdown', () => {
        stopDrag();
        canvas.style.cursor = '';
        canvas.removeEventListener('wheel', onWheel);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', stopDrag);
        canvas.removeEventListener('pointercancel', stopDrag);
        canvas.removeEventListener('lostpointercapture', stopDrag);
        scene.scale.off('resize', onResize);
    });
}
