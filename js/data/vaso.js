// Preset infus obat vasoaktif: mg obat dalam ml pelarut, dosis awal, satuan ('kgmin' = mcg/kg/menit, 'min' = mcg/menit).
// Sumber rujukan dicantumkan per item. Verifikasi dengan formularium dan protokol setempat.
window.DJ = window.DJ || {};
DJ.VASO = {
  ne:{n:'Norepinefrin', mg:4, ml:50, dose:0.1, unit:'kgmin', range:'Rentang lazim 0,05–0,5 mcg/kg/menit; bisa lebih tinggi pada syok refrakter.'},
  epi:{n:'Epinefrin', mg:1, ml:50, dose:0.05, unit:'kgmin', range:'Rentang lazim 0,05–0,5 mcg/kg/menit.'},
  dobu:{n:'Dobutamin', mg:250, ml:50, dose:5, unit:'kgmin', range:'Rentang lazim 2–20 mcg/kg/menit.'},
  dopa:{n:'Dopamin', mg:200, ml:50, dose:5, unit:'kgmin', range:'Rentang lazim 2–20 mcg/kg/menit.'},
  ntg:{n:'Nitrogliserin', mg:10, ml:50, dose:10, unit:'min', range:'Mulai 5–10 mcg/menit, naikkan 5–10 mcg/menit tiap 3–5 menit (maks. ±200).'}
};
