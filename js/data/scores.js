// Skor klinis.
// items: {t:'chk', l:label, p:poin} untuk centang, atau {t:'sel', l:label, o:[[opsi,poin],...], def:indeks default}.
// interp(total, st) mengembalikan [level, judul, penjelasan]; level = 'low' | 'mid' | 'high'. st = {female, vals}.
// Sumber rujukan dicantumkan per item. Verifikasi dengan formularium dan protokol setempat.
window.DJ = window.DJ || {};
DJ.SCORES = [
  {id:'gcs', name:'GCS', sub:'Tingkat kesadaran', items:[
    {t:'sel', l:'Mata (E)', o:[['Spontan',4],['Terhadap suara',3],['Terhadap nyeri',2],['Tidak ada',1]], def:0},
    {t:'sel', l:'Verbal (V)', o:[['Orientasi baik',5],['Bingung',4],['Kata-kata tidak tepat',3],['Suara tidak bermakna',2],['Tidak ada',1]], def:0},
    {t:'sel', l:'Motorik (M)', o:[['Mengikuti perintah',6],['Melokalisasi nyeri',5],['Menarik (fleksi normal)',4],['Fleksi abnormal (dekortikasi)',3],['Ekstensi (deserebrasi)',2],['Tidak ada',1]], def:0}
  ], interp:t => t<=8 ? ['high','Cedera berat / koma','GCS ≤8: pertimbangkan proteksi jalan napas (intubasi).'] : t<=12 ? ['mid','Sedang','Observasi ketat, evaluasi penyebab, pertimbangkan CT kepala.'] : ['low','Ringan','Tetap nilai ulang secara berkala.'],
    ref:'Teasdale & Jennett, 1974. Tuliskan komponen, mis. E4V5M6.', showParts:true},
  {id:'news2', name:'NEWS2', sub:'Deteksi perburukan', items:[
    {t:'sel', l:'Frekuensi napas (×/menit)', o:[['≤8',3],['9–11',1],['12–20',0],['21–24',2],['≥25',3]], def:2},
    {t:'sel', l:'SpO₂ (skala 1)', o:[['≤91%',3],['92–93%',2],['94–95%',1],['≥96%',0]], def:3},
    {t:'sel', l:'Oksigen', o:[['Udara ruangan',0],['Oksigen tambahan',2]], def:0},
    {t:'sel', l:'Suhu (°C)', o:[['≤35,0',3],['35,1–36,0',1],['36,1–38,0',0],['38,1–39,0',1],['≥39,1',2]], def:2},
    {t:'sel', l:'Tekanan darah sistolik (mmHg)', o:[['≤90',3],['91–100',2],['101–110',1],['111–219',0],['≥220',3]], def:3},
    {t:'sel', l:'Nadi (×/menit)', o:[['≤40',3],['41–50',1],['51–90',0],['91–110',1],['111–130',2],['≥131',3]], def:2},
    {t:'sel', l:'Kesadaran', o:[['Alert',0],['Konfusi baru / respons suara / nyeri / tidak respons',3]], def:0}
  ], interp:(t,st) => t>=7 ? ['high','Risiko tinggi','Respons darurat: nilai segera oleh tim dengan kompetensi perawatan kritis, pertimbangkan ICU. Pantau kontinu.']
      : t>=5 ? ['mid','Risiko sedang','Respons segera oleh dokter; pantau minimal tiap jam.']
      : st.vals.includes(3) ? ['mid','Rendah–sedang (ada parameter bernilai 3)','Satu parameter ekstrem: evaluasi segera oleh dokter; pantau minimal tiap jam.']
      : ['low','Risiko rendah', t===0 ? 'Pantau minimal tiap 12 jam.' : 'Pantau tiap 4–6 jam; informasikan perawat penanggung jawab.'],
    ref:'Royal College of Physicians, 2017. Gunakan SpO₂ skala 2 (target 88–92%) untuk pasien gagal napas hiperkapnia.'},
  {id:'qsofa', name:'qSOFA', sub:'Skrining sepsis', items:[
    {t:'chk', l:'Frekuensi napas ≥22 ×/menit', p:1},
    {t:'chk', l:'Perubahan status mental (GCS <15)', p:1},
    {t:'chk', l:'Tekanan darah sistolik ≤100 mmHg', p:1}
  ], interp:t => t>=2 ? ['high','Risiko luaran buruk meningkat','Nilai disfungsi organ (SOFA), laktat, mulai bundel sepsis bila curiga infeksi.'] : ['low','Risiko lebih rendah','qSOFA bukan alat tunggal untuk menyingkirkan sepsis; SSC 2021 tidak merekomendasikannya sebagai skrining tunggal.'],
    ref:'Seymour et al., JAMA 2016; Surviving Sepsis Campaign 2021.'},
  {id:'curb', name:'CURB-65', sub:'Pneumonia komunitas', items:[
    {t:'chk', l:'Confusion (disorientasi baru)', p:1},
    {t:'chk', l:'Ureum >7 mmol/L (BUN >19 mg/dL / ureum >42 mg/dL)', p:1},
    {t:'chk', l:'Frekuensi napas ≥30 ×/menit', p:1},
    {t:'chk', l:'TD sistolik <90 atau diastolik ≤60 mmHg', p:1},
    {t:'chk', l:'Usia ≥65 tahun', p:1}
  ], interp:t => t<=1 ? ['low','Risiko rendah','Mortalitas 30 hari <3%. Pertimbangkan rawat jalan.'] : t===2 ? ['mid','Risiko sedang','Mortalitas ~9%. Pertimbangkan rawat inap singkat atau rawat jalan dengan pengawasan.'] : ['high','Risiko tinggi','Mortalitas 15–40%. Rawat inap; skor 4–5 pertimbangkan ICU.'],
    ref:'Lim et al., Thorax 2003.'},
  {id:'heart', name:'HEART', sub:'Nyeri dada', items:[
    {t:'sel', l:'History (anamnesis)', o:[['Sedikit mencurigakan',0],['Cukup mencurigakan',1],['Sangat mencurigakan',2]], def:0},
    {t:'sel', l:'EKG', o:[['Normal',0],['Gangguan repolarisasi nonspesifik',1],['Depresi ST signifikan',2]], def:0},
    {t:'sel', l:'Age (usia)', o:[['<45 tahun',0],['45–64 tahun',1],['≥65 tahun',2]], def:0},
    {t:'sel', l:'Risk factors', o:[['Tidak ada',0],['1–2 faktor risiko',1],['≥3 faktor atau riwayat aterosklerosis',2]], def:0},
    {t:'sel', l:'Troponin', o:[['≤ batas normal',0],['1–3× batas normal',1],['>3× batas normal',2]], def:0}
  ], interp:t => t<=3 ? ['low','Risiko rendah','Risiko MACE 6 minggu ~1–2%. Kandidat pulang dini dengan tindak lanjut.'] : t<=6 ? ['mid','Risiko sedang','Risiko MACE ~12–17%. Observasi, troponin serial, konsultasi kardiologi.'] : ['high','Risiko tinggi','Risiko MACE ~50–65%. Strategi invasif dini.'],
    ref:'Six et al., Neth Heart J 2008; Backus et al., 2013.'},
  {id:'wells', name:'Wells PE', sub:'Emboli paru', items:[
    {t:'chk', l:'Tanda & gejala klinis DVT', p:3},
    {t:'chk', l:'Diagnosis lain lebih kecil kemungkinannya dibanding EP', p:3},
    {t:'chk', l:'Denyut jantung >100 ×/menit', p:1.5},
    {t:'chk', l:'Imobilisasi ≥3 hari atau operasi dalam 4 minggu', p:1.5},
    {t:'chk', l:'Riwayat DVT/EP', p:1.5},
    {t:'chk', l:'Hemoptisis', p:1},
    {t:'chk', l:'Keganasan (dalam terapi / 6 bulan terakhir / paliatif)', p:1}
  ], interp:t => t>4 ? ['high','EP mungkin (likely)','Lanjutkan ke CT angiografi paru.'] : ['low','EP tidak mungkin (unlikely)','Periksa D-dimer; bila normal, EP dapat disingkirkan. Pertimbangkan PERC.'],
    ref:'Wells et al., Thromb Haemost 2000 (model dua tingkat).'},
  {id:'perc', name:'PERC', sub:'Menyingkirkan emboli paru', items:[
    {t:'chk', l:'Usia ≥50 tahun', p:1},
    {t:'chk', l:'Denyut jantung ≥100 ×/menit', p:1},
    {t:'chk', l:'SpO₂ <95% udara ruangan', p:1},
    {t:'chk', l:'Bengkak tungkai unilateral', p:1},
    {t:'chk', l:'Hemoptisis', p:1},
    {t:'chk', l:'Operasi atau trauma dalam 4 minggu', p:1},
    {t:'chk', l:'Riwayat DVT/EP', p:1},
    {t:'chk', l:'Penggunaan hormon (kontrasepsi oral, terapi estrogen)', p:1}
  ], interp:t => t===0 ? ['low','PERC negatif','Bila probabilitas pretes klinis rendah (<15%), EP dapat disingkirkan tanpa pemeriksaan D-dimer.'] : ['high','PERC positif','EP tidak dapat disingkirkan dengan PERC. Lanjutkan Wells dan D-dimer atau pencitraan.'],
    ref:'Kline et al., J Thromb Haemost 2004. Hanya untuk pasien dengan kecurigaan klinis rendah.'},
  {id:'wdvt', name:'Wells DVT', sub:'Trombosis vena dalam', items:[
    {t:'chk', l:'Kanker aktif (terapi dalam 6 bulan / paliatif)', p:1},
    {t:'chk', l:'Paralisis, paresis, atau imobilisasi gips tungkai', p:1},
    {t:'chk', l:'Tirah baring ≥3 hari atau operasi besar dalam 12 minggu', p:1},
    {t:'chk', l:'Nyeri tekan sepanjang distribusi vena dalam', p:1},
    {t:'chk', l:'Seluruh tungkai bengkak', p:1},
    {t:'chk', l:'Betis bengkak >3 cm dibanding sisi kontralateral', p:1},
    {t:'chk', l:'Edema pitting pada tungkai simtomatik', p:1},
    {t:'chk', l:'Vena superfisial kolateral (nonvarikosa)', p:1},
    {t:'chk', l:'Riwayat DVT', p:1},
    {t:'chk', l:'Diagnosis alternatif sama atau lebih mungkin', p:-2}
  ], interp:t => t>=2 ? ['high','DVT mungkin (likely)','USG kompresi tungkai; bila negatif, pertimbangkan D-dimer atau USG ulang dalam 1 minggu.'] : ['low','DVT tidak mungkin (unlikely)','Periksa D-dimer; bila negatif, DVT dapat disingkirkan.'],
    ref:'Wells et al., NEJM 2003.'},
  {id:'alvarado', name:'Alvarado', sub:'Apendisitis akut', items:[
    {t:'chk', l:'Nyeri berpindah ke fossa iliaka kanan', p:1},
    {t:'chk', l:'Anoreksia', p:1},
    {t:'chk', l:'Mual atau muntah', p:1},
    {t:'chk', l:'Nyeri tekan fossa iliaka kanan', p:2},
    {t:'chk', l:'Nyeri lepas (rebound)', p:1},
    {t:'chk', l:'Suhu ≥37,3 °C', p:1},
    {t:'chk', l:'Leukositosis >10.000/µL', p:2},
    {t:'chk', l:'Pergeseran ke kiri (neutrofil >75%)', p:1}
  ], interp:t => t<=4 ? ['low','Apendisitis tidak mungkin','Pertimbangkan diagnosis lain; observasi dan edukasi tanda bahaya.'] : t<=6 ? ['mid','Mungkin apendisitis','Pencitraan (USG/CT) dan observasi; konsultasi bedah.'] : ['high','Apendisitis sangat mungkin','Konsultasi bedah segera.'],
    ref:'Alvarado, Ann Emerg Med 1986.'},
  {id:'mcisaac', name:'McIsaac', sub:'Faringitis streptokokus', items:[
    {t:'chk', l:'Suhu >38 °C', p:1},
    {t:'chk', l:'Tidak ada batuk', p:1},
    {t:'chk', l:'Pembesaran atau nyeri KGB servikal anterior', p:1},
    {t:'chk', l:'Tonsil membesar atau ada eksudat', p:1},
    {t:'sel', l:'Usia', o:[['3–14 tahun',1],['15–44 tahun',0],['≥45 tahun',-1]], def:1}
  ], interp:t => t<=1 ? ['low','Risiko rendah (≤10%)','Tidak perlu tes maupun antibiotik; terapi simtomatik.'] : t<=3 ? ['mid','Risiko sedang (11–35%)','Tes antigen cepat atau kultur; antibiotik bila positif.'] : ['high','Risiko tinggi (≥50%)','Lakukan tes bila tersedia; antibiotik empiris dapat dipertimbangkan.'],
    ref:'McIsaac et al., CMAJ 1998.'},
  {id:'chads', name:'CHA₂DS₂-VASc', sub:'Risiko stroke pada FA', items:[
    {t:'chk', l:'Gagal jantung kongestif / disfungsi LV', p:1},
    {t:'chk', l:'Hipertensi', p:1},
    {t:'sel', l:'Usia', o:[['<65 tahun',0],['65–74 tahun',1],['≥75 tahun',2]], def:0},
    {t:'chk', l:'Diabetes melitus', p:1},
    {t:'chk', l:'Riwayat stroke / TIA / tromboemboli', p:2},
    {t:'chk', l:'Penyakit vaskular (IMA, PAD, plak aorta)', p:1},
    {t:'chk', l:'Perempuan', p:1, sex:true}
  ], interp:(t,st) => {
    const f = st.female; const nonSex = t-(f?1:0);
    if(nonSex>=2) return ['high','Antikoagulan direkomendasikan','Skor non-jenis-kelamin ≥2. Nilai risiko perdarahan (HAS-BLED) dan pilih DOAC bila memungkinkan.'];
    if(nonSex===1) return ['mid','Pertimbangkan antikoagulan','Skor non-jenis-kelamin 1: keputusan individual bersama pasien.'];
    return ['low','Risiko rendah','Antikoagulan tidak diindikasikan.'];
  }, ref:'Lip et al., Chest 2010; ESC 2020/2024.'},
  {id:'hasbled', name:'HAS-BLED', sub:'Risiko perdarahan antikoagulan', items:[
    {t:'chk', l:'Hipertensi tidak terkontrol (sistolik >160 mmHg)', p:1},
    {t:'chk', l:'Fungsi ginjal abnormal (dialisis, transplantasi, Cr ≥2,26 mg/dL)', p:1},
    {t:'chk', l:'Fungsi hati abnormal (sirosis, bilirubin >2× atau AST/ALT >3×)', p:1},
    {t:'chk', l:'Riwayat stroke', p:1},
    {t:'chk', l:'Riwayat atau predisposisi perdarahan', p:1},
    {t:'chk', l:'INR labil (TTR <60%)', p:1},
    {t:'chk', l:'Usia >65 tahun', p:1},
    {t:'chk', l:'Obat antiplatelet atau OAINS', p:1},
    {t:'chk', l:'Alkohol ≥8 unit/minggu', p:1}
  ], interp:t => t>=3 ? ['high','Risiko perdarahan tinggi','Bukan alasan untuk menahan antikoagulan. Koreksi faktor yang dapat diubah dan pantau lebih ketat.'] : ['low','Risiko perdarahan rendah–sedang','Tetap koreksi faktor risiko yang dapat diubah.'],
    ref:'Pisters et al., Chest 2010.'}
];
