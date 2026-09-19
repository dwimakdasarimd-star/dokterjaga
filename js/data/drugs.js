// Daftar obat IGD berbasis berat badan.
// Field: g=kelompok, n=nama, ind=indikasi, r=rute, perKg=dosis per kg (mg/kg, atau mL/kg bila type:'ml'),
// max=dosis maksimal (mg atau mL; null bila tidak ada), conc=konsentrasi sediaan default (mg/mL), note=catatan.
// Sumber rujukan dicantumkan per item. Verifikasi dengan formularium dan protokol setempat.
window.DJ = window.DJ || {};
DJ.DRUGS = [
  {g:'Resusitasi', n:'Epinefrin', ind:'Henti jantung', r:'IV/IO', perKg:0.01, max:1, conc:0.1, note:'1 mg diencerkan jadi 10 mL (1:10.000). Ulang tiap 3–5 menit.'},
  {g:'Resusitasi', n:'Amiodaron', ind:'VF / VT tanpa nadi', r:'IV/IO bolus', perKg:5, max:300, conc:50, note:'Dapat diulang hingga total 15 mg/kg pada anak.'},
  {g:'Resusitasi', n:'Adenosin', ind:'SVT', r:'IV cepat + flush', perKg:0.1, max:6, conc:3, note:'Dosis kedua 0,2 mg/kg (maks. 12 mg).'},
  {g:'Resusitasi', n:'Sulfas atropin', ind:'Bradikardia simtomatik', r:'IV/IO', perKg:0.02, max:0.5, conc:0.25, note:'Dosis tunggal maks. 0,5 mg; boleh diulang satu kali.'},
  {g:'Alergi', n:'Epinefrin', ind:'Anafilaksis', r:'IM paha anterolateral', perKg:0.01, max:0.5, conc:1, note:'Sediaan 1 mg/mL. Anak prapubertas umumnya maks. 0,3 mg. Ulang tiap 5–15 menit.'},
  {g:'Alergi', n:'Deksametason', ind:'Croup / reaksi alergi', r:'IV/IM/PO', perKg:0.6, max:16, conc:5, note:'Croup ringan: 0,15 mg/kg sering sudah cukup.'},
  {g:'Neurologi', n:'Midazolam', ind:'Kejang', r:'IM', perKg:0.2, max:10, conc:5, note:'Bila akses IV belum ada. Pantau jalan napas.'},
  {g:'Neurologi', n:'Diazepam', ind:'Kejang', r:'IV pelan', perKg:0.2, max:10, conc:5, note:'Rektal: 0,5 mg/kg (maks. 10 mg). Boleh ulang 1× setelah 5 menit.'},
  {g:'Neurologi', n:'Fenitoin', ind:'Status epileptikus, lini 2', r:'IV drip', perKg:20, max:1500, conc:50, note:'Laju ≤50 mg/menit (anak ≤1 mg/kg/menit). Encerkan dalam NaCl 0,9%, pantau EKG.'},
  {g:'Neurologi', n:'Manitol 20%', ind:'Peningkatan TIK', r:'IV 15–30 menit', perKg:500, max:null, conc:200, note:'Rentang 0,25–1 g/kg. 20% = 200 mg/mL.'},
  {g:'Cairan & metabolik', n:'Dekstrosa 10%', ind:'Hipoglikemia anak', r:'IV', perKg:5, max:250, type:'ml', note:'5 mL/kg = 0,5 g/kg glukosa. Cek ulang GDS 15 menit.'},
  {g:'Cairan & metabolik', n:'NaCl 0,9% / RL', ind:'Bolus syok', r:'IV', perKg:20, max:1000, type:'ml', note:'Anak: 10–20 mL/kg, evaluasi ulang tiap bolus (hati-hati gagal jantung).'},
  {g:'Analgesik & lain', n:'Parasetamol', ind:'Demam / nyeri', r:'PO/IV', perKg:15, max:1000, conc:10, note:'Interval 4–6 jam, maks. 60 mg/kg/hari (≤4 g). Sediaan infus 10 mg/mL.'},
  {g:'Analgesik & lain', n:'Ibuprofen', ind:'Demam / nyeri', r:'PO', perKg:10, max:400, conc:20, note:'Interval 6–8 jam. Sirup 100 mg/5 mL = 20 mg/mL.'},
  {g:'Analgesik & lain', n:'Ondansetron', ind:'Mual / muntah', r:'IV/PO', perKg:0.15, max:4, conc:2, note:'Dewasa lazim 4–8 mg.'},
  {g:'Analgesik & lain', n:'Seftriakson', ind:'Infeksi berat', r:'IV', perKg:50, max:2000, conc:100, note:'Meningitis: 100 mg/kg/hari (maks. 4 g/hari). 1 g dilarutkan 10 mL.'}
];
