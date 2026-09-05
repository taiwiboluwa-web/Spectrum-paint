const revealObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const swatches=document.querySelectorAll('.swatch');const name=document.getElementById('colourName');const hex=document.getElementById('colourHex');const dot=document.querySelector('.current-dot');swatches.forEach(s=>s.addEventListener('click',()=>{swatches.forEach(x=>x.classList.remove('active'));s.classList.add('active');name.textContent=s.dataset.name;hex.textContent=s.dataset.hex;dot.style.background=s.dataset.hex;document.documentElement.style.setProperty('--accent',s.dataset.hex)}));

const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('.desktop-nav');if(menu){menu.addEventListener('click',()=>{nav.classList.toggle('open');document.body.classList.toggle('menu-open')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open')}))}

if(window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});el.addEventListener('mouseleave',()=>{el.style.transform=''})})}

const form=document.getElementById('quoteForm');const note=document.getElementById('formNote');if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const message=`Hello Spectrum Paint, I would like a quote.\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nProject: ${d.get('project')}\nNeed: ${d.get('need')||'Please advise.'}`;note.textContent='Opening WhatsApp…';window.open(`https://wa.me/2347031954820?text=${encodeURIComponent(message)}`,'_blank')})}

window.addEventListener('scroll',()=>document.querySelector('.site-header').classList.toggle('scrolled',window.scrollY>30));
