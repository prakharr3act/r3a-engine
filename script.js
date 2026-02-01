"use strict";

const state = {
    app: document.getElementById('app'),
    loader: document.getElementById('loader'),
    sidebar: document.getElementById('sidebar'),
    timer: document.getElementById('footer-timer')
};

function openTab(id, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    if (window.innerWidth <= 1024) toggleMenu(false);
    window.scrollTo(0, 0);
}

function toggleMenu(force) {
    if (force === false) state.sidebar.classList.remove('show');
    else state.sidebar.classList.toggle('show');
}

const R3A_Engine = {
    hash: (str) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
        return Math.abs(h).toString(36);
    },
    mix: (t, k) => {
        let s = '';
        for (let i = 0; i < t.length; i++) {
            s += String.fromCharCode(t.charCodeAt(i) + (k.charCodeAt(i % k.length) % 17));
        }
        return btoa(s);
    },
    unmix: (t, k) => {
        let r = atob(t), s = '';
        for (let i = 0; i < r.length; i++) {
            s += String.fromCharCode(r.charCodeAt(i) - (k.charCodeAt(i % k.length) % 17));
        }
        return s;
    }
};

function encrypt() {
    const p = document.getElementById('plain').value;
    const k = document.getElementById('key').value;
    const out = document.getElementById('encrypted');
    
    if (!p || !k) return alert('Input and Key required');
    
    const payload = R3A_Engine.mix(p, k);
    const sum = R3A_Engine.hash(payload + k);
    out.value = `R3A|v1|${sum}|${payload}`;
}

function decrypt() {
    const c = document.getElementById('cipher').value;
    const k = document.getElementById('dkey').value;
    const out = document.getElementById('decrypted');
    
    try {
        if (!c.startsWith('R3A|')) throw 0;
        const [, v, sum, p] = c.split('|');
        if (v !== 'v1' || R3A_Engine.hash(p + k) !== sum) throw 0;
        out.value = R3A_Engine.unmix(p, k);
    } catch {
        alert('Decryption failed: Invalid data or key');
    }
}

function safeCopy(id) {
    const el = document.getElementById(id);
    if (!el.value) return;
    navigator.clipboard.writeText(el.value).then(() => {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = originalText, 2000);
    });
}

function downloadText() {
    const val = document.getElementById('encrypted').value;
    if (!val) return;
    const b = new Blob([val], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = 'secure_data.r3a';
    a.click();
}

function checkStrength(v) {
    const m = document.getElementById('strength');
    m.className = 'meter';
    if (!v) return;
    if (v.length < 6 || /(.)\1{2,}/.test(v)) m.classList.add('weak');
    else if (v.length < 10) m.classList.add('medium');
    else m.classList.add('strong');
}

function startClock() {
    setInterval(() => {
        const t = new Date();
        state.timer.textContent = t.toTimeString().split(' ')[0];
    }, 1000);
}

window.addEventListener('load', () => {
    startClock();
    state.loader.style.opacity = '0';
    setTimeout(() => state.loader.style.display = 'none', 400);
});
