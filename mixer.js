const SPECTRUM_COLOURS=[
 {name:'Egyptian Cotton',hex:'#E8DDC9'}, {name:'Perfectly Taupe',hex:'#B9A88C'},
 {name:'Natural Hessian',hex:'#C8B79A'}, {name:'Gentle Fawn',hex:'#BFA98D'},
 {name:'Almost Oyster',hex:'#D9D2C3'}, {name:'Spiced Honey',hex:'#C98A43'},
 {name:'Soft Truffle',hex:'#9D8069'}, {name:'Sandstone',hex:'#C7A27C'},
 {name:'Mellow Mocha',hex:'#8B6D58'}, {name:'Pale Taupe',hex:'#CFC3B0'},
 {name:'Boutique Cream',hex:'#E6D3AE'}, {name:'Fresh Sage',hex:'#8FAE83'},
 {name:'Emerald Glade',hex:'#2F6B55'}, {name:'Overtly Olive',hex:'#777B45'},
 {name:'Forest Shade',hex:'#31563C'}, {name:'Sapphire Salute',hex:'#203E73'},
 {name:'Vast Lake',hex:'#B6C6D6'}, {name:'Denim Drift',hex:'#4B6783'},
 {name:'Teal Tension',hex:'#2F7773'}, {name:'Roasted Red',hex:'#A64A4B'},
 {name:'Raspberry Diva',hex:'#9B3E62'}, {name:'Honey Mustard',hex:'#C79B32'},
 {name:'Warm Pewter',hex:'#8D877D'}, {name:'Urban Obsession',hex:'#777A78'}
];

function hexToRgb(hex){const n=hex.replace('#','');return [parseInt(n.slice(0,2),16),parseInt(n.slice(2,4),16),parseInt(n.slice(4,6),16)]}
function rgbToHex(rgb){return '#'+rgb.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('').toUpperCase()}
function mixPaintHex(colours,weights){const total=weights.reduce((a,b)=>a+b,0)||1;const rgb=[0,0,0];colours.forEach((c,i)=>{const w=(weights[i]||0)/total;const p=hexToRgb(c.hex);p.forEach((v,j)=>{rgb[j]+=Math.pow(v/255,2.2)*w})});return rgbToHex(rgb.map(v=>Math.pow(v,1/2.2)*255))}
function normaliseWeights(values){const active=values.map(Number);const total=active.reduce((a,b)=>a+b,0)||1;return active.map(v=>Math.round(v/total*100))}

window.SpectrumMixer={SPECTRUM_COLOURS,mixPaintHex,normaliseWeights,hexToRgb,rgbToHex};

const mixerRoot=document.getElementById('mixer');
if(mixerRoot){
 const selects=[...document.querySelectorAll('.mix-colour')];const ranges=[...document.querySelectorAll('.mix-range')];
 selects.forEach((select,index)=>{SPECTRUM_COLOURS.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=c.name;select.appendChild(o)});select.value=[0,15,11][index]});
 const state={weights:[50,50,0],colours:[0,15,11]};
 const update=()=>{
  state.weights=ranges.map(r=>Number(r.value));state.colours=selects.map(s=>Number(s.value));
  const weights=normaliseWeights(state.weights);const active=state.colours.map(i=>SPECTRUM_COLOURS[i]);const result=mixPaintHex(active,state.weights);const names=active.filter((_,i)=>state.weights[i]>0).map((c,i)=>c.name);
  document.getElementById('mixHex').textContent=result;document.getElementById('mixLiquid').style.background=`radial-gradient(circle at 35% 25%,rgba(255,255,255,.5),transparent 24%),${result}`;
  document.getElementById('mixLabel').textContent=names.join(' + ')||'Custom Spectrum Blend';document.getElementById('mixName').textContent=names.join(' + ')||'Custom Spectrum Blend';
  document.getElementById('ratio').textContent=weights.filter((_,i)=>state.weights[i]>0).join(' / ')||'0';
  ranges.forEach((r,i)=>{document.getElementById(`pct${i}`).textContent=`${weights[i]}%`;document.getElementById(`dot${i}`).style.background=SPECTRUM_COLOURS[state.colours[i]].hex});
  const msg=`Hello Spectrum Paint, I created a custom colour in the Paint Lab.\nDigital result: ${result}\nBlend: ${names.map((n,i)=>`${n} ${weights[i]}%`).join(', ')}`;document.getElementById('requestMix').href=`https://wa.me/2347031954820?text=${encodeURIComponent(msg)}`;
 };
 ranges.forEach((r,index)=>r.addEventListener('input',()=>{if(index<2){const other=index===0?1:0;const remainder=100-Number(r.value);ranges[other].value=Math.max(0,remainder);if(Number(r.value)===0)ranges[2].value=0}update()}));
 selects.forEach(s=>s.addEventListener('change',update));
 document.getElementById('resetMix').addEventListener('click',()=>{ranges[0].value=50;ranges[1].value=50;ranges[2].value=0;selects[0].value=0;selects[1].value=15;selects[2].value=11;update()});update();
}
if(typeof module!=='undefined')module.exports={mixPaintHex,normaliseWeights};
