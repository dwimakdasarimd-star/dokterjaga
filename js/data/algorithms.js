// Algoritma kegawatdaruratan. steps: [waktu/konteks (boleh ''), judul langkah, isi].
// Sumber rujukan dicantumkan per item. Verifikasi dengan formularium dan protokol setempat.
window.DJ = window.DJ || {};
DJ.ALGOS = [
  {id:'hcj', title:'Henti jantung dewasa', tag:['red','Resusitasi'], steps:[
    ['0 menit','Mulai RJP berkualitas','Kompresi 100–120 ×/menit, kedalaman 5–6 cm, rekoil penuh, 30:2 bila belum ada jalan napas lanjut. Beri O₂, pasang monitor/defibrilator.'],
    ['','Nilai irama','VF/VT tanpa nadi: kejut listrik (bifasik 120–200 J). Asistol/PEA: lanjutkan RJP dan berikan epinefrin sesegera mungkin.'],
    ['Tiap 2 menit','Siklus RJP','Ganti pengompresi dan cek irama tiap 2 menit. Minimalkan jeda kompresi (<10 detik).'],
    ['','Epinefrin 1 mg IV/IO','Ulang tiap 3–5 menit. Pada irama dapat-kejut, beri setelah kejut kedua.'],
    ['','Amiodaron','VF/VT refrakter: 300 mg bolus setelah kejut ketiga, lalu 150 mg. Alternatif: lidokain 1–1,5 mg/kg.'],
    ['','Cari penyebab reversibel (5H 5T)','Hipovolemia, hipoksia, H⁺ (asidosis), hipo/hiperkalemia, hipotermia; tension pneumothorax, tamponade, toksin, trombosis paru, trombosis koroner.'],
    ['','ROSC','Target SpO₂ 92–98%, PaCO₂ 35–45, MAP ≥65. EKG 12 sadapan; pertimbangkan intervensi koroner dan manajemen suhu.']
  ], ref:'AHA ACLS 2020'},
  {id:'ana', title:'Anafilaksis', tag:['red','Alergi'], steps:[
    ['Segera','Hentikan pajanan, panggil bantuan','Nilai ABCDE. Posisikan telentang dengan tungkai diangkat (duduk bila sesak; miring bila hamil).'],
    ['','Epinefrin IM','0,01 mg/kg sediaan 1 mg/mL di paha anterolateral. Maks. 0,5 mg dewasa, 0,3 mg anak. Ulang tiap 5–15 menit bila belum membaik.'],
    ['','Oksigen dan akses IV','O₂ aliran tinggi. Bolus kristaloid: dewasa 500–1000 mL, anak 20 mL/kg.'],
    ['','Refrakter setelah 2 dosis IM','Mulai infus epinefrin IV dengan monitoring, konsultasi intensivis/anestesi.'],
    ['','Terapi tambahan','Antihistamin untuk gejala kulit, bronkodilator inhalasi bila mengi menetap. Kortikosteroid bukan terapi lini pertama.'],
    ['','Observasi','Minimal 6–12 jam setelah gejala hilang (lebih lama bila berat atau butuh >1 dosis). Edukasi, rencanakan pena epinefrin dan rujukan alergi.']
  ], ref:'WAO 2020; Resuscitation Council UK 2021'},
  {id:'se', title:'Status epileptikus', tag:['red','Neurologi'], steps:[
    ['0–5 menit','Stabilisasi','ABC, O₂, monitor, akses IV. Periksa GDS segera; bila <60 mg/dL beri tiamin 100 mg lalu dekstrosa. Catat waktu mulai kejang.'],
    ['5–20 menit','Benzodiazepin (lini 1)','Midazolam IM 10 mg (>40 kg) / 5 mg (13–40 kg), atau lorazepam IV 0,1 mg/kg (maks. 4 mg), atau diazepam IV 0,15–0,2 mg/kg (maks. 10 mg). Boleh ulang satu kali.'],
    ['20–40 menit','Obat antikejang IV (lini 2)','Levetirasetam 60 mg/kg (maks. 4500 mg), atau fenitoin/fosfenitoin 20 mg/kg (PE), atau valproat 40 mg/kg (maks. 3000 mg). Pilih satu.'],
    ['40–60 menit','Status epileptikus refrakter','Intubasi dan anestesi (midazolam, propofol, atau tiopental infus) dengan EEG kontinu di ICU.'],
    ['','Cari penyebab','Elektrolit, fungsi ginjal/hati, kadar OAE, toksikologi, CT kepala; pungsi lumbal bila curiga infeksi SSP.']
  ], ref:'AES 2016; ESETT 2019'},
  {id:'sep', title:'Sepsis dan syok septik', tag:['amber','Bundel jam pertama'], steps:[
    ['Jam 1','Ukur laktat','Ulangi bila laktat awal >2 mmol/L.'],
    ['','Kultur darah','Ambil sebelum antibiotik, tanpa menunda antibiotik.'],
    ['','Antibiotik spektrum luas','Syok atau kemungkinan sepsis tinggi: dalam 1 jam. Kemungkinan sepsis tanpa syok: nilai cepat, berikan dalam 3 jam bila kecurigaan menetap.'],
    ['','Kristaloid 30 mL/kg','Untuk hipotensi atau laktat ≥4 mmol/L, dalam 3 jam pertama. Evaluasi respons cairan secara dinamis.'],
    ['','Vasopresor','Norepinefrin bila hipotensi menetap selama/setelah cairan, target MAP ≥65 mmHg. Dapat mulai via vena perifer sambil menunggu CVC.']
  ], ref:'Surviving Sepsis Campaign 2021'},
  {id:'hipo', title:'Hipoglikemia', tag:['amber','Metabolik'], steps:[
    ['','Konfirmasi','GDS <70 mg/dL (<54 mg/dL bermakna klinis).'],
    ['Sadar','Glukosa oral','15–20 g karbohidrat cepat serap (±150 mL jus atau 3–4 sendok teh gula). Cek ulang GDS 15 menit.'],
    ['Tidak sadar','Dekstrosa IV','Dewasa: D40% 25–50 mL IV. Anak: D10% 2–5 mL/kg. Tanpa akses IV: glukagon 1 mg IM (0,5 mg bila <25 kg).'],
    ['','Rumatan','Lanjutkan infus D10% dan pantau GDS tiap 1 jam. Sulfonilurea atau insulin kerja panjang: observasi lebih lama.'],
    ['','Cari penyebab','Obat, asupan, sepsis, gangguan ginjal/hati, alkohol, insufisiensi adrenal.']
  ], ref:'ADA Standards of Care 2024'}
];
DJ.ALGOS.push(
  {id:'ska', title:'Sindrom koroner akut', tag:['red','Kardiologi'], steps:[
    ['≤10 menit','EKG 12 sadapan','Dalam 10 menit sejak pasien tiba. Tambahkan V7–V9 dan V3R–V4R bila curiga infark posterior atau ventrikel kanan. Ulangi bila nyeri berlanjut.'],
    ['','Terapi awal','Aspirin 160–320 mg dikunyah. Nitrat sublingual bila tidak hipotensi, tidak ada infark ventrikel kanan, dan tidak memakai penghambat PDE-5. O₂ hanya bila SpO₂ <90%. Morfin untuk nyeri berat yang menetap.'],
    ['','Antiplatelet kedua','Tikagrelor 180 mg atau klopidogrel 300–600 mg sesuai strategi reperfusi dan protokol setempat.'],
    ['STEMI','Reperfusi','IKP primer bila dapat dilakukan ≤120 menit sejak diagnosis. Bila tidak, fibrinolitik dalam 10 menit sejak diagnosis (onset <12 jam), lalu rujuk ke pusat IKP.'],
    ['NSTE-SKA','Troponin serial','hs-troponin algoritma 0/1 jam atau 0/2 jam. Stratifikasi risiko (HEART, GRACE) untuk menentukan waktu angiografi.'],
    ['','Antikoagulan','Heparin tidak terfraksi atau enoksaparin/fondaparinuks sesuai strategi dan fungsi ginjal.']
  ], ref:'ESC 2023; PERKI'},
  {id:'stroke', title:'Stroke akut', tag:['red','Neurologi'], steps:[
    ['0 menit','Kode stroke','ABC, GDS segera (singkirkan hipoglikemia), catat waktu terakhir terlihat normal, NIHSS.'],
    ['≤20–25 menit','CT kepala tanpa kontras','Bedakan iskemik dan perdarahan. Pertimbangkan CTA bila kandidat trombektomi.'],
    ['Iskemik ≤4,5 jam','Trombolisis','Alteplase 0,9 mg/kg (maks. 90 mg) atau tenekteplase 0,25 mg/kg (maks. 25 mg) bila tidak ada kontraindikasi. TD <185/110 sebelum pemberian. Target door-to-needle ≤60 menit.'],
    ['','Trombektomi','Oklusi pembuluh besar sirkulasi anterior: hingga 24 jam pada pasien terpilih berdasarkan pencitraan.'],
    ['Tanpa trombolisis','Tekanan darah','Tidak diturunkan kecuali >220/120 mmHg; bila ya, turunkan ±15% dalam 24 jam pertama.'],
    ['Perdarahan','Stroke hemoragik','Target sistolik ±140 mmHg (hindari <130), balikkan antikoagulan, konsultasi bedah saraf, kepala 30°.']
  ], ref:'AHA/ASA 2019; AHA ICH 2022'},
  {id:'hiperk', title:'Hiperkalemia', tag:['amber','Metabolik'], steps:[
    ['','Nilai urgensi','K⁺ ≥6,5 mmol/L atau ada perubahan EKG (T tinggi runcing, QRS lebar, sine wave) = kegawatan. Singkirkan pseudohiperkalemia (hemolisis).'],
    ['Segera','Stabilisasi membran jantung','Kalsium glukonas 10% 10–30 mL IV dalam 5–10 menit dengan monitor EKG. Ulangi bila perubahan EKG menetap setelah 5–10 menit.'],
    ['','Geser K⁺ ke intrasel','Insulin reguler 10 unit IV + dekstrosa 25 g (D40% 60 mL). Pantau GDS tiap jam selama 6 jam. Tambahkan salbutamol nebulisasi 10–20 mg.'],
    ['','Natrium bikarbonat','Hanya bila ada asidosis metabolik berat.'],
    ['','Keluarkan K⁺','Furosemid bila tidak anurik dan euvolemik, pengikat K⁺, atau hemodialisis pada kasus refrakter atau gagal ginjal.'],
    ['','Pantau','Ulang K⁺ 1, 2, 4, dan 6 jam. Cari dan hentikan penyebab (obat, AKI, rabdomiolisis).']
  ], ref:'UK Kidney Association 2023'},
  {id:'asma', title:'Asma eksaserbasi dewasa', tag:['amber','Respirologi'], steps:[
    ['','Nilai derajat','Berat: bicara kata per kata, RR >30, nadi >120, SpO₂ <90%, APE ≤50%. Tanda mengancam nyawa: silent chest, sianosis, penurunan kesadaran.'],
    ['Jam pertama','Bronkodilator','Salbutamol 2,5–5 mg nebulisasi tiap 20 menit (atau 4–10 hisapan MDI dengan spacer). Tambahkan ipratropium 0,5 mg pada eksaserbasi berat.'],
    ['','Oksigen','Titrasi target SpO₂ 93–95%.'],
    ['','Kortikosteroid sistemik','Prednison 40–50 mg oral (atau metilprednisolon IV setara) dalam 1 jam pertama, lanjut 5–7 hari.'],
    ['','Refrakter','Magnesium sulfat 2 g IV dalam 20 menit. Pertimbangkan ICU bila tidak membaik, PaCO₂ normal/meningkat, atau kelelahan.'],
    ['1 jam','Evaluasi ulang','Pulang bila APE >60–80% prediksi, gejala membaik, dan dapat dipantau; lanjutkan ICS. Rawat bila tidak.']
  ], ref:'GINA 2024'}
);
