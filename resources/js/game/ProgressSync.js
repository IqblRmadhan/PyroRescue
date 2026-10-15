// Antrean menjaga urutan challenge ketika pemain melanjutkan sebelum respons sebelumnya tiba.
export default class ProgressSync {
    constructor({ url, token, level, onStatus, onSaved }) {
        Object.assign(this, { url, token, level, onStatus, onSaved });
        this.pending = new Set();
        this.running = null;
    }

    save(challenge) {
        this.pending.add(challenge);
        return this.flush();
    }

    flush() {
        if (this.running) return this.running;
        this.running = this.sendPending().finally(() => { this.running = null; });
        return this.running;
    }

    async sendPending() {
        this.onStatus('saving');
        try {
            while (this.pending.size) {
                const challenge = this.pending.values().next().value;
                const response = await fetch(this.url, {
                    method: 'POST', keepalive: true,
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': this.token },
                    body: JSON.stringify({ level: this.level, challenge }),
                });
                if (!response.ok) throw new Error('Progres belum tersimpan.');
                const data = await response.json();
                if (!data.saved) throw new Error('Sesi akun tidak aktif.');
                this.pending.delete(challenge);
                this.onSaved?.(data);
            }
            this.onStatus('saved');
            return true;
        } catch {
            this.onStatus('error');
            return false;
        }
    }
}
