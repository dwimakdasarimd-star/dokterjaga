# Dokter Jaga

Platform web untuk dokter jaga di IGD dan poliklinik: dosis obat berbasis berat badan, skor klinis, kalkulator klinis, analisis gas darah, pediatri, algoritma kegawatdaruratan, serta catatan serah terima dan SOAP.

Situs live: https://dokter-jaga.vercel.app

## Fitur

- **Dosis obat IGD**: 16 obat (resusitasi, alergi, neurologi, cairan, analgesik) dengan batas dosis maksimal dan konsentrasi sediaan yang bisa diubah.
- **Skor klinis**: GCS, NEWS2, qSOFA, CURB-65, HEART, Wells PE, PERC, Wells DVT, Alvarado, McIsaac, CHA₂DS₂-VASc, HAS-BLED.
- **Kalkulator**: analisis gas darah, infus vasoaktif, IMT, eGFR CKD-EPI 2021, Cockcroft–Gault, koreksi elektrolit, defisit air bebas, QTc, usia kehamilan, trombolisis stroke, konversi satuan, MAP, Parkland, Holliday–Segar, tetesan infus.
- **Pediatri**: kartu resusitasi dari usia, tanda vital normal, rehidrasi diare WHO.
- **Algoritma**: henti jantung, anafilaksis, status epileptikus, sepsis, hipoglikemia, SKA, stroke, hiperkalemia, asma.
- **Catatan jaga**: daftar serah terima pasien per triase dan penyusun catatan SOAP. Data hanya tersimpan di peramban pengguna (localStorage), tidak dikirim ke server.

## Struktur

```
index.html            Kerangka halaman (semua tampilan/menu)
css/style.css         Semua gaya, termasuk mode gelap dan tampilan ponsel
js/data/drugs.js      Data obat dan dosis
js/data/scores.js     Definisi skor klinis dan interpretasinya
js/data/vaso.js       Preset infus vasoaktif
js/data/algorithms.js Algoritma kegawatdaruratan
js/data/vitals.js     Tanda vital normal anak
js/app.js             Logika aplikasi (navigasi, kalkulator, pencarian, catatan)
tests/smoke.test.js   Uji otomatis dasar
AGENTS.md             Panduan untuk asisten AI yang mengedit repo ini
```

Situs ini statis: tidak ada proses build, tidak ada server, tidak ada dependensi saat runtime.

## Menjalankan secara lokal

Buka `index.html` langsung di peramban. Atau jalankan server lokal:

```
npx serve .
```

## Uji

```
npm install
npm test
```

## Deploy

Hubungkan repo ini ke proyek Vercel `dokter-jaga` (Settings → Git). Setiap push ke branch `main` akan otomatis ter-deploy ke https://dokter-jaga.vercel.app.

## Penafian klinis

Dokter Jaga adalah alat bantu hitung dan pengingat untuk tenaga medis, bukan pengganti penilaian klinis. Dosis dan ambang batas mengikuti pedoman internasional yang umum dipakai; selalu verifikasi dengan formularium dan protokol setempat sebelum pemberian.
