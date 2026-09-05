const SPECTRUM_COLOURS=[
 {name:'Egyptian Cotton',hex:'#E8DDC9',family:'Neutrals'}, {name:'Perfectly Taupe',hex:'#B9A88C',family:'Neutrals'},
 {name:'Natural Hessian',hex:'#C8B79A',family:'Neutrals'}, {name:'Gentle Fawn',hex:'#BFA98D',family:'Neutrals'},
 {name:'Almost Oyster',hex:'#D9D2C3',family:'Neutrals'}, {name:'Spiced Honey',hex:'#C98A43',family:'Yellows'},
 {name:'Soft Truffle',hex:'#9D8069',family:'Neutrals'}, {name:'Sandstone',hex:'#C7A27C',family:'Neutrals'},
 {name:'Mellow Mocha',hex:'#8B6D58',family:'Neutrals'}, {name:'Pale Taupe',hex:'#CFC3B0',family:'Neutrals'},
 {name:'Boutique Cream',hex:'#E6D3AE',family:'Yellows'}, {name:'Fresh Sage',hex:'#8FAE83',family:'Greens'},
 {name:'Emerald Glade',hex:'#2F6B55',family:'Greens'}, {name:'Overtly Olive',hex:'#777B45',family:'Greens'},
 {name:'Forest Shade',hex:'#31563C',family:'Greens'}, {name:'Sapphire Salute',hex:'#203E73',family:'Blues'},
 {name:'Vast Lake',hex:'#B6C6D6',family:'Blues'}, {name:'Denim Drift',hex:'#4B6783',family:'Blues'},
 {name:'Teal Tension',hex:'#2F7773',family:'Blues'}, {name:'Roasted Red',hex:'#A64A4B',family:'Reds'},
 {name:'Raspberry Diva',hex:'#9B3E62',family:'Reds'}, {name:'Honey Mustard',hex:'#C79B32',family:'Yellows'},
 {name:'Warm Pewter',hex:'#8D877D',family:'Neutrals'}, {name:'Urban Obsession',hex:'#777A78',family:'Neutrals'}
];

function hexToRgb(hex){const n=hex.replace('#','');return [parseInt(n.slice(0,2),16),parseInt(n.slice(2,4),16),parseInt(n.slice(4,6),16)]}
function rgbToHex(rgb){return '#'+rgb.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('').toUpperCase()}
function mixPaintHex(colours,weights){const total=weights.reduce((a,b)=>a+b,0)||1;const rgb=[0,0,0];colours.forEach((c,i)=>{const w=(weights[i]||0)/total;const p=hexToRgb(c.hex);p.forEach((v,j)=>{rgb[j]+=Math.pow(v/255,2.2)*w})});return rgbToHex(rgb.map(v=>Math.pow(v,1/2.2)*255))}
function normaliseWeights(values){const active=values.map(Number);const total=active.reduce((a,b)=>a+b,0)||1;return active.map(v=>Math.round(v/total*100))}

function installPaletteStyles(){
 const style=document.createElement('style');style.textContent=`
 .mix-select-wrap{position:relative}.mix-colour{position:absolute!important;inset:0;opacity:0;pointer-events:none;width:1px!important;height:1px!important}
 .palette-trigger{width:100%;display:flex;align-items:center;gap:11px;padding:8px 0;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--ink);cursor:pointer;text-align:left;font-weight:600}
 .palette-trigger:after{content:'⌄';margin-left:auto;font-size:13px;color:#77776f;transition:transform .25s}.palette-trigger[aria-expanded="true"]:after{transform:rotate(180deg)}
 .palette-trigger-swatch{width:22px;height:22px;flex:0 0 22px;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.16),0 1px 2px rgba(0,0,0,.08)}
 .palette-trigger-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.palette-popover{position:absolute;z-index:40;top:calc(100% + 9px);left:-10px;width:min(390px,calc(100vw - 48px));padding:17px;background:#fff;border:1px solid rgba(23,24,20,.13);box-shadow:0 24px 60px rgba(23,24,20,.16);opacity:0;visibility:hidden;transform:translateY(-6px) scale(.985);transform-origin:top left;transition:opacity .2s,visibility .2s,transform .2s}.palette-popover.open{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
 .palette-popover-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:13px}.palette-popover-title{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.palette-popover-hint{font-size:9px;color:#8a8a82}.palette-family{margin-top:14px}.palette-family:first-of-type{margin-top:0}.palette-family-name{font-size:8px;text-transform:uppercase;letter-spacing:.13em;color:#85857d;margin-bottom:7px}.palette-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:5px}.palette-swatch{position:relative;aspect-ratio:1;border:1px solid rgba(0,0,0,.1);padding:0;cursor:pointer;background:var(--palette);border-radius:2px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);transition:transform .18s,box-shadow .18s}.palette-swatch:hover,.palette-swatch:focus-visible{transform:scale(1.12);z-index:2;box-shadow:0 5px 14px rgba(0,0,0,.16),inset 0 0 0 2px rgba(255,255,255,.8);outline:0}.palette-swatch.selected{box-shadow:inset 0 0 0 2px #171814,0 0 0 2px #fff}.palette-swatch span{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%) translateY(3px);background:#171814;color:#fff;padding:6px 8px;font-size:8px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s,transform .15s}.palette-swatch:hover span,.palette-swatch:focus-visible span{opacity:1;transform:translateX(-50%) translateY(0)}
 @media(max-width:700px){.palette-popover{position:fixed;left:12px;right:12px;top:auto;bottom:16px;width:auto;max-height:72vh;overflow:auto;transform:translateY(10px)}.palette-popover.open{transform:translateY(0)}.palette-grid{grid-template-columns:repeat(6,1fr)}}
 `;document.head.appendChild(style)
}

function createPalette(select,index){
 const wrap=select.closest('.mix-select-wrap');if(!wrap)return;
 const trigger=document.createElement('button');trigger.type='button';trigger.className='palette-trigger';trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
 const pop=document.createElement('div');pop.className='palette-popover';pop.setAttribute('role','dialog');pop.innerHTML='<div class="palette-popover-head"><span class="palette-popover-title">Spectrum colour palette</span><span class="palette-popover-hint">Choose a solid shade</span></div>';
 const families=['Neutrals','Greens','Blues','Reds','Yellows'];
 families.forEach(family=>{const colours=SPECTRUM_COLOURS.filter(c=>c.family===family);if(!colours.length)return;const section=document.createElement('div');section.className='palette-family';section.innerHTML=`<div class="palette-family-name">${family}</div>`;const grid=document.createElement('div');grid.className='palette-grid';colours.forEach(c=>{const colourIndex=SPECTRUM_COLOURS.indexOf(c);const sw=document.createElement('button');sw.type='button';sw.className='palette-swatch';sw.style.setProperty('--palette',c.hex);sw.title=`${c.name} · ${c.hex}`;sw.dataset.index=colourIndex;sw.innerHTML=`<span>${c.name}<br>${c.hex}</span>`;sw.addEventListener('click',()=>{select.value=colourIndex;select.dispatchEvent(new Event('change',{bubbles:true}));closePalette();});grid.appendChild(sw)});section.appendChild(grid);pop.appendChild(section)});
 wrap.appendChild(trigger);wrap.appendChild(pop);
 const closePalette=()=>{pop.classList.remove('open');trigger.setAttribute('aria-expanded','false');document.querySelectorAll('.palette-popover.open').forEach(p=>{if(p!==pop)p.classList.remove('open')})};
 trigger.addEventListener('click',e=>{e.stopPropagation();const open=pop.classList.toggle('open');trigger.setAttribute('aria-expanded',String(open));if(open){document.querySelectorAll('.palette-popover.open').forEach(p=>{if(p!==pop)p.classList.remove('open')})}});
 document.addEventListener('click',e=>{if(!wrap.contains(e.target))closePalette()});
 return {trigger,pop,refresh:()=>{const c=SPECTRUM_COLOURS[Number(select.value)];trigger.innerHTML=`<span class="palette-trigger-swatch" style="background:${c.hex}"></span><span class="palette-trigger-name">${c.name}</span>`;pop.querySelectorAll('.palette-swatch').forEach(s=>s.classList.toggle('selected',Number(s.dataset.index)===Number(select.value)))}};
}

window.SpectrumMixer={SPECTRUM_COLOURS,mixPaintHex,normaliseWeights,hexToRgb,rgbToHex};

const mixerRoot=document.getElementById('mixer');
if(mixerRoot){
 installPaletteStyles();
 const selects=[...document.querySelectorAll('.mix-colour')];const ranges=[...document.querySelectorAll('.mix-range')];
 const palettes=selects.map((select,index)=>createPalette(select,index));
 selects.forEach((select,index)=>{SPECTRUM_COLOURS.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=c.name;select.appendChild(o)});select.value=[0,15,11][index]});
 const state={weights:[50,50,0],colours:[0,15,11]};
 const update=()=>{
  state.weights=ranges.map(r=>Number(r.value));state.colours=selects.map(s=>Number(s.value));
  const weights=normaliseWeights(state.weights);const active=state.colours.map(i=>SPECTRUM_COLOURS[i]);const result=mixPaintHex(active,state.weights);const names=active.filter((_,i)=>state.weights[i]>0).map(c=>c.name);
  document.getElementById('mixHex').textContent=result;document.getElementById('mixLiquid').style.background=`radial-gradient(circle at 35% 25%,rgba(255,255,255,.5),transparent 24%),${result}`;
  document.getElementById('mixLabel').textContent=names.join(' + ')||'Custom Spectrum Blend';document.getElementById('mixName').textContent=names.join(' + ')||'Custom Spectrum Blend';
  document.getElementById('ratio').textContent=weights.filter((_,i)=>state.weights[i]>0).join(' / ')||'0';
  ranges.forEach((r,i)=>{document.getElementById(`pct${i}`).textContent=`${weights[i]}%`;document.getElementById(`dot${i}`).style.background=SPECTRUM_COLOURS[state.colours[i]].hex});
  palettes.forEach(p=>p&&p.refresh());
  const msg=`Hello Spectrum Paint, I created a custom colour in the Paint Lab.\nDigital result: ${result}\nBlend: ${names.map((n,i)=>`${n} ${weights[i]}%`).join(', ')}`;document.getElementById('requestMix').href=`https://wa.me/2347031954820?text=${encodeURIComponent(msg)}`;
 };
 ranges.forEach((r,index)=>r.addEventListener('input',()=>{if(index<2){const other=index===0?1:0;const remainder=100-Number(r.value);ranges[other].value=Math.max(0,remainder);if(Number(r.value)===0)ranges[2].value=0}update()}));
 selects.forEach(s=>s.addEventListener('change',update));
 document.getElementById('resetMix').addEventListener('click',()=>{ranges[0].value=50;ranges[1].value=50;ranges[2].value=0;selects[0].value=0;selects[1].value=15;selects[2].value=11;update()});update();
}
if(typeof module!=='undefined')module.exports={mixPaintHex,normaliseWeights};
