// Uji asap (smoke test): memuat halaman di jsdom lalu memeriksa hasil beberapa kalkulator.
// Jalankan: npm install && npm test
const { JSDOM, ResourceLoader } = require('jsdom');

// Hanya muat file lokal (lewati Google Fonts agar uji bisa jalan offline).
class LocalOnly extends ResourceLoader {
  fetch(url, opts) { return url.startsWith('file:') ? super.fetch(url, opts) : null; }
}
const path = require('path');
const assert = require('assert');

const file = path.join(__dirname, '..', 'index.html');

JSDOM.fromFile(file, { runScripts: 'dangerously', resources: new LocalOnly(), pretendToBeVisual: true, beforeParse(w) {
  w.matchMedia = () => ({ matches: false });
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function () {};
}}).then(dom => {
  const w = dom.window;
  const errors = [];
  w.addEventListener('error', e => errors.push(e.message));
  w.addEventListener('load', () => {
    const d = w.document, $ = s => d.querySelector(s);
    const set = (id, v) => { const e = $('#' + id); e.value = v; e.dispatchEvent(new w.Event('input')); };
    const checks = [];
    const check = (name, fn) => { try { fn(); checks.push(['OK', name]); } catch (e) { checks.push(['GAGAL', name + ': ' + e.message]); } };

    check('Tabel dosis: epinefrin 10 kg = 0,1 mg', () => { set('bw', 10); assert.match($('#doseBody').textContent, /0,1 mg/); });
    check('AGD: asidosis metabolik anion gap tinggi', () => {
      set('agPh', 7.25); set('agCo2', 30); set('agHco3', 12); set('agNa', 140); set('agCl', 100);
      assert.match($('#agOut').textContent, /asidosis metabolik/); assert.match($('#agOut').textContent, /Anion gap 28/);
    });
    check('Vasoaktif: NE 0,1 mcg/kg/mnt 70 kg = 5,3 mL/jam', () => {
      $('[data-vaso="ne"]').click(); set('vsW', 70); assert.match($('#vsOut').textContent, /5,3/);
    });
    check('eGFR terhitung', () => { set('gfrCr', 1); set('gfrAge', 50); assert.match($('#gfrOut').textContent, /mL\/menit/); });
    check('Pediatri: 3 tahun = 14 kg', () => { set('pdAge', 3); assert.match($('#pdOut').textContent, /14 kg/); });
    check('NEWS2 tampil', () => { d.querySelector('[data-s="news2"]').click(); assert.match($('#verdict').textContent, /Risiko rendah/); });
    check('Pencarian menemukan stroke', () => { set('q', 'stroke'); assert.match($('#results').textContent, /Stroke akut/); });

    check('Home dashboard tampil', () => {
      assert.match($('#homeGrid').textContent, /Di IGD/);
      assert.match($('#quickTools').textContent, /Dosis obat IGD/);
      assert.match($('#toolCount').textContent, /\d+/);
    });
    check('Tidak ada error JavaScript', () => assert.deepStrictEqual(errors, []));

    checks.forEach(([s, n]) => console.log(`${s.padEnd(6)} ${n}`));
    const failed = checks.filter(c => c[0] !== 'OK').length;
    console.log(failed ? `\n${failed} uji gagal.` : '\nSemua uji lolos.');
    process.exit(failed ? 1 : 0);
  });
});
