/* Dokter Jaga — clinical modules requested from the reference dashboard.
   These modules are an extension layer over the existing static app. */
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const $ = s => document.querySelector(s);
  const icon = name => {
    const p = {
      pill:'<rect x="6" y="6" width="12" height="12" rx="4" transform="rotate(-45 12 12)"/><path d="m8.5 15.5 7-7"/>',
      calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v2M8 19h4"/>',
      book:'<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v18H7.5A2.5 2.5 0 0 0 5 22z"/><path d="M5 4.5V22M9 7h7M9 11h7"/>',
      score:'<path d="M8 4h8a2 2 0 0 1 2 2v15H6V6a2 2 0 0 1 2-2Z"/><path d="M9 2h6v4H9zM9 12l2 2 4-4M9 17h6"/>',
      shield:'<path d="M12 3 20 6v5c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V6z"/><path d="M9 12h6M12 9v6"/>',
      clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
      child:'<circle cx="12" cy="6" r="3"/><path d="M8 21l4-7 4 7M7 12h10M12 9v5"/>',
      syringe:'<path d="m4 20 12-12M13 5l6 6M16 2l6 6M5 15l4 4M3 21l2-2M18 8l-2 2"/>',
      heart:'<path d="M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20Z"/><path d="M8 12h2l1.2-2.5L13 15l1.2-3H17"/>',
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      emergency:'<path d="M12 3 3 20h18L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
      scale:'<path d="M5 20h14M7 20l2-11h6l2 11M4 9h16M8 6h8M10 3h4"/>',
      ecg:'<path d="M2 12h4l2-6 4 12 2-6h8"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.book)+'</svg>';
  };
  const modules = [
    ['dose','Dosis Obat','Cari dosis, sediaan, dan regimen obat dewasa maupun anak.','pill'],
    ['calc','Kalkulator Klinis','Kumpulan kalkulator untuk analisis dan perhitungan klinis.','calc'],
    ['guide','Panduan Klinis','Telusuri panduan klinis dan rekomendasi tata laksana.','book'],
    ['score','Skrining & Skor','Gunakan instrumen skrining dan skor klinis.','score'],
    ['interaction','Interaksi Obat','Periksa interaksi antarobat dan tingkat risikonya.','shield'],
    ['indication','Indikasi & Kontraindikasi','Telusuri indikasi, kontraindikasi, dan perhatian penggunaan.','clipboard'],
    ['anthro','Antropometri Anak','Nilai pertumbuhan anak dengan standar antropometri.','scale'],
    ['immunization','Imunisasi','Lihat jadwal dan rekomendasi imunisasi.','syringe'],
    ['development','Perkembangan Anak','Tinjau capaian perkembangan dan skrining anak.','child'],
    ['ecg','Modul EKG','Pelajari materi EKG dan contoh rekaman.','ecg'],
    ['icd','Kamus ICD-10','Cari kode diagnosis dalam klasifikasi ICD-10.','search'],
    ['toolkit','Toolkit IGD','Akses cepat ke alur dan alat bantu kegawatdaruratan.','emergency']
  ];

  function goCM(id){
    document.querySelectorAll('.cm-view').forEach(v=>v.hidden=v.id!=='cm-'+id);
    const home=$('#v-home'); if(home) home.hidden=false;
    document.querySelectorAll('.cm-module-card').forEach(b=>b.setAttribute('aria-current',b.dataset.cm===id?'page':'false'));
    window.scrollTo({top:0,behavior:'smooth'});
    try{localStorage.setItem('cmView',id)}catch{}
  }
  function backHome(){ document.querySelectorAll('.cm-view').forEach(v=>v.hidden=true); window.scrollTo({top:0,behavior:'smooth'}); try{localStorage.setItem('cmView','home')}catch{} }

  function card([id,title,desc,ico]){
    return '<button class="cm-module-card" type="button" data-cm="'+id+'"><span class="cm-icon">'+icon(ico)+'</span><span class="cm-card-body"><span class="cm-card-title">'+esc(title)+'</span><span class="cm-card-desc">'+esc(desc)+'</span></span><span class="cm-arrow">↗</span></button>';
  }

  function addViews(){
    const main=$('main'); if(!main) return;
    const oldGrid=$('#homeGrid');
    if(oldGrid){
      oldGrid.outerHTML='<div class="cm-home-wrap"><h1 class="cm-home-title">Modul klinis utama</h1><p class="cm-home-sub">Workspace klinis terintegrasi untuk membantu pencarian informasi, perhitungan, skrining, dan pengambilan keputusan selama praktik.</p><div class="home-grid" id="homeGrid">'+modules.map(card).join('')+'</div></div>';
    }
    const views = [
      ['guide',guideHTML()],['interaction',interactionHTML()],['indication',indicationHTML()],
      ['anthro',anthroHTML()],['immunization',immunizationHTML()],['development',developmentHTML()],
      ['ecg',ecgHTML()],['icd',icdHTML()],['toolkit',toolkitHTML()]
    ];
    views.forEach(([id,html])=>{const s=document.createElement('section');s.className='cm-view';s.id='cm-'+id;s.hidden=true;s.innerHTML=html;main.appendChild(s)});
  }

  const guides=[
    ['Sepsis','Penilaian awal, identifikasi infeksi, perfusi, laktat, kultur bila tepat, antibiotik dan source control.','Surviving Sepsis Campaign — gunakan protokol RS setempat.'],
    ['Asma akut','Nilai derajat serangan, saturasi, kemampuan bicara, kerja napas dan respons terhadap bronkodilator.','GINA — verifikasi versi terbaru.'],
    ['Anafilaksis','Kenali onset akut dengan keterlibatan jalan napas, respirasi atau sirkulasi; siapkan epinefrin IM dan resusitasi suportif sesuai protokol.','WAO/AAAAI — verifikasi protokol lokal.'],
    ['Stroke akut','Tentukan waktu onset/last known well, glukosa, NIHSS bila tersedia, imaging dan kontraindikasi terapi reperfusi.','AHA/ASA — verifikasi kriteria terbaru.'],
    ['Sindrom koroner akut','EKG 12 sadapan segera pada kecurigaan SKA, evaluasi serial dan stratifikasi risiko.','ESC/AHA — sesuaikan dengan fasilitas.'],
    ['Hipoglikemia','Konfirmasi glukosa bila memungkinkan, berikan koreksi sesuai kondisi pasien, lalu cari penyebab dan lakukan recheck.','Protokol emergensi lokal.'],
    ['Dehidrasi anak','Nilai status umum, mata, mukosa, turgor, kemampuan minum dan tanda bahaya; pilih rencana rehidrasi sesuai derajat.','WHO/UNICEF.'],
    ['Hiperkalemia','Konfirmasi hasil dan perubahan EKG; bila ada tanda toksisitas membran atau kondisi berat, ikuti algoritme emergensi dan monitoring kontinu.','Protokol emergensi lokal.']
  ];
  function guideHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Reference library</div><h2>Panduan Klinis</h2><p>Cari ringkasan topik klinis dan buka sumber resmi sebelum menerapkan rekomendasi.</p></div></div><div class="cm-panel"><div class="cm-toolbar"><div class="cm-search"><input id="guideSearch" placeholder="Cari sepsis, asma, stroke, SKA…"></div></div><div class="cm-list" id="guideList"></div><div class="cm-source">Gunakan ringkasan sebagai pengingat. Pedoman dapat berubah; selalu cocokkan dengan guideline terbaru dan PPK rumah sakit.</div></div>'}

  const interactions=[
    ['Warfarin + NSAID','Tinggi','Peningkatan risiko perdarahan; pertimbangkan alternatif dan monitoring sesuai indikasi.'],
    ['ACE inhibitor + spironolakton','Tinggi','Risiko hiperkalemia dan gangguan ginjal meningkat, terutama pada CKD.'],
    ['Makrolid + obat pemanjang QT','Sedang–tinggi','Dapat meningkatkan risiko pemanjangan QT/torsades; cek obat lain dan faktor risiko.'],
    ['SSRI + MAOI','Tinggi','Kombinasi dapat memicu sindrom serotonin; perlu penghindaran/washout sesuai obat.'],
    ['Metformin + kontras iodinated','Perlu evaluasi','Pertimbangkan fungsi ginjal dan konteks prosedur sesuai pedoman/fasilitas.'],
    ['Digoksin + amiodaron','Sedang–tinggi','Amiodaron dapat meningkatkan paparan digoksin; perlu penyesuaian/monitoring.']
  ];
  function interactionHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Medication safety</div><h2>Interaksi Obat</h2><p>Pilih dua obat untuk melihat pasangan interaksi yang dikenal. Ini bukan pengganti pemeriksaan interaksi lengkap.</p></div></div><div class="cm-panel"><div class="cm-grid"><label class="cm-field">Obat 1<select class="cm-select" id="intA">'+['Warfarin','NSAID','ACE inhibitor','Spironolakton','Makrolid','Obat pemanjang QT','SSRI','MAOI','Metformin','Kontras iodinated','Digoksin','Amiodaron'].map(x=>'<option>'+x+'</option>').join('')+'</select></label><label class="cm-field">Obat 2<select class="cm-select" id="intB">'+['NSAID','Warfarin','Spironolakton','ACE inhibitor','Obat pemanjang QT','Makrolid','MAOI','SSRI','Kontras iodinated','Metformin','Amiodaron','Digoksin'].map(x=>'<option>'+x+'</option>').join('')+'</select></label></div><div class="cm-result" id="intResult">Pilih pasangan obat.</div><h3 style="color:#243554;margin-top:24px">Pasangan penting</h3><div class="cm-list">'+interactions.map(x=>'<div class="cm-item"><span class="cm-tag">'+esc(x[1])+'</span><h4>'+esc(x[0])+'</h4><p>'+esc(x[2])+'</p></div>').join('')+'</div></div>'}

  const indications=[
    ['Epinefrin IM','Anafilaksis','Hipersensitivitas terhadap epinefrin bukan alasan untuk menunda pada anafilaksis yang mengancam nyawa; perhatian utama adalah teknik, rute dan monitoring.'],
    ['Salbutamol inhalasi','Bronkospasme/asma','Perhatikan takikardia, tremor dan hipokalemia; evaluasi respons dan derajat serangan.'],
    ['Nitrogliserin','Nyeri dada/iskemia pada pasien terpilih','Hindari pada hipotensi bermakna, penggunaan PDE-5 inhibitor tertentu, atau kondisi lain sesuai protokol.'],
    ['Ketorolak','Nyeri akut pada pasien terpilih','Perhatian/kontraindikasi termasuk gangguan ginjal, ulkus/perdarahan GI dan kondisi tertentu; verifikasi formularium.'],
    ['Metoklopramid','Mual/muntah pada indikasi terpilih','Perhatikan efek ekstrapiramidal, QT dan kontraindikasi seperti obstruksi/perdarahan GI tertentu.'],
    ['Amoksisilin','Infeksi bakteri yang sensitif','Jangan digunakan untuk infeksi virus; cek alergi beta-laktam dan penyesuaian pada kondisi tertentu.']
  ];
  function indicationHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Medication reference</div><h2>Indikasi & Kontraindikasi</h2><p>Referensi cepat obat umum. Detail dosis, kontraindikasi spesifik dan interaksi harus diverifikasi dari sumber obat/formularium.</p></div></div><div class="cm-panel"><div class="cm-toolbar"><div class="cm-search"><input id="indSearch" placeholder="Cari obat atau indikasi…"></div></div><div class="cm-list" id="indList"></div></div>'}

  function anthroHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Pediatric growth</div><h2>Antropometri Anak</h2><p>Hitung BMI dan bantu menentukan indikator yang perlu dirujuk ke kurva WHO. Z-score tidak ditebak dari BMI biasa.</p></div></div><div class="cm-grid"><div class="cm-panel"><div class="cm-grid"><label class="cm-field">Usia (tahun)<input id="anAge" type="number" min="0" max="19" step=".1" placeholder="5"></label><label class="cm-field">Jenis kelamin<select id="anSex"><option value="boy">Laki-laki</option><option value="girl">Perempuan</option></select></label></div><div class="cm-grid" style="margin-top:12px"><label class="cm-field">Berat (kg)<input id="anW" type="number" step=".1" placeholder="18"></label><label class="cm-field">Tinggi (cm)<input id="anH" type="number" step=".1" placeholder="110"></label></div><button class="cm-btn primary" id="anCalc" style="margin-top:14px">Hitung</button><div class="cm-result" id="anOut">Masukkan data anak.</div></div><div class="cm-panel"><h3 style="margin-top:0;color:#243554">Indikator WHO</h3><div class="cm-list"><div class="cm-item"><h4>0–5 tahun</h4><p>Gunakan weight-for-age, length/height-for-age, weight-for-length/height atau BMI-for-age sesuai usia dan data antropometri.</p></div><div class="cm-item"><h4>5–19 tahun</h4><p>BMI-for-age menggunakan cut-off WHO: overweight &gt;+1 SD, obesity &gt;+2 SD, thinness &lt;−2 SD, severe thinness &lt;−3 SD.</p></div></div><div class="cm-source">Sumber: WHO Child Growth Standards dan WHO Growth Reference 5–19 years.</div></div></div>'}

  const immun=[
    ['0 bulan','Hepatitis B (HB 0)'],['1 bulan','BCG; bOPV 1'],['2 bulan','DPT-HB-Hib 1; bOPV 2; PCV 1; Rotavirus 1'],['3 bulan','DPT-HB-Hib 2; bOPV 3; PCV 2; Rotavirus 2'],['4 bulan','DPT-HB-Hib 3; bOPV 4; IPV 1; Rotavirus 3'],['9 bulan','Campak-Rubela 1; IPV 2'],['10 bulan','JE di wilayah endemis'],['12 bulan','PCV 3'],['18 bulan','DPT-HB-Hib 4; Campak-Rubela 2'],['Kelas 1 SD','Campak-Rubela; DT'],['Kelas 2 SD','Td']
  ];
  function immunizationHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Indonesia routine schedule</div><h2>Imunisasi</h2><p>Jadwal ringkas imunisasi rutin anak berdasarkan informasi Kementerian Kesehatan RI. Periksa catch-up dan kebijakan program terbaru.</p></div></div><div class="cm-panel"><table class="cm-table"><thead><tr><th>Usia</th><th>Imunisasi</th></tr></thead><tbody>'+immun.map(x=>'<tr><td><b>'+x[0]+'</b></td><td>'+x[1]+'</td></tr>').join('')+'</tbody></table><div class="cm-source">Sumber: Kemenkes RI, “Seputar Imunisasi”. Jadwal dapat berubah mengikuti kebijakan program.</div></div>'}

  const milestones=[
    ['Duduk tanpa bantuan','sekitar 6 bulan','Amati kontrol kepala, trunk dan simetri gerak.'],
    ['Merangkak hands-and-knees','sekitar 8 bulan','Tidak semua anak merangkak dengan pola yang sama.'],
    ['Berdiri dengan bantuan','sekitar 9 bulan','Perhatikan kemampuan menumpu dan transisi posisi.'],
    ['Berjalan dengan bantuan','sekitar 10–11 bulan','Nilai kualitas gerak, bukan hanya usia.'],
    ['Berdiri sendiri','sekitar 12 bulan','Variasi individual cukup besar.'],
    ['Berjalan sendiri','sekitar 12–18 bulan','Keterlambatan perlu dinilai bersama domain lain dan pemeriksaan klinis.']
  ];
  function developmentHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Child development</div><h2>Perkembangan Anak</h2><p>Checklist perkembangan motorik kasar untuk skrining awal. Milestone harus dilihat sebagai rentang, bukan diagnosis tunggal.</p></div></div><div class="cm-panel"><div class="cm-list">'+milestones.map((m,i)=>'<label class="cm-item cm-check"><input type="checkbox"><span><b>'+esc(m[0])+'</b><p>'+esc(m[1])+' — '+esc(m[2])+'</p></span></label>').join('')+'</div><div class="cm-alert" style="margin-top:16px">Bila ada kekhawatiran perkembangan, regresi kemampuan, atau keterlambatan pada beberapa domain, lakukan asesmen perkembangan yang sesuai dan pertimbangkan rujukan.</div><div class="cm-source">Rujukan: WHO motor development study dan WHO Child Growth Standards.</div></div>'}

  function ecgHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">ECG learning module</div><h2>Modul EKG</h2><p>Checklist pembacaan EKG sistematis + kalkulator rate, QTc dan axis. Tidak menggantikan interpretasi klinis dan pembacaan 12 sadapan lengkap.</p></div></div><div class="cm-ecg-grid"><div class="cm-panel"><div class="cm-ecg-board" aria-label="Ilustrasi grid EKG"></div><div class="cm-steps" style="margin-top:14px"><div class="cm-step"><b>1 · Rate</b><span>Regular: 300 / jumlah kotak besar antar-R. Irregular: hitung kompleks dalam strip waktu.</span></div><div class="cm-step"><b>2 · Rhythm</b><span>Regularitas, P wave, hubungan P–QRS, PR dan lebar QRS.</span></div><div class="cm-step"><b>3 · Axis</b><span>Gunakan Lead I dan aVF sebagai pendekatan cepat, lalu konfirmasi bila abnormal.</span></div></div></div><div class="cm-panel"><div class="cm-grid"><label class="cm-field">RR (detik)<input id="ecgRR" type="number" step=".01" placeholder="0.8"></label><label class="cm-field">QT (ms)<input id="ecgQT" type="number" placeholder="400"></label><label class="cm-field">HR (bpm)<input id="ecgHR" type="number" placeholder="75"></label><label class="cm-field">Axis I<select id="ecgI"><option value="pos">Positif</option><option value="neg">Negatif</option></select></label><label class="cm-field">Axis aVF<select id="ecgAVF"><option value="pos">Positif</option><option value="neg">Negatif</option></select></label></div><button class="cm-btn primary" id="ecgCalc" style="margin-top:14px">Hitung EKG</button><div class="cm-result" id="ecgOut">Masukkan RR/QT atau HR.</div><div class="cm-checklist" style="margin-top:18px"><label class="cm-check"><input type="checkbox"><span>Rate</span></label><label class="cm-check"><input type="checkbox"><span>Rhythm</span></label><label class="cm-check"><input type="checkbox"><span>Axis</span></label><label class="cm-check"><input type="checkbox"><span>P wave</span></label><label class="cm-check"><input type="checkbox"><span>PR interval</span></label><label class="cm-check"><input type="checkbox"><span>QRS duration / morphology</span></label><label class="cm-check"><input type="checkbox"><span>ST segment</span></label><label class="cm-check"><input type="checkbox"><span>T wave</span></label><label class="cm-check"><input type="checkbox"><span>QT/QTc</span></label><label class="cm-check"><input type="checkbox"><span>Comparison with previous ECG</span></label></div></div></div>'}

  const icd=[
    ['I10','Essential (primary) hypertension'],['E11.9','Type 2 diabetes mellitus without complications'],['J18.9','Pneumonia, unspecified organism'],['A09','Infectious gastroenteritis and colitis, unspecified'],['R50.9','Fever, unspecified'],['R07.9','Chest pain, unspecified'],['R10.9','Abdominal pain, unspecified'],['S06.0','Concussion'],['J45.9','Asthma, unspecified'],['N18.9','Chronic kidney disease, unspecified'],['I21.9','Acute myocardial infarction, unspecified'],['I63.9','Cerebral infarction, unspecified'],['K35.8','Other acute appendicitis'],['D50.9','Iron deficiency anaemia, unspecified'],['B34.9','Viral infection, unspecified']
  ];
  function icdHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Diagnosis coding</div><h2>Kamus ICD-10</h2><p>Pencarian cepat untuk kode umum. Untuk coding final, gunakan browser ICD-10 resmi dan aturan coding yang berlaku di institusi.</p></div></div><div class="cm-panel"><div class="cm-toolbar"><div class="cm-search"><input id="icdSearch" placeholder="Cari kode atau diagnosis…"></div><a class="cm-btn" href="https://www.who.int/standards/classifications/classification-of-diseases" target="_blank" rel="noopener">WHO ICD</a></div><div class="cm-list" id="icdList"></div><div class="cm-source">WHO menyediakan ICD-10 Browser versi 2019; ICD-11 menjadi revisi resmi yang berlaku sejak 2022. Pastikan kebutuhan institusi Anda sebelum memilih versi klasifikasi.</div></div>'}

  const toolkit=[
    ['ABCDE','Airway → Breathing → Circulation → Disability → Exposure. Stabilkan ancaman nyawa sebelum diagnosis definitif.'],
    ['Henti jantung','Aktifkan tim resusitasi, CPR berkualitas tinggi, monitor/defibrillator, identifikasi ritme dan reversible causes sesuai algoritme.'],
    ['Anafilaksis','Airway/breathing/circulation, epinefrin IM sesuai protokol, oksigen bila perlu, cairan dan observasi/eskalasi sesuai respons.'],
    ['Status epileptikus','ABC, cek glukosa, benzodiazepin sebagai terapi awal dan eskalasi antikejang sesuai protokol RS.'],
    ['Sepsis','Cari disfungsi organ, kultur/lab sesuai indikasi, antibiotik tepat waktu, resusitasi dan source control sesuai kondisi.'],
    ['Stroke','Last known well, glukosa, NIHSS bila tersedia, CT/MRI sesuai jalur, evaluasi reperfusi dan tekanan darah sesuai protokol.'],
    ['Hipoglikemia','Cek glukosa, koreksi cepat bila bergejala/berat, recheck dan cari penyebab.'],
    ['Hiperkalemia','Monitor EKG, stabilisasi membran bila ada indikasi, shifting dan eliminasi K sesuai derajat dan kondisi.'],
    ['Asma berat','Oksigenasi sesuai target, bronkodilator inhalasi berulang, steroid sistemik dan eskalasi bila respons buruk.']
  ];
  function toolkitHTML(){return '<button class="cm-back" data-cm-back>← Kembali ke modul utama</button><div class="cm-view-head"><div><div class="cm-kicker">Emergency department</div><h2>Toolkit IGD</h2><p>Checklist cepat untuk kondisi kegawatdaruratan yang umum. Gunakan protokol resusitasi dan eskalasi rumah sakit.</p></div></div><div class="cm-panel"><div class="cm-list">'+toolkit.map(x=>'<div class="cm-item"><span class="cm-tag">IGD</span><h4>'+esc(x[0])+'</h4><p>'+esc(x[1])+'</p></div>').join('')+'</div><div class="cm-alert cm-danger" style="margin-top:16px">Toolkit ini sengaja bersifat ringkas. Pada pasien tidak stabil, prioritaskan ABC, monitoring, panggil bantuan, dan protokol resusitasi setempat.</div></div>'}

  function renderGuides(q=''){const a=guides.filter(x=>(x.join(' ').toLowerCase()).includes(q.toLowerCase()));$('#guideList').innerHTML=a.map(x=>'<div class="cm-item"><span class="cm-tag">Guideline</span><h4>'+esc(x[0])+'</h4><p>'+esc(x[1])+'</p><p class="cm-source">'+esc(x[2])+'</p></div>').join('')||'<div class="cm-empty">Tidak ada topik yang cocok.</div>'}
  function renderInd(q=''){const a=indications.filter(x=>x.join(' ').toLowerCase().includes(q.toLowerCase()));$('#indList').innerHTML=a.map(x=>'<div class="cm-item"><span class="cm-tag">'+esc(x[0])+'</span><h4>'+esc(x[1])+'</h4><p>'+esc(x[2])+'</p></div>').join('')||'<div class="cm-empty">Tidak ditemukan.</div>'}
  function renderICD(q=''){const a=icd.filter(x=>x.join(' ').toLowerCase().includes(q.toLowerCase()));$('#icdList').innerHTML=a.map(x=>'<div class="cm-item" style="display:flex;justify-content:space-between;gap:16px"><div><span class="cm-tag">'+esc(x[0])+'</span><h4>'+esc(x[1])+'</h4></div><a class="cm-btn" target="_blank" rel="noopener" href="https://icd.who.int/browse10/2019/en#/search/'+encodeURIComponent(x[1])+'">Cari WHO</a></div>').join('')||'<div class="cm-empty">Kode tidak ditemukan pada daftar cepat.</div>'}
  function updateInteraction(){const a=$('#intA').value,b=$('#intB').value;const key=a+'|'+b;const map={};interactions.forEach(x=>{const [p,q]=x[0].split(' + ');map[p+'|'+q]=x;map[q+'|'+p]=x});const x=map[key];$('#intResult').innerHTML=x?'<span class="cm-tag">'+esc(x[1])+'</span><div class="big">'+esc(x[0])+'</div><p>'+esc(x[2])+'</p>':'<strong>Tidak ada pasangan yang terdaftar pada dataset ringkas ini.</strong><p>Hasil “tidak ditemukan” bukan berarti tidak ada interaksi. Gunakan database interaksi obat lengkap untuk keputusan klinis.</p>'}
  function anthroCalc(){const age=+$('#anAge').value,w=+$('#anW').value,h=+$('#anH').value;if(!(w>0&&h>0&&age>=0))return $('#anOut').innerHTML='Masukkan usia, berat dan tinggi.';const bmi=w/Math.pow(h/100,2);let note;if(age<5)note='Untuk usia <5 tahun, interpretasi pertumbuhan harus menggunakan indikator WHO dan z-score yang sesuai; BMI saja tidak cukup.';else if(age<=19)note='Untuk usia 5–19 tahun, WHO menggunakan BMI-for-age: overweight >+1 SD, obesity >+2 SD, thinness <−2 SD, severe thinness <−3 SD. BMI ini belum merupakan z-score.';else note='Usia di luar rentang pediatrik WHO 5–19 tahun; gunakan kriteria dewasa bila relevan.';$('#anOut').innerHTML='<div class="big">'+bmi.toFixed(1)+' kg/m²</div><p>'+note+'</p>'}
  function ecgCalc(){const rr=+$('#ecgRR').value,qt=+$('#ecgQT').value,hr=+$('#ecgHR').value|| (rr>0?60/rr:0);if(!(hr>0))return $('#ecgOut').innerHTML='Masukkan HR atau RR.';let s='<div class="big">'+hr.toFixed(0)+' bpm</div>';if(qt>0){const rr2=60/hr,b=qt/Math.sqrt(rr2),f=qt/Math.cbrt(rr2);s+='<p>QTc Bazett: <b>'+b.toFixed(0)+' ms</b><br>QTc Fridericia: <b>'+f.toFixed(0)+' ms</b></p>'}const i=$('#ecgI').value,av=$('#ecgAVF').value;let axis=i==='pos'&&av==='pos'?'Normal axis quadrant (I+, aVF+)':i==='pos'&&av==='neg'?'Left-axis quadrant (I+, aVF−)':i==='neg'&&av==='pos'?'Right-axis quadrant (I−, aVF+)':'Extreme-axis quadrant (I−, aVF−)';s+='<p><b>'+axis+'</b></p>';$('#ecgOut').innerHTML=s}
  
  document.addEventListener('click',e=>{const b=e.target.closest('[data-cm]');if(b){e.preventDefault();goCM(b.dataset.cm);return}if(e.target.closest('[data-cm-back]')){e.preventDefault();backHome()}});
  document.addEventListener('input',e=>{if(e.target.id==='guideSearch')renderGuides(e.target.value);if(e.target.id==='indSearch')renderInd(e.target.value);if(e.target.id==='icdSearch')renderICD(e.target.value)});
  document.addEventListener('change',e=>{if(e.target.id==='intA'||e.target.id==='intB')updateInteraction()});
  document.addEventListener('click',e=>{if(e.target.id==='anCalc')anthroCalc();if(e.target.id==='ecgCalc')ecgCalc()});
  
  addViews();
  renderGuides(); renderInd(); renderICD(); updateInteraction();
  const initial=(()=>{try{return localStorage.getItem('cmView')}catch{return 'home'}})();
  if(initial&&initial!=='home')goCM(initial);
})();