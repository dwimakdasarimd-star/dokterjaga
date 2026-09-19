# Panduan untuk asisten AI

Dokumen ini untuk asisten AI (Claude, ChatGPT, Cursor, Copilot, dll.) yang mengedit repo Dokter Jaga. Baca seluruhnya sebelum mengubah apa pun.

## Konteks

Dokter Jaga adalah situs statis berbahasa Indonesia untuk dokter di IGD dan poliklinik. Penggunanya dokter yang sedang bertugas, sering malam hari dan di ponsel. Kesalahan angka bisa membahayakan pasien.

## Aturan utama

1. **Isi klinis adalah bagian paling sensitif.** Jangan mengubah dosis, ambang skor, rumus, atau langkah algoritma kecuali diminta secara eksplisit. Bila mengubah, cantumkan sumber (pedoman dan tahun) di field `ref` atau `note`, dan sebutkan perubahan tersebut di CHANGELOG.md.
2. **Tetap statis.** Tanpa framework, tanpa bundler, tanpa proses build. JavaScript biasa (tanpa `import`/`export`) agar `index.html` tetap bisa dibuka langsung dari file.
3. **Tidak ada data pasien ke server.** Semua penyimpanan melalui helper `store` (localStorage dengan awalan `dj:`) di `js/app.js`. Jangan menambahkan analytics, pelacak, atau pemanggilan API pihak ketiga yang mengirim input pengguna.
4. **Bahasa antarmuka: Indonesia**, kalimat biasa (bukan huruf kapital semua), istilah medis yang lazim di Indonesia. Angka memakai format `id-ID` (koma desimal) melalui fungsi `fmt()`.
5. **Jalankan `npm test` setelah perubahan** dan pastikan semua uji lolos. Tambahkan uji di `tests/smoke.test.js` untuk kalkulator baru.

## Arsitektur

- `index.html` berisi semua tampilan sebagai `<section class="view" id="v-...">`. Hanya satu yang tampil; navigasi diatur fungsi `go(id)`.
- Data dimuat lebih dulu sebagai `window.DJ` dari `js/data/*.js`, lalu `js/app.js` membacanya (`const DRUGS = DJ.DRUGS;` dst.).
- Semua logika ada dalam satu IIFE di `js/app.js`.

## Resep perubahan umum

**Menambah obat**: tambahkan objek ke `js/data/drugs.js`. Field: `g` (kelompok), `n` (nama), `ind` (indikasi), `r` (rute), `perKg` (mg/kg, atau mL/kg bila `type:'ml'`), `max` (maksimal, atau `null`), `conc` (mg/mL), `note`. Tabel dan pencarian otomatis ikut.

**Menambah skor**: tambahkan objek ke `js/data/scores.js` dengan `id`, `name`, `sub`, `items`, `interp`, `ref`. Item centang: `{t:'chk', l, p}`. Item pilihan: `{t:'sel', l, o:[[label, poin], ...], def}`. `interp(total, st)` mengembalikan `['low'|'mid'|'high', judul, penjelasan]`. Tambahkan juga ke `HOME_COLS` di `js/app.js` bila perlu muncul di beranda.

**Menambah algoritma**: tambahkan objek ke `js/data/algorithms.js` dengan `id`, `title`, `tag:['red'|'amber', label]`, `steps:[[waktu, judul, isi], ...]`, `ref`.

**Menambah kalkulator**:
1. Tambahkan panel di `index.html` dalam `.calc-grid` dengan `id="c-namanya"`; setiap input diberi `data-c="namanya"` dan elemen keluaran `<div class="out" id="...">`.
2. Tambahkan fungsi `namanya()` ke objek `CALC` (lewat `Object.assign(CALC, {...})`) di `js/app.js`. Pengikatan event otomatis melalui atribut `data-c`.
3. Tambahkan entri ke array kalkulator di `INDEX` agar bisa dicari.

**Menambah menu/tampilan baru**: tambahkan `<section class="view" id="v-xxx" hidden>` di `index.html`, entri di `VIEWS` (`js/app.js`), dan ikon `<symbol id="i-xxx">` di sprite SVG. Perhatikan navigasi bawah ponsel memakai `grid-template-columns:repeat(N,1fr)` di `css/style.css`; sesuaikan N.

## Desain

- Warna didefinisikan sebagai token di `:root` (terang) dan diulang untuk mode gelap (`prefers-color-scheme` dan `[data-theme="dark"]`). Pakai token (`var(--scrub)`, dll.), jangan warna langsung.
- Huruf: Barlow Condensed untuk judul dan angka, Atkinson Hyperlegible untuk teks.
- Warna triase dan tingkat risiko: `--red`, `--amber`, `--green` (masing-masing dengan varian `-weak`).
- Tampilan harus tetap berfungsi di lebar 360 px.

## Deploy

Push ke `main` → Vercel otomatis deploy ke https://dokter-jaga.vercel.app. Perbarui tanggal "Terakhir diperbarui" di `index.html` saat isi klinis berubah.
