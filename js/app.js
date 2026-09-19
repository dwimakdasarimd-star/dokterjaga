// Logika aplikasi Dokter Jaga. Data klinis ada di js/data/*.js (dimuat lebih dulu di index.html).
(function(){
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (n, d=1) => Number.isFinite(n) ? n.toLocaleString('id-ID',{maximumFractionDigits:d,minimumFractionDigits:0}) : '—';
const store = {
  get(k, def){ try{ const v = localStorage.getItem('dj:'+k); return v ? JSON.parse(v) : def; }catch(e){ return def; } },
  set(k, v){ try{ localStorage.setItem('dj:'+k, JSON.stringify(v)); }catch(e){} }
};
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),1800); }

/* ---------- Navigation ---------- */
const VIEWS = [
  {id:'home', label:'Beranda', short:'Beranda', icon:'i-home'},
  {id:'dose', label:'Dosis obat', short:'Dosis', icon:'i-dose'},
  {id:'score', label:'Skor klinis', short:'Skor', icon:'i-score'},
  {id:'calc', label:'Kalkulator', short:'Hitung', icon:'i-calc'},
  {id:'peds', label:'Pediatri', short:'Anak', icon:'i-peds'},
  {id:'algo', label:'Algoritma', short:'Protokol', icon:'i-algo'},
  {id:'ho', label:'Catatan jaga', short:'Catatan', icon:'i-ho'}
];
function navHTML(mobile){
  return VIEWS.map(v=>`<button type="button" data-view="${v.id}"><svg aria-hidden="true"><use href="#${v.icon}"/></svg>${mobile?v.short:v.label}</button>`).join('');
}
$('#nav').innerHTML = navHTML(false);
$('#mnav').innerHTML = navHTML(true);
function go(id, anchor){
  VIEWS.forEach(v=>{ $('#v-'+v.id).hidden = v.id!==id; });
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-current', b.dataset.view===id?'page':'false'));
  store.set('view', id);
  if(anchor){ anchor(); } else { window.scrollTo({top:0}); }
}
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-view]');
  if(b){ go(b.dataset.view); refreshHomeMeta(); }
});

/* ---------- Theme ---------- */
const root = document.documentElement;
const savedTheme = store.get('theme', null);
if(savedTheme) root.dataset.theme = savedTheme;
$('#themeBtn').addEventListener('click', ()=>{
  const isDark = root.dataset.theme ? root.dataset.theme==='dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
  store.set('theme', root.dataset.theme);
});

/* ---------- Shift strip ---------- */
let shiftStart = store.get('shiftStart', null);
function shiftLabel(h){ return h>=7 && h<14 ? 'Pagi' : (h>=14 && h<21 ? 'Siang' : 'Malam'); }
function tick(){
  const d = new Date();
  const p = n=>String(n).padStart(2,'0');
  $('#clock').innerHTML = `${p(d.getHours())}:${p(d.getMinutes())}<small>:${p(d.getSeconds())}</small>`;
  $('#shiftName').textContent = shiftLabel(d.getHours());
  if(shiftStart){
    const m = Math.floor((Date.now()-shiftStart)/60000);
    $('#elapsed').textContent = `${Math.floor(m/60)} j ${p(m%60)} m`;
  } else $('#elapsed').textContent = 'belum mulai';
}
function renderShiftBtn(){ $('#shiftBtn').textContent = shiftStart ? 'Selesai jaga' : 'Mulai jaga'; }
$('#shiftBtn').addEventListener('click', ()=>{
  if(shiftStart){
    if(!confirm('Akhiri jaga dan setel ulang penghitung waktu?')) return;
    shiftStart = null; toast('Jaga selesai');
  } else { shiftStart = Date.now(); toast('Jaga dimulai'); }
  store.set('shiftStart', shiftStart); renderShiftBtn(); tick(); renderHomeMeta();
});
renderShiftBtn(); tick(); setInterval(tick, 1000);

/* ---------- Dose data ---------- */
// type 'mg': perKg in mg/kg, conc in mg/mL; type 'ml': perKg in mL/kg (volume only)
const DRUGS = DJ.DRUGS;
const doseGroups = ['Semua', ...new Set(DRUGS.map(d=>d.g))];
let doseGroup = 'Semua';
const concOverride = store.get('conc', {});
$('#doseFilters').innerHTML = doseGroups.map(g=>`<button type="button" class="chip" data-g="${esc(g)}" aria-pressed="${g===doseGroup}">${esc(g)}</button>`).join('');
$('#doseFilters').addEventListener('click', e=>{
  const b = e.target.closest('[data-g]'); if(!b) return;
  doseGroup = b.dataset.g;
  document.querySelectorAll('#doseFilters .chip').forEach(c=>c.setAttribute('aria-pressed', c.dataset.g===doseGroup));
  renderDoses();
});
function renderDoses(){
  const w = parseFloat($('#bw').value);
  const valid = w>0 && w<=250;
  const rows = DRUGS.map((d,i)=>({d,i})).filter(x=>doseGroup==='Semua'||x.d.g===doseGroup);
  $('#doseBody').innerHTML = rows.map(({d,i})=>{
    const isMl = d.type==='ml';
    let raw = valid ? w*d.perKg : NaN;
    const capped = valid && d.max!=null && raw>d.max;
    const dose = capped ? d.max : raw;
    const conc = concOverride[i] ?? d.conc;
    let doseTxt, volTxt, perTxt;
    if(isMl){
      perTxt = `${fmt(d.perKg,2)} mL/kg`;
      doseTxt = valid ? `${fmt(dose,0)} mL` : '—';
      volTxt = valid ? `${fmt(dose,0)} mL` : '—';
    } else {
      perTxt = `${fmt(d.perKg,3)} mg/kg`;
      const dp = dose<1 ? 2 : (dose<10 ? 1 : 0);
      doseTxt = valid ? `${fmt(dose,dp)} mg` : '—';
      const v = dose/conc;
      volTxt = valid && conc>0 ? `${fmt(v, v<1?2:1)} mL` : '—';
    }
    return `<tr>
      <td><div class="dname">${esc(d.n)}</div><div class="dsub">${esc(d.ind)} · ${esc(d.r)}</div></td>
      <td class="num">${perTxt}${d.max!=null?`<div class="dsub">maks. ${fmt(d.max,2)} ${isMl?'mL':'mg'}</div>`:''}</td>
      <td><div class="dose">${doseTxt}</div>${capped?'<span class="cap">dosis maksimal</span>':''}</td>
      <td>${isMl?'<span class="dsub">—</span>':`<input class="conc num" type="number" step="any" min="0" data-i="${i}" value="${conc}" aria-label="Konsentrasi ${esc(d.n)} mg/mL">`}</td>
      <td class="vol">${volTxt}</td>
      <td class="dsub">${esc(d.note)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="empty-w">Tidak ada obat di kelompok ini.</td></tr>';
  // fluids
  if(valid){
    const hs = w<=10 ? 4*w : (w<=20 ? 40+2*(w-10) : 60+(w-20));
    $('#fluid').innerHTML = `Rumatan Holliday–Segar: <strong>${fmt(hs,0)} mL/jam</strong> (${fmt(hs*24,0)} mL/hari). Bolus 20 mL/kg: <strong>${fmt(Math.min(w*20,1000),0)} mL</strong>.`;
  } else $('#fluid').textContent = 'Masukkan berat badan untuk menghitung dosis, volume, dan cairan rumatan.';
}
$('#bw').addEventListener('input', ()=>{ store.set('bw', $('#bw').value); renderDoses(); });
$('#doseBody').addEventListener('change', e=>{
  const inp = e.target.closest('input.conc'); if(!inp) return;
  const v = parseFloat(inp.value);
  if(v>0){ concOverride[inp.dataset.i]=v; } else { delete concOverride[inp.dataset.i]; }
  store.set('conc', concOverride); renderDoses();
});
$('#bw').value = store.get('bw','');
renderDoses();

/* ---------- Scores ---------- */
const SCORES = DJ.SCORES;
let curScore = SCORES[0].id;
const scoreState = {};
function getScoreState(s){
  return scoreState[s.id] || (scoreState[s.id] = {
    idx: s.items.map(it=>it.t==='sel'?it.def:null),
    vals: s.items.map(it=>it.t==='sel'?it.o[it.def][1]:0)
  });
}
function renderScoreList(){
  $('#scoreList').innerHTML = SCORES.map(s=>`<button type="button" role="tab" data-s="${s.id}" aria-current="${s.id===curScore}">${esc(s.name)}<span>${esc(s.sub)}</span></button>`).join('');
}
function renderScore(){
  const s = SCORES.find(x=>x.id===curScore);
  const st = getScoreState(s);
  $('#scorePanel').innerHTML = `<h3>${esc(s.name)}</h3><p class="muted">${esc(s.sub)}</p>
    <div class="crit">${s.items.map((it,i)=> it.t==='chk'
      ? `<div class="ci"><label class="chk"><input type="checkbox" data-i="${i}" ${st.vals[i]?'checked':''}><span>${esc(it.l)}</span></label><span class="pts">${it.p>0?'+':''}${fmt(it.p,1)}</span></div>`
      : `<div class="ci sel"><span>${esc(it.l)}</span><select data-i="${i}" aria-label="${esc(it.l)}">${it.o.map((o,oi)=>`<option value="${oi}" ${st.idx[i]===oi?'selected':''}>${esc(o[0])} (${o[1]})</option>`).join('')}</select></div>`
    ).join('')}</div>
    <div class="verdict" id="verdict"></div>
    <p class="ref">${esc(s.ref)}</p>
    <div class="ho-actions" style="margin-top:12px"><button class="btn ghost" type="button" id="scoreReset">Atur ulang</button></div>`;
  updateVerdict();
}
function updateVerdict(){
  const s = SCORES.find(x=>x.id===curScore); const st = getScoreState(s);
  const total = st.vals.reduce((a,b)=>a+b,0);
  const femIdx = s.items.findIndex(it=>it.sex);
  const [lvl, head, body] = s.interp(total, {female: femIdx>=0 && st.vals[femIdx]>0, vals: st.vals});
  let parts = '';
  if(s.showParts) parts = ` <span class="muted">(E${st.vals[0]}V${st.vals[1]}M${st.vals[2]})</span>`;
  const v = $('#verdict'); v.className = 'verdict '+lvl;
  v.innerHTML = `<div class="tot">${fmt(total,1)}</div><div><strong>${esc(head)}${parts}</strong><p>${esc(body)}</p></div>`;
}
$('#scoreList').addEventListener('click', e=>{ const b=e.target.closest('[data-s]'); if(!b) return; curScore=b.dataset.s; renderScoreList(); renderScore(); });
$('#scorePanel').addEventListener('change', e=>{
  const el = e.target; if(el.dataset.i===undefined) return;
  const s = SCORES.find(x=>x.id===curScore); const i = +el.dataset.i; const it = s.items[i]; const st = getScoreState(s);
  if(el.type==='checkbox'){ st.vals[i] = el.checked ? it.p : 0; }
  else { st.idx[i] = +el.value; st.vals[i] = it.o[st.idx[i]][1]; }
  updateVerdict();
});
$('#scorePanel').addEventListener('click', e=>{ if(e.target.id==='scoreReset'){ delete scoreState[curScore]; renderScore(); } });
renderScoreList(); renderScore();

/* ---------- Calculators ---------- */
const val = id => parseFloat($('#'+id).value);
const CALC = {
  bmi(){
    const w=val('bmiW'), h=val('bmiH')/100;
    if(!(w>0&&h>0)) return $('#bmiOut').innerHTML='<p class="muted">Isi berat dan tinggi badan.</p>';
    const b=w/(h*h);
    const c = b<18.5?'Berat badan kurang':b<23?'Normal':b<25?'Berat badan lebih (berisiko)':b<30?'Obesitas I':'Obesitas II';
    $('#bmiOut').innerHTML=`<div class="v">${fmt(b,1)}<small>kg/m²</small></div><p>${c}</p>`;
  },
  egfr(){
    const cr=val('gfrCr'), age=val('gfrAge'), f=$('#gfrSex').value==='f';
    if(!(cr>0&&age>=18)) return $('#gfrOut').innerHTML='<p class="muted">Isi kreatinin dan usia (≥18 tahun).</p>';
    const k=f?0.7:0.9, a=f?-0.241:-0.302;
    const g=142*Math.pow(Math.min(cr/k,1),a)*Math.pow(Math.max(cr/k,1),-1.2)*Math.pow(0.9938,age)*(f?1.012:1);
    const st = g>=90?'G1 (normal/tinggi)':g>=60?'G2 (menurun ringan)':g>=45?'G3a':g>=30?'G3b':g>=15?'G4':'G5 (gagal ginjal)';
    $('#gfrOut').innerHTML=`<div class="v">${fmt(g,0)}<small>mL/menit/1,73 m²</small></div><p>Kategori KDIGO ${st}</p>`;
  },
  map(){
    const s=val('mapS'), d=val('mapD');
    if(!(s>0&&d>0)) return $('#mapOut').innerHTML='<p class="muted">Isi tekanan sistolik dan diastolik.</p>';
    const m=(s+2*d)/3;
    $('#mapOut').innerHTML=`<div class="v">${fmt(m,0)}<small>mmHg</small></div><p>${m<65?'Di bawah target resusitasi syok (≥65 mmHg).':'Memenuhi target MAP ≥65 mmHg.'}</p>`;
  },
  park(){
    const w=val('pkW'), t=val('pkT');
    if(!(w>0&&t>0&&t<=100)) return $('#pkOut').innerHTML='<p class="muted">Isi berat dan luas luka bakar.</p>';
    const tot=4*w*t;
    $('#pkOut').innerHTML=`<div class="v">${fmt(tot,0)}<small>mL / 24 jam</small></div><p>${fmt(tot/2,0)} mL dalam 8 jam pertama sejak kejadian (${fmt(tot/16,0)} mL/jam), sisanya ${fmt(tot/2,0)} mL dalam 16 jam (${fmt(tot/32,0)} mL/jam). Titrasi dengan urin 0,5 mL/kg/jam (dewasa).</p>`;
  },
  hs(){
    const w=val('hsW');
    if(!(w>0)) return $('#hsOut').innerHTML='<p class="muted">Isi berat badan.</p>';
    const h = w<=10?4*w:w<=20?40+2*(w-10):60+(w-20);
    $('#hsOut').innerHTML=`<div class="v">${fmt(h,0)}<small>mL/jam</small></div><p>${fmt(h*24,0)} mL/hari. Sesuaikan untuk kondisi seperti gagal jantung, SIADH, atau dehidrasi.</p>`;
  },
  drip(){
    const v=val('drV'), t=val('drT'), f=+$('#drF').value;
    if(!(v>0&&t>0)) return $('#drOut').innerHTML='<p class="muted">Isi volume dan waktu.</p>';
    const tpm=v*f/(t*60);
    $('#drOut').innerHTML=`<div class="v">${fmt(tpm,0)}<small>tetes/menit</small></div><p>${fmt(v/t,0)} mL/jam</p>`;
  }
};
const kv = arr => `<div class="kv">${arr.map(([k,v,n])=>`<div><span>${k}</span><strong>${v}</strong>${n?`<em>${n}</em>`:''}</div>`).join('')}</div>`;
const VASO = DJ.VASO;
let vasoCur = null;
$('#vasoPreset').innerHTML = Object.entries(VASO).map(([k,v])=>`<button type="button" class="chip" data-vaso="${k}" aria-pressed="false">${esc(v.n)}</button>`).join('');
$('#vasoPreset').addEventListener('click', e=>{
  const b = e.target.closest('[data-vaso]'); if(!b) return;
  vasoCur = b.dataset.vaso; const v = VASO[vasoCur];
  document.querySelectorAll('#vasoPreset .chip').forEach(c=>c.setAttribute('aria-pressed', c.dataset.vaso===vasoCur));
  $('#vsDose').value = v.dose; $('#vsUnit').value = v.unit; $('#vsMg').value = v.mg; $('#vsMl').value = v.ml;
  CALC.vaso();
});
Object.assign(CALC, {
  agd(){
    const ph=val('agPh'), co2=val('agCo2'), h=val('agHco3'), na=val('agNa'), cl=val('agCl'), alb=val('agAlb'), chronic=$('#agChr').value==='k';
    const out=$('#agOut');
    if(!(ph>6.5&&ph<8&&co2>0&&h>0)) return out.innerHTML='<p class="muted">Isi pH, PaCO₂, dan HCO₃⁻. Na⁺ dan Cl⁻ diperlukan untuk anion gap.</p>';
    const steps=[]; let head; const prim=[];
    if(ph<7.35){ head='Asidemia'; if(h<22) prim.push('ma'); if(co2>45) prim.push('ra'); }
    else if(ph>7.45){ head='Alkalemia'; if(h>26) prim.push('mk'); if(co2<35) prim.push('rk'); }
    else {
      head='pH normal';
      if(co2>45 && h>26){ prim.push(ph<7.40?'ra':'mk'); steps.push('PaCO₂ dan HCO₃⁻ sama-sama tinggi dengan pH normal: kemungkinan gangguan campuran (asidosis respiratorik + alkalosis metabolik).'); }
      else if(co2<35 && h<22){ prim.push(ph<7.40?'ma':'rk'); steps.push('PaCO₂ dan HCO₃⁻ sama-sama rendah dengan pH normal: kemungkinan gangguan campuran (asidosis metabolik + alkalosis respiratorik).'); }
    }
    const NAME={ma:'asidosis metabolik', ra:'asidosis respiratorik', mk:'alkalosis metabolik', rk:'alkalosis respiratorik'};
    if(!prim.length && head!=='pH normal') steps.push('Pola PaCO₂ dan HCO₃⁻ tidak sesuai arah pH. Periksa ulang nilai input atau sampel (arteri vs vena).');
    if(prim.length) head += ' dengan ' + prim.map(p=>NAME[p]).join(' dan ');
    if(prim.length===2) steps.push('Kedua komponen bergerak ke arah yang sama: gangguan campuran metabolik dan respiratorik.');
    if(prim.length===1){
      const p=prim[0];
      if(p==='ma'){ const e=1.5*h+8; steps.push(`Kompensasi (Winter): PaCO₂ harapan ${fmt(e-2,0)}–${fmt(e+2,0)} mmHg. ` + (co2>e+2?'PaCO₂ lebih tinggi: ada asidosis respiratorik tambahan.':co2<e-2?'PaCO₂ lebih rendah: ada alkalosis respiratorik tambahan.':'Kompensasi respiratorik sesuai.')); }
      if(p==='mk'){ const e=0.7*h+21; steps.push(`Kompensasi: PaCO₂ harapan ${fmt(e-2,0)}–${fmt(e+2,0)} mmHg. ` + (co2>e+2?'PaCO₂ lebih tinggi: ada asidosis respiratorik tambahan.':co2<e-2?'PaCO₂ lebih rendah: ada alkalosis respiratorik tambahan.':'Kompensasi respiratorik sesuai.')); }
      if(p==='ra'){ const e=24+(chronic?3.5:1)*(co2-40)/10; steps.push(`Kompensasi ${chronic?'kronik':'akut'}: HCO₃⁻ harapan ±${fmt(e,0)} mEq/L. ` + (h>e+2?'HCO₃⁻ lebih tinggi: ada alkalosis metabolik tambahan (atau proses lebih kronik).':h<e-2?'HCO₃⁻ lebih rendah: ada asidosis metabolik tambahan.':'Kompensasi metabolik sesuai.')); }
      if(p==='rk'){ const e=24-(chronic?5:2)*(40-co2)/10; steps.push(`Kompensasi ${chronic?'kronik':'akut'}: HCO₃⁻ harapan ±${fmt(e,0)} mEq/L. ` + (h<e-2?'HCO₃⁻ lebih rendah: ada asidosis metabolik tambahan (atau proses lebih kronik).':h>e+2?'HCO₃⁻ lebih tinggi: ada alkalosis metabolik tambahan.':'Kompensasi metabolik sesuai.')); }
    }
    if(na>0&&cl>0){
      const ag=na-(cl+h); const agc = alb>0 ? ag+2.5*(4-alb) : ag;
      steps.push(`Anion gap ${fmt(ag,0)}${alb>0?` (terkoreksi albumin ${fmt(agc,0)})`:''} mEq/L; normal ±12.`);
      if(agc>12){
        if(h<24){ const dr=(agc-12)/(24-h);
          steps.push(`Asidosis metabolik anion gap tinggi. Rasio delta ${fmt(dr,2)}: ` + (dr<0.4?'dominan asidosis non-anion gap (hiperkloremik).':dr<0.8?'kombinasi asidosis anion gap tinggi dan non-anion gap.':dr<=2?'asidosis anion gap tinggi murni.':'ada alkalosis metabolik bersamaan (atau asidosis respiratorik kronik).'));
        } else steps.push('Anion gap tinggi dengan HCO₃⁻ normal atau tinggi: curigai asidosis metabolik tersembunyi bersama alkalosis metabolik.');
        steps.push('Cari penyebab anion gap tinggi: laktat, ketoasidosis, uremia, toksin (metanol, etilen glikol, salisilat).');
      } else if(prim.includes('ma')) steps.push('Asidosis metabolik non-anion gap: pertimbangkan diare, asidosis tubulus ginjal, atau pemberian NaCl 0,9% berlebih.');
    } else if(prim.includes('ma')) steps.push('Isi Na⁺ dan Cl⁻ untuk menghitung anion gap.');
    if(!steps.length) steps.push('Tidak tampak gangguan asam-basa primer dari nilai yang dimasukkan.');
    out.innerHTML = `<div class="agd-head">${esc(head)}</div><ol class="agd-steps">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`;
  },
  vaso(){
    const d=val('vsDose'), u=$('#vsUnit').value, w=val('vsW'), mg=val('vsMg'), ml=val('vsMl');
    const needW = u==='kgmin';
    if(!(d>0&&mg>0&&ml>0&&(!needW||w>0))) return $('#vsOut').innerHTML='<p class="muted">Pilih obat atau isi dosis, sediaan, dan berat badan.</p>';
    const conc=mg*1000/ml; const mcgMin = needW ? d*w : d; const rate = mcgMin*60/conc;
    const note = vasoCur && VASO[vasoCur].unit===u ? VASO[vasoCur].range : '';
    $('#vsOut').innerHTML=`<div class="v">${fmt(rate, rate<10?1:0)}<small>mL/jam</small></div><p>Konsentrasi ${fmt(conc,1)} mcg/mL (${fmt(mg,2)} mg dalam ${fmt(ml,0)} mL); ${fmt(mcgMin,1)} mcg/menit. ${esc(note)}</p>`;
  },
  crcl(){
    const a=val('ccAge'), w=val('ccW'), cr=val('ccCr'), f=$('#ccSex').value==='f';
    if(!(a>=18&&w>0&&cr>0)) return $('#ccOut').innerHTML='<p class="muted">Isi usia (≥18 tahun), berat, dan kreatinin.</p>';
    const c=(140-a)*w/(72*cr)*(f?0.85:1);
    $('#ccOut').innerHTML=`<div class="v">${fmt(c,0)}<small>mL/menit</small></div><p>Gunakan berat aktual; pada obesitas pertimbangkan berat badan ideal atau disesuaikan.</p>`;
  },
  elec(){
    const na=val('elNa'), glu=val('elGlu'), ca=val('elCa'), alb=val('elAlb'), cl=val('elCl'), h=val('elHco3');
    const r=[];
    if(na>0&&glu>0){ const x = glu>100 ? (glu-100)/100 : 0; r.push(['Na⁺ terkoreksi glukosa', `${fmt(na+1.6*x,1)}`, `Katz 1,6; Hillier 2,4 → ${fmt(na+2.4*x,1)}`]); }
    if(ca>0&&alb>0) r.push(['Ca terkoreksi albumin', `${fmt(ca+0.8*(4-alb),1)} mg/dL`, 'Normal 8,5–10,5 mg/dL']);
    if(na>0&&cl>0&&h>0){ const ag=na-(cl+h); r.push(['Anion gap', `${fmt(ag,0)}`, 'Normal ±8–12 mEq/L']); if(alb>0) r.push(['AG terkoreksi albumin', `${fmt(ag+2.5*(4-alb),0)}`, '']); }
    $('#elOut').innerHTML = r.length ? kv(r) : '<p class="muted">Isi Na⁺ + glukosa, Ca + albumin, atau Na⁺ + Cl⁻ + HCO₃⁻.</p>';
  },
  fwd(){
    const w=val('fwW'), na=val('fwNa'), f=+$('#fwF').value;
    if(!(w>0&&na>0)) return $('#fwOut').innerHTML='<p class="muted">Isi berat dan natrium.</p>';
    if(na<=145) return $('#fwOut').innerHTML='<p class="muted">Natrium tidak meningkat (≤145 mEq/L); tidak ada defisit air bebas.</p>';
    const d=f*w*(na/140-1);
    $('#fwOut').innerHTML=`<div class="v">${fmt(d,1)}<small>L</small></div><p>Turunkan Na⁺ maksimal 10–12 mEq/L per 24 jam pada hipernatremia kronik. Tambahkan kehilangan cairan yang sedang berlangsung.</p>`;
  },
  qtc(){
    const qt=val('qtQt'), hr=val('qtHr');
    if(!(qt>0&&hr>0)) return $('#qtOut').innerHTML='<p class="muted">Isi interval QT dan laju jantung.</p>';
    const rr=60/hr, b=qt/Math.sqrt(rr), fr=qt/Math.cbrt(rr);
    const warn = Math.max(b,fr)>=500 ? 'QTc ≥500 ms: risiko torsades de pointes tinggi. Hentikan obat pemanjang QT, koreksi K⁺ dan Mg²⁺.' : Math.max(b,fr)>460 ? 'Memanjang (>450 ms pria, >460 ms wanita).' : 'Dalam batas normal.';
    $('#qtOut').innerHTML = kv([['Bazett', `${fmt(b,0)} ms`, ''], ['Fridericia', `${fmt(fr,0)} ms`, hr>90||hr<60?'Lebih akurat pada takikardia/bradikardia':'']]) + `<p>${warn}</p>`;
  },
  preg(){
    const v=$('#pgLmp').value;
    if(!v) return $('#pgOut').innerHTML='<p class="muted">Pilih tanggal hari pertama haid terakhir.</p>';
    const lmp=new Date(v+'T00:00:00'); const today=new Date(); today.setHours(0,0,0,0);
    const days=Math.round((today-lmp)/86400000);
    if(days<0||days>310) return $('#pgOut').innerHTML='<p class="muted">Tanggal HPHT di luar rentang kehamilan. Periksa kembali.</p>';
    const edd=new Date(lmp.getTime()+280*86400000);
    const wk=Math.floor(days/7), dd=days%7; const tri = wk<14?'Trimester I':wk<28?'Trimester II':'Trimester III';
    $('#pgOut').innerHTML = kv([['Usia kehamilan', `${wk} mgg ${dd} hr`, tri], ['Taksiran persalinan', edd.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}), days>280?'Sudah melewati HPL':`${280-days} hari lagi`]]) + '<p>Bila siklus tidak teratur atau HPHT tidak pasti, gunakan USG trimester I.</p>';
  },
  tpa(){
    const w=val('tpW'), drug=$('#tpDrug').value;
    if(!(w>0)) return $('#tpOut').innerHTML='<p class="muted">Isi berat badan.</p>';
    if(drug==='alt'){
      const tot=Math.min(0.9*w,90);
      $('#tpOut').innerHTML = kv([['Dosis total', `${fmt(tot,1)} mg`, w>100?'Dosis maksimal 90 mg':'0,9 mg/kg'], ['Bolus 10% (1 menit)', `${fmt(tot*0.1,1)} mg`, ''], ['Infus 90% (60 menit)', `${fmt(tot*0.9,1)} mg`, `${fmt(tot*0.9,1)} mL/jam bila 1 mg/mL`]]) + '<p>TD harus &lt;185/110 sebelum dan dijaga &lt;180/105 selama 24 jam. Tidak ada antitrombotik 24 jam.</p>';
    } else {
      const tot=Math.min(0.25*w,25);
      $('#tpOut').innerHTML = kv([['Dosis bolus tunggal', `${fmt(tot,1)} mg`, w>100?'Dosis maksimal 25 mg':'0,25 mg/kg dalam 5–10 detik']]) + '<p>TD harus &lt;185/110 sebelum dan dijaga &lt;180/105 selama 24 jam.</p>';
    }
  },
  conv(){
    const v=val('cvV'), t=$('#cvT').value;
    if(!(v>=0)||$('#cvV').value==='') return $('#cvOut').innerHTML='<p class="muted">Isi nilai yang ingin dikonversi.</p>';
    const C={glu:[18,'mg/dL','mmol/L'], cr:[1/88.4,'mg/dL','µmol/L'], ur:[2.14,'Ureum mg/dL','BUN mg/dL'], ca:[4.008,'mg/dL','mmol/L'], chol:[38.67,'mg/dL','mmol/L']}[t];
    const [f,a,b]=C;
    $('#cvOut').innerHTML = kv([[`${fmt(v,2)} ${a}`, `${fmt(v/f,2)}`, b], [`${fmt(v,2)} ${b}`, `${fmt(v*f,2)}`, a]]);
  }
});
document.querySelectorAll('[data-c]').forEach(el=>el.addEventListener('input', ()=>CALC[el.dataset.c]()));
Object.values(CALC).forEach(fn=>fn());

/* ---------- Algorithms ---------- */
const ALGOS = DJ.ALGOS;
$('#algos').innerHTML = ALGOS.map(a=>`<details class="algo" id="a-${a.id}"><summary><h3>${esc(a.title)}</h3><span class="tag ${a.tag[0]}">${esc(a.tag[1])}</span></summary>
  <ol class="steps">${a.steps.map(s=>`<li><div>${s[0]?`<span class="when">${esc(s[0])}</span>`:''}<b>${esc(s[1])}</b><p>${esc(s[2])}</p></div></li>`).join('')}</ol>
  <p class="ref" style="padding:0 20px 18px;margin:0">${esc(a.ref)}</p></details>`).join('');

/* ---------- Handover ---------- */
let patients = store.get('patients', []);
const TRI_ORDER = {merah:0,kuning:1,hijau:2};
function saveHO(){ store.set('patients', patients); renderHO(); renderHomeMeta(); }
function renderHO(){
  const open = patients.filter(p=>!p.done).length;
  $('#openTasks').textContent = open;
  $('#hoCount').textContent = patients.length ? `${patients.length} pasien, ${open} belum selesai` : 'Belum ada pasien';
  const sorted = [...patients].sort((a,b)=>(a.done-b.done)||(TRI_ORDER[a.tri]-TRI_ORDER[b.tri])||(a.t-b.t));
  $('#hoList').innerHTML = sorted.length ? sorted.map(p=>`<div class="pt ${p.tri} ${p.done?'done':''}">
    <div class="tri" aria-label="Triase ${p.tri}"></div>
    <div class="bed">${esc(p.bed)}</div>
    <div class="body"><b>${esc(p.id)}${p.dx?' — '+esc(p.dx):''}</b>${p.todo?`<p>${esc(p.todo)}</p>`:''}</div>
    <div class="acts"><button type="button" data-done="${p.t}">${p.done?'Buka lagi':'Selesai'}</button><button type="button" data-del="${p.t}">Hapus</button></div>
  </div>`).join('') : '<p class="muted">Tambahkan pasien pertama Anda dengan formulir di atas. Daftar diurutkan berdasarkan triase.</p>';
}
$('#hoForm').addEventListener('submit', e=>{
  e.preventDefault();
  patients.push({t:Date.now(), bed:$('#hoBed').value.trim(), id:$('#hoId').value.trim(), dx:$('#hoDx').value.trim(), tri:$('#hoTri').value, todo:$('#hoTodo').value.trim(), done:false});
  e.target.reset(); $('#hoTri').value='kuning'; $('#hoBed').focus();
  saveHO(); toast('Pasien ditambahkan');
});
$('#hoList').addEventListener('click', e=>{
  const d=e.target.closest('[data-done]'), x=e.target.closest('[data-del]');
  if(d){ const p=patients.find(p=>p.t==d.dataset.done); p.done=!p.done; saveHO(); }
  if(x){ if(confirm('Hapus pasien ini dari daftar?')){ patients=patients.filter(p=>p.t!=x.dataset.del); saveHO(); } }
});
$('#hoClear').addEventListener('click', ()=>{ const n=patients.filter(p=>p.done).length; if(!n) return toast('Belum ada pasien yang selesai'); patients=patients.filter(p=>!p.done); saveHO(); toast(`${n} pasien dihapus`); });
$('#hoCopy').addEventListener('click', ()=>{
  const open = [...patients].filter(p=>!p.done).sort((a,b)=>TRI_ORDER[a.tri]-TRI_ORDER[b.tri]);
  if(!open.length) return toast('Tidak ada pasien terbuka untuk disalin');
  const d = new Date();
  const txt = `Serah terima ${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}\n\n` +
    open.map(p=>`[${p.tri.toUpperCase()}] Bed ${p.bed} — ${p.id}${p.dx?'\nDx: '+p.dx:''}${p.todo?'\nTindak lanjut: '+p.todo:''}`).join('\n\n');
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(()=>toast('Ringkasan disalin')).catch(()=>{ prompt('Salin ringkasan berikut:', txt); });
});
renderHO();
renderHomeMeta();

/* ---------- Pediatrics ---------- */
const VITALS = DJ.VITALS;
$('#vitBody').innerHTML = VITALS.map(r=>`<tr>${r.map((c,i)=>`<td${i?' class="num"':''}>${i?esc(c):`<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('');
const half = x => Math.round(x*2)/2;
let pdWeight = NaN;
function peds(){
  const a=parseFloat($('#pdAge').value), unit=$('#pdUnit').value, wIn=parseFloat($('#pdW').value);
  const months = a>=0 ? (unit==='m' ? a : a*12) : NaN, yrs = months/12;
  let est = NaN;
  if(months>=0 && months<12) est = 0.5*months+4;
  else if(yrs>=1 && yrs<=5) est = 2*yrs+8;
  else if(yrs>5 && yrs<=12) est = 3*yrs+7;
  const w = wIn>0 ? wIn : est;
  pdWeight = w;
  $('#pdNote').textContent = wIn>0 ? 'Menggunakan berat yang Anda masukkan.' : (est>0 ? `Estimasi berat dari usia: ${fmt(est,1)} kg.` : (months>144 ? 'Usia >12 tahun: rumus estimasi tidak berlaku, masukkan berat aktual.' : 'Isi usia atau berat badan.'));
  if(!(w>0)) return $('#pdOut').innerHTML='';
  let ett='—', depth='—';
  if(yrs>=1){ const u=half(yrs/4+4), c=half(yrs/4+3.5); ett=`${fmt(c,1)} ber-cuff`; depth=`${fmt(u*3,1)} cm`; ett+=` / ${fmt(u,1)} tanpa cuff`; }
  else if(months>=0){ ett = months<1 ? '3,0 ber-cuff / 3,5 tanpa cuff' : '3,0–3,5 ber-cuff / 3,5–4,0 tanpa cuff'; depth = months<1 ? '9–10 cm' : '10–11 cm'; }
  let hypo='—';
  if(months>=0){ hypo = months<1 ? '<60' : months<12 ? '<70' : yrs<=10 ? `<${fmt(70+2*Math.floor(yrs),0)}` : '<90'; }
  $('#pdOut').innerHTML = [
    ['Berat', `${fmt(w,1)} kg`, wIn>0?'aktual':'estimasi'],
    ['Epinefrin henti jantung', `${fmt(Math.min(0.01*w,1),2)} mg`, `${fmt(Math.min(0.1*w,10),1)} mL larutan 1:10.000`],
    ['Defibrilasi', `${fmt(2*w,0)} J → ${fmt(4*w,0)} J`, '2 J/kg lalu 4 J/kg (maks. 10 J/kg)'],
    ['Kardioversi sinkron', `${fmt(0.5*w,0)}–${fmt(w,0)} J`, '0,5–1 J/kg, lalu 2 J/kg'],
    ['Amiodaron', `${fmt(Math.min(5*w,300),0)} mg`, '5 mg/kg (maks. 300 mg)'],
    ['Bolus cairan', `${fmt(Math.min(10*w,500),0)}–${fmt(Math.min(20*w,1000),0)} mL`, '10–20 mL/kg kristaloid'],
    ['Dekstrosa 10%', `${fmt(2*w,0)}–${fmt(Math.min(5*w,250),0)} mL`, '2–5 mL/kg'],
    ['Pipa endotrakeal (ID mm)', ett, `Kedalaman oral ${depth}`],
    ['Batas hipotensi sistolik', `${hypo} mmHg`, '']
  ].map(([k,v,n])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong>${n?`<em>${esc(n)}</em>`:''}</div>`).join('');
}
['pdAge','pdUnit','pdW'].forEach(id=>$('#'+id).addEventListener('input', peds));
$('#pdToDose').addEventListener('click', ()=>{
  if(!(pdWeight>0)) return toast('Isi usia atau berat badan terlebih dahulu');
  $('#bw').value = Math.round(pdWeight*10)/10; store.set('bw', $('#bw').value); renderDoses(); go('dose'); toast(`Berat ${fmt(pdWeight,1)} kg dipakai`);
});
peds();
function dehid(){
  const w=parseFloat($('#dhW').value), young=$('#dhAge').value==='lt', deg=$('#dhDeg').value;
  const zinc = young ? 'Zinc 10 mg/hari (<6 bulan) atau 20 mg/hari (≥6 bulan) selama 10 hari.' : 'Zinc 20 mg/hari selama 10 hari.';
  if(deg==='a'){ $('#dhOut').innerHTML = `<div class="agd-head">Rencana A — di rumah</div><p>Oralit setiap BAB cair: &lt;2 tahun 50–100 mL, 2–10 tahun 100–200 mL, &gt;10 tahun sebanyak yang diinginkan. Lanjutkan ASI dan makan. ${zinc} Edukasi tanda bahaya.</p>`; return; }
  if(!(w>0)) return $('#dhOut').innerHTML='<p class="muted">Isi berat badan.</p>';
  if(deg==='b'){ const v=75*w; $('#dhOut').innerHTML = `<div class="agd-head">Rencana B — oralit di fasilitas</div>` + kv([['Oralit dalam 3 jam', `${fmt(v,0)} mL`, '75 mL/kg'], ['Rata-rata', `${fmt(v/3,0)} mL/jam`, 'sendok atau gelas kecil']]) + `<p>Nilai ulang setelah 3 jam dan pilih rencana sesuai derajat. ${zinc}</p>`; return; }
  const a=30*w, b=70*w;
  $('#dhOut').innerHTML = `<div class="agd-head">Rencana C — cairan IV (Ringer laktat)</div>` + kv([
    [young?'Tahap 1: 1 jam':'Tahap 1: 30 menit', `${fmt(a,0)} mL`, `30 mL/kg, ${fmt(young?a:a*2,0)} mL/jam`],
    [young?'Tahap 2: 5 jam':'Tahap 2: 2,5 jam', `${fmt(b,0)} mL`, `70 mL/kg, ${fmt(young?b/5:b/2.5,0)} mL/jam`]
  ]) + `<p>Ulangi tahap 1 sekali bila nadi radialis masih lemah. Nilai ulang tiap 1–2 jam; mulai oralit 5 mL/kg/jam begitu bisa minum. Hati-hati pada gizi buruk (protokol tersendiri).</p>`;
}
['dhW','dhAge','dhDeg'].forEach(id=>$('#'+id).addEventListener('input', dehid));
dehid();

/* ---------- SOAP ---------- */
const SOAP_IDS = ['soTd','soHr','soRr','soT','soSp','soS','soO','soA','soP'];
const soapDraft = store.get('soap', {});
SOAP_IDS.forEach(id=>{ if(soapDraft[id]) $('#'+id).value = soapDraft[id]; });
document.querySelectorAll('[data-soap]').forEach(el=>el.addEventListener('input', ()=>{
  const d={}; SOAP_IDS.forEach(id=>{ d[id]=$('#'+id).value; }); store.set('soap', d);
}));
$('#soCopy').addEventListener('click', ()=>{
  const g=id=>$('#'+id).value.trim();
  const vit=[g('soTd')&&`TD ${g('soTd')} mmHg`, g('soHr')&&`N ${g('soHr')}×/mnt`, g('soRr')&&`RR ${g('soRr')}×/mnt`, g('soT')&&`S ${g('soT')}°C`, g('soSp')&&`SpO₂ ${g('soSp')}%`].filter(Boolean).join(', ');
  const o=[vit, g('soO')].filter(Boolean).join('\n');
  if(!g('soS')&&!o&&!g('soA')&&!g('soP')) return toast('Catatan masih kosong');
  const txt=`S: ${g('soS')||'-'}\nO: ${o||'-'}\nA: ${g('soA')||'-'}\nP: ${g('soP')||'-'}`;
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(()=>toast('Catatan disalin')).catch(()=>{ prompt('Salin catatan berikut:', txt); });
});
$('#soClear').addEventListener('click', ()=>{ if(!confirm('Kosongkan catatan SOAP?')) return; SOAP_IDS.forEach(id=>{ $('#'+id).value=''; }); store.set('soap', {}); toast('Catatan dikosongkan'); });

/* ---------- Home: index & search ---------- */
const jumpTo = (view, el) => () => go(view, ()=>{ const n=$('#'+el); n.scrollIntoView({block:'start'}); const i=n.querySelector('input,select'); if(i) i.focus({preventScroll:true}); });
const INDEX = [
  ...DRUGS.map(d=>({t:`${d.n} — ${d.ind}`, k:`${d.n} ${d.ind} ${d.g} dosis obat`, cat:'Dosis', go:()=>go('dose',()=>{$('#bw').focus();})})),
  ...SCORES.map(s=>({t:s.name, k:`${s.name} ${s.sub} skor`, cat:'Skor', go:()=>go('score',()=>{curScore=s.id;renderScoreList();renderScore();window.scrollTo({top:0});})})),
  ...[
    ['Analisis gas darah','agd asam basa ph pco2 hco3 winter anion gap asidosis alkalosis','c-agd'],
    ['Infus obat vasoaktif','vasopresor norepinefrin epinefrin dobutamin dopamin nitrogliserin syringe pump mcg kg menit','c-vaso'],
    ['Indeks massa tubuh','imt bmi berat tinggi obesitas','c-bmi'],
    ['eGFR CKD-EPI 2021','egfr gfr kreatinin ginjal ckd','c-egfr'],
    ['Klirens kreatinin Cockcroft–Gault','crcl cockcroft gault klirens ginjal dosis','c-crcl'],
    ['Koreksi elektrolit','natrium kalsium albumin anion gap koreksi glukosa hiperglikemia','c-elec'],
    ['Defisit air bebas','hipernatremia air bebas natrium','c-fwd'],
    ['QT terkoreksi','qtc bazett fridericia ekg qt','c-qtc'],
    ['Usia kehamilan dan HPL','hpht hpl naegele hamil kehamilan obstetri','c-preg'],
    ['Trombolisis stroke','alteplase rtpa tenekteplase stroke trombolisis','c-tpa'],
    ['Konversi satuan lab','konversi mmol mg dl ureum bun kreatinin kolesterol','c-conv'],
    ['Tekanan arteri rerata (MAP)','map tekanan darah mean arterial','c-map'],
    ['Parkland luka bakar','parkland luka bakar combustio burn cairan','c-parkland'],
    ['Cairan rumatan Holliday–Segar','holliday segar rumatan maintenance cairan','c-hs'],
    ['Tetesan infus','tetes tpm infus drip','c-drip']
  ].map(([t,k,el])=>({t, k, cat:'Kalkulator', go:jumpTo('calc',el)})),
  {t:'Kartu resusitasi anak', k:'pediatri anak resusitasi ett defibrilasi berat estimasi apls', cat:'Pediatri', go:jumpTo('peds','c-resus')},
  {t:'Tanda vital normal anak', k:'pediatri anak tanda vital nadi napas tekanan darah', cat:'Pediatri', go:jumpTo('peds','c-vital')},
  {t:'Rehidrasi diare anak', k:'pediatri anak diare dehidrasi oralit rencana who', cat:'Pediatri', go:jumpTo('peds','c-dehid')},
  ...ALGOS.map(a=>({t:a.title, k:`${a.title} ${a.tag[1]} algoritma protokol`, cat:'Algoritma', go:()=>go('algo',()=>{const el=$('#a-'+a.id); el.open=true; el.scrollIntoView({block:'start'});})})),
  {t:'Serah terima pasien', k:'operan serah terima handover pasien catatan', cat:'Catatan', go:()=>go('ho',()=>$('#hoBed').focus())},
  {t:'Catatan SOAP', k:'soap rekam medis catatan poliklinik anamnesis', cat:'Catatan', go:jumpTo('ho','c-soap')}
];
function renderHomeMeta(){
  const tools = INDEX.length;
  const open = patients.filter(p=>!p.done).length;
  $('#toolCount').textContent = tools;
  $('#homeOpenTasks').textContent = open;
  $('#homeShiftState').textContent = shiftStart ? 'Sedang jaga' : 'Belum mulai';
}
function refreshHomeMeta(){
  if(document.querySelector('#v-home:not([hidden])')) renderHomeMeta();
}
const QUICK_TOOLS = [
  ['Dosis obat IGD','Hitung cepat berdasarkan berat badan',()=>go('dose',()=>$('#bw').focus())],
  ['Skor klinis','NEWS2, GCS, HEART, Wells, dll.',()=>go('score')],
  ['Kalkulator','AGD, eGFR, MAP, Parkland, vasoaktif',()=>go('calc')],
  ['Algoritma','Buka protokol kegawatdaruratan',()=>go('algo')]
];
$('#quickTools').innerHTML = QUICK_TOOLS.map((x,i)=>`<button type="button" class="quick-tool" data-quick="${i}"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></button>`).join('');
$('#quickTools').addEventListener('click',e=>{const b=e.target.closest('[data-quick]');if(b)QUICK_TOOLS[+b.dataset.quick][2]();});
$('#focusSearch').addEventListener('click',()=>$('#q').focus());

function runSearch(){
  const q = $('#q').value.trim().toLowerCase();
  if(!q){ $('#results').innerHTML=''; return; }
  const terms = q.split(/\s+/);
  const hits = INDEX.filter(x=>{ const h=(x.t+' '+x.k).toLowerCase(); return terms.every(t=>h.includes(t)); }).sort((a,b)=>(b.t.toLowerCase().includes(q))-(a.t.toLowerCase().includes(q))).slice(0,8);
  $('#results').innerHTML = hits.length ? hits.map((h)=>`<button type="button" data-hit="${INDEX.indexOf(h)}">${esc(h.t)}<em>${esc(h.cat)}</em></button>`).join('') : '<p class="muted" style="padding:10px 14px">Tidak ditemukan. Coba kata lain, mis. "kejang" atau "sepsis".</p>';
}
$('#q').addEventListener('input', runSearch);
$('#q').addEventListener('keydown', e=>{ if(e.key==='Enter'){ const b=$('#results [data-hit]'); if(b) b.click(); } });
$('#results').addEventListener('click', e=>{ const b=e.target.closest('[data-hit]'); if(b) INDEX[+b.dataset.hit].go(); });
const byTitle = t => () => INDEX.find(x=>x.t===t).go();
const HOME_COLS = [
  {h:'Di IGD', items:[
    ['Dosis obat IGD','Resusitasi, kejang, alergi per kg', ()=>go('dose',()=>{$('#bw').focus();})],
    ['Henti jantung dewasa','Siklus RJP, obat, 5H 5T', byTitle('Henti jantung dewasa')],
    ['Sindrom koroner akut','EKG, antiplatelet, reperfusi', byTitle('Sindrom koroner akut')],
    ['Stroke akut','Kode stroke dan trombolisis', byTitle('Stroke akut')],
    ['Infus vasoaktif','Norepinefrin, dobutamin, NTG', byTitle('Infus obat vasoaktif')]
  ]},
  {h:'Menilai risiko', items:[
    ['NEWS2','Deteksi perburukan pasien', byTitle('NEWS2')],
    ['GCS','Tingkat kesadaran', byTitle('GCS')],
    ['HEART','Nyeri dada di IGD', byTitle('HEART')],
    ['Wells dan PERC','Emboli paru', byTitle('Wells PE')],
    ['Alvarado','Apendisitis akut', byTitle('Alvarado')]
  ]},
  {h:'Pediatri', items:[
    ['Kartu resusitasi anak','ETT, energi defibrilasi, dosis dari usia', byTitle('Kartu resusitasi anak')],
    ['Tanda vital normal','Nadi, napas, TD per usia', byTitle('Tanda vital normal anak')],
    ['Rehidrasi diare','Rencana A, B, C WHO', byTitle('Rehidrasi diare anak')]
  ]},
  {h:'Di poliklinik', items:[
    ['Analisis gas darah','Asam-basa, Winter, anion gap', byTitle('Analisis gas darah')],
    ['Fungsi ginjal','eGFR dan klirens kreatinin', byTitle('eGFR CKD-EPI 2021')],
    ['Usia kehamilan','HPHT ke usia kehamilan dan HPL', byTitle('Usia kehamilan dan HPL')],
    ['Catatan SOAP','Susun dan salin ke rekam medis', byTitle('Catatan SOAP')]
  ]}
];
$('#homeGrid').innerHTML = HOME_COLS.map((c,ci)=>`<div class="home-col"><h3>${esc(c.h)}</h3>${c.items.map((it,ii)=>`<button type="button" data-home="${ci}-${ii}">${esc(it[0])}<span>${esc(it[1])}</span></button>`).join('')}</div>`).join('');
$('#homeGrid').addEventListener('click', e=>{ const b=e.target.closest('[data-home]'); if(!b) return; const [c,i]=b.dataset.home.split('-').map(Number); HOME_COLS[c].items[i][2](); });
go(store.get('view','home'));
})();
