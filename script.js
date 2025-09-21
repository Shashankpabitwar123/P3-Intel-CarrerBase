/* ==========================================================
 * Intel Timeline — Founding → Chips → Achievements → Sustainability
 * Fixes:
 *  - Active glow for opened card + glowing modal
 *  - Close button works (button/backdrop/Esc)
 *  - Search & filter robust (listeners tightened)
 * ========================================================== */

/* Milestones */
const data = [
  { year: 1968, title: "Intel Founded", cat: "history",
    blurb: "Robert Noyce and Gordon Moore found Intel in Santa Clara.",
    detail: "Intel Corporation is founded in 1968 by Robert Noyce and Gordon Moore. The company begins with a focus on semiconductor memory and quickly becomes a leader in integrated electronics, forming the base for future microprocessor breakthroughs.",
    svg: "founding"
  },
  { year: 1971, title: "Intel® 4004 — First Microprocessor", cat: "innovation",
    blurb: "The 4004 debuts as the first commercial microprocessor.",
    detail: "Intel introduces the 4004, a 4-bit CPU. It demonstrates that general-purpose computing can be integrated into a single chip—paving the way for programmable electronics in calculators, control systems, and, ultimately, personal computers.",
    svg: "chip"
  },
  { year: 1978, title: "8086 Architecture", cat: "innovation",
    blurb: "The 16-bit 8086 launches the x86 family.",
    detail: "Intel’s 8086 processor, with a 16-bit architecture, becomes the foundation of the x86 instruction set. This lineage evolves through 286, 386, 486 and Pentium® families—defining software compatibility for generations of computers.",
    svg: "die"
  },
  { year: 1993, title: "Pentium® Era", cat: "innovation",
    blurb: "Pentium® processors popularize multimedia performance.",
    detail: "The Pentium® brand ushers in higher IPC, superscalar design, and floating-point performance that fuels richer productivity and media applications—helping PCs go mainstream throughout the 1990s.",
    svg: "pentium"
  },
  { year: 2006, title: "Multi-Core Mainstream", cat: "innovation",
    blurb: "Dual- and quad-core designs go mainstream.",
    detail: "Intel ramps multi-core CPUs across client and data center platforms. Parallel execution, improved power management and new instruction sets expand performance per watt for modern workloads.",
    svg: "multicore"
  },
  { year: 2014, title: "Conflict-Free Microprocessors", cat: "materials",
    blurb: "Microprocessors verified conflict-free for 3TG.",
    detail: "Intel advances responsible sourcing with microprocessors verified as conflict-free for tin, tantalum, tungsten, and gold. The program builds supplier transparency and auditing to reduce the risk of minerals linked to armed conflict.",
    svg: "shield"
  },
  { year: 2017, title: "Water Restoration Projects Begin", cat: "water",
    blurb: "Watershed projects return water to local ecosystems.",
    detail: "Intel funds watershed restorations that help recharge aquifers, improve streamflow, and support habitats in the communities where it operates. These projects complement factory conservation to reduce net water impacts.",
    svg: "water"
  },
  { year: 2020, title: "RISE 2030 Strategy", cat: "goals",
    blurb: "Goals for energy, water, circularity, and community.",
    detail: "The RISE 2030 framework sets measurable goals—100% renewable electricity, net-positive water, zero total waste to landfill, and deepened community impact—aligned to Intel’s role in enabling sustainable technology at scale.",
    svg: "target"
  },
  { year: 2021, title: "On-Site & Global Renewables", cat: "energy",
    blurb: "Solar and renewable purchases expand worldwide.",
    detail: "Intel grows on-site solar arrays and purchases more renewable electricity through PPAs and certificates. Efficiency projects and abatement complement clean energy to reduce operational emissions.",
    svg: "solar"
  },
  { year: 2022, title: "Net-Positive Water (Select Regions)", cat: "water",
    blurb: "Restoration + conservation return more water than used.",
    detail: "Combining factory conservation with funded restoration projects, Intel achieves net-positive water balances in certain operating regions, strengthening local water resilience.",
    svg: "waterPlus"
  },
  { year: 2023, title: "99% Renewable Electricity (Ops)", cat: "energy",
    blurb: "Operations report 99% renewable electricity.",
    detail: "Intel’s operations report 99% renewable electricity usage worldwide, alongside ongoing efficiency work. The roadmap continues toward 100% renewable electricity and net-zero scope 1 & 2 by 2040.",
    svg: "bolt"
  },
  { year: 2030, title: "2030 Ambitions", cat: "goals",
    blurb: "Targets include 100% renewable electricity & net-positive water.",
    detail: "By 2030, Intel targets 100% renewable electricity across operations, net-positive water, circular manufacturing practices, and sustained community initiatives that multiply impact through the broader technology ecosystem.",
    svg: "future"
  }
];

/* Elements */
const rail = document.getElementById('rail');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const scrubber = document.getElementById('scrubber');

/* Modal */
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalSVG = document.getElementById('modalSVG');
const modalCat = document.getElementById('modalCat');
const modalTitle = document.getElementById('modalTitle');
const modalYear = document.getElementById('modalYear');
const modalText = document.getElementById('modalText');

let activeCard = null; // track which card is open for glow

/* ---------- Render Cards ---------- */
let filtered = data.slice();

function render(list){
  rail.innerHTML = '';
  list.sort((a,b) => a.year - b.year).forEach(evt => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.cat = evt.cat;
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', `${evt.year} ${evt.title}`);

    // SVG “image”
    const media = document.createElement('div');
    media.className = 'imgwrap';
    const svgWrap = document.createElement('div');
    svgWrap.className = 'svgwrap';
    svgWrap.innerHTML = makeSVG(evt.svg);
    media.appendChild(svgWrap);
    const year = document.createElement('div');
    year.className = 'year';
    year.textContent = evt.year;
    media.appendChild(year);
    card.appendChild(media);

    // Content
    const h3 = document.createElement('h3'); h3.textContent = evt.title; card.appendChild(h3);
    const p  = document.createElement('p');  p.textContent = evt.detail.slice(0, 150) + (evt.detail.length>150?'…':''); card.appendChild(p);
    const chip = document.createElement('span'); chip.className = 'chip'; chip.textContent = prettyCat(evt.cat); card.appendChild(chip);

    // Reveal on hover
    const rev = document.createElement('div'); rev.className = 'reveal'; rev.textContent = evt.blurb; card.appendChild(rev);

    // Learn more
    const more = document.createElement('a');
    more.className = 'more'; more.href = 'javascript:void(0)'; more.innerHTML = `Learn more
      <svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    card.appendChild(more);

    // Interactions
    card.addEventListener('pointermove', (e)=>tilt(e, card));
    card.addEventListener('pointerleave', ()=>resetTilt(card));
    card.addEventListener('click', ()=>openModal(evt, card));
    card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openModal(evt, card);} });

    rail.appendChild(card);
  });

  scheduleObserve();
  syncScrubber();
}
/* SAFE INITIALIZE */
try{ render(filtered); }catch(e){ console.error(e); }

/* ---------- Filters (fixed listeners) ---------- */
function prettyCat(c){
  return {history:"History", innovation:"Innovation", energy:"Energy", water:"Water", materials:"Materials", goals:"Goals"}[c] || c;
}
function applyFilters(){
  const q = (searchInput.value || '').toLowerCase().trim();
  const cat = categorySelect.value;
  filtered = data.filter(d => {
    const matchesCat = cat === 'all' ? true : d.cat === cat;
    const matchesQ = !q ? true : (
      (''+d.year).includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.detail.toLowerCase().includes(q) ||
      prettyCat(d.cat).toLowerCase().includes(q)
    );
    return matchesCat && matchesQ;
  });
  activeCard = null;                    // clear glow when list changes
  /* SAFE INITIALIZE */
try{ render(filtered); }catch(e){ console.error(e); }
}
searchInput.addEventListener('input', debounce(applyFilters, 120));
categorySelect.addEventListener('change', applyFilters);

/* ---------- Single Slider & Scroll ---------- */
function isHorizontal(){ return window.matchMedia('(min-width: 761px)').matches; }
function syncScrubber(){
  const horizontal = isHorizontal();
  const scrollSize = horizontal ? (rail.scrollWidth - rail.clientWidth) : (rail.scrollHeight - rail.clientHeight);
  const scrollPos  = horizontal ? rail.scrollLeft : rail.scrollTop;
  const pct = scrollSize > 0 ? (scrollPos/scrollSize)*100 : 0;
  scrubber.value = Math.max(0, Math.min(100, pct));
}
rail.addEventListener('scroll', () => requestAnimationFrame(syncScrubber));
addEventListener('resize', syncScrubber);

scrubber.addEventListener('input', () => {
  const horizontal = isHorizontal();
  const scrollSize = horizontal ? (rail.scrollWidth - rail.clientWidth) : (rail.scrollHeight - rail.clientHeight);
  const target = (scrubber.value/100) * scrollSize;
  if(horizontal){ rail.scrollTo({left: target, behavior:'smooth'}); }
  else{ rail.scrollTo({top: target, behavior:'smooth'}); }
});

/* ---------- Tilt ---------- */
function tilt(e, el){
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty('--rx', `${(py - .5) * -8}deg`);
  el.style.setProperty('--ry', `${(px - .5) * 10}deg`);
}
function resetTilt(el){ el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg'); }

/* ---------- Modal (glow + reliable close) ---------- */
function openModal(evt, cardEl){
  // glow the opened card
  if(activeCard) activeCard.classList.remove('active-glow');
  activeCard = cardEl;
  activeCard.classList.add('active-glow');
  activeCard.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});

  // fill modal
  modalSVG.innerHTML = makeSVG(evt.svg);
  modalCat.textContent = prettyCat(evt.cat);
  modalCat.className = 'chip ' + evt.cat;
  modalTitle.textContent = evt.title;
  modalYear.textContent = evt.year;
  modalText.textContent = evt.detail;

  modal.setAttribute('aria-hidden','false');
  // focus the close button for keyboard users
  setTimeout(()=>modalClose.focus(), 10);
}
/* CLOSEMODAL ENHANCED */
function closeModal(){
  try { history.replaceState(null, '', location.pathname); } catch(e){}
  const hero = document.getElementById('heroTop');
  if(hero){ hero.scrollIntoView({behavior:'smooth', block:'start'}); }
  modal.setAttribute('aria-hidden','true');
  if(activeCard){ activeCard.classList.remove('active-glow'); activeCard = null; }
}
modalClose.addEventListener('click', closeModal);
// backdrop click (has data-close attr)
modal.addEventListener('click', (e)=>{ if(e.target.dataset.close){ closeModal(); } });
addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ---------- Intersection pop-in ---------- */
const observer = new IntersectionObserver((entries)=>{
  for(const ent of entries){
    if(ent.isIntersecting){
      ent.target.style.transition = 'transform .35s ease, opacity .35s ease, box-shadow .25s ease';
      ent.target.style.transform += ' translateZ(20px) scale(1.01)';
      ent.target.style.opacity = '1';
      observer.unobserve(ent.target);
    }
  }
}, {root: rail, threshold: .4});

function scheduleObserve(){
  [...rail.children].forEach(card => { card.style.opacity = '.85'; observer.observe(card); });
}

/* ---------- Debounce ---------- */
function debounce(fn, d=120){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), d); }; }

/* ---------- Particle Background ---------- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W=0,H=0, particles=[];
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();
function initParticles(n=120){
  particles = Array.from({length:n}, _ => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*0.4, vy: (Math.random()-.5)*0.4, r: Math.random()*1.8 + 0.6 }));
}
initParticles();
(function step(){
  ctx.clearRect(0,0,W,H);
  const grad = ctx.createRadialGradient(W*0.2, H*0.15, 0, W*0.2, H*0.15, Math.max(W,H)*0.9);
  grad.addColorStop(0,'rgba(31,156,255,.08)'); grad.addColorStop(1,'rgba(31,156,255,0)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation = 'lighter';
  particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(127,219,255,.35)'; ctx.fill(); });
  for(let i=0;i<particles.length;i++){ for(let j=i+1;j<i+16 && j<particles.length;j++){
    const a=particles[i], b=particles[j], dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy;
    if(d2<160*160){ const o=1-(d2/(160*160)); ctx.strokeStyle=`rgba(47,170,255,${o*.12})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
  }} ctx.globalCompositeOperation='source-over'; requestAnimationFrame(step);
})();

/* ========= SVG “Image” Generator ========= */
function makeSVG(kind){
  const base = `
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${kind}">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#102b46"/><stop offset="1" stop-color="#0e3a60"/>
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#7FDBFF"/><stop offset="1" stop-color="#1f9cff"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/></feMerge></filter>
      </defs>
      <rect width="640" height="360" fill="url(#g1)"/>
      <g opacity=".22" stroke="#2e6aa3">
        ${Array.from({length:18}, (_,i)=>`<line x1="${(i+1)*32}" y1="0" x2="${(i+1)*32}" y2="360"/>`).join('')}
        ${Array.from({length:9}, (_,i)=>`<line x1="0" y1="${(i+1)*36}" x2="640" y2="${(i+1)*36}"/>`).join('')}
      </g>
      %%ICON%%
    </svg>`;
  const icons = {
    founding: `<g transform="translate(90,80)"><rect x="0" y="80" width="460" height="160" rx="14" fill="rgba(255,255,255,.06)" stroke="#3da6ff"/><rect x="40" y="40" width="120" height="40" rx="6" fill="url(#g2)"/><text x="52" y="67" font-family="Inter" font-weight="800" font-size="20" fill="#001933">1968</text><g transform="translate(240,20)"><path d="M0 120 L70 40 L140 120 Z" fill="rgba(127,219,255,.25)" stroke="#7FDBFF"/><rect x="44" y="70" width="52" height="50" fill="#112b46" stroke="#7FDBFF"/></g></g>`,
    chip: `<g transform="translate(120,60)"><rect x="0" y="0" width="400" height="240" rx="20" fill="#0e2338" stroke="#1f9cff"/>${Array.from({length:14}, (_,i)=>`<rect x="${-18}" y="${12+i*16}" width="18" height="8" fill="#3da6ff"/>`).join('')}${Array.from({length:14}, (_,i)=>`<rect x="${400}" y="${12+i*16}" width="18" height="8" fill="#3da6ff"/>`).join('')}<rect x="130" y="70" width="140" height="100" rx="10" fill="rgba(127,219,255,.18)" stroke="#7FDBFF" filter="url(#glow)"/><text x="200" y="130" text-anchor="middle" font-family="Inter" font-weight="800" font-size="28" fill="#bfe6ff">4004</text></g>`,
    die: `<g transform="translate(120,60)"><rect x="0" y="0" width="400" height="240" rx="20" fill="#0e2338" stroke="#1f9cff"/><g transform="translate(60,40)" opacity=".9">${Array.from({length:8}, (_,r)=>Array.from({length:10}, (_,c)=>`<rect x="${c*26}" y="${r*20}" width="22" height="16" fill="${(r+c)%2? '#133a62':'#1a4f86'}" />`).join('')).join('')}</g><text x="200" y="220" text-anchor="middle" font-family="Inter" font-weight="700" font-size="22" fill="#cfe6ff">8086</text></g>`,
    pentium: `<g transform="translate(110,60)"><rect x="0" y="0" width="420" height="240" rx="20" fill="#0e2338" stroke="#a979ff"/><circle cx="110" cy="120" r="70" fill="rgba(185,146,255,.16)" stroke="#b892ff"/><circle cx="310" cy="120" r="70" fill="rgba(185,146,255,.16)" stroke="#b892ff"/><text x="210" y="130" text-anchor="middle" font-family="Inter" font-weight="800" font-size="38" fill="#dcd0ff">P</text></g>`,
    multicore: `<g transform="translate(120,60)"><rect x="0" y="0" width="400" height="240" rx="20" fill="#0e2338" stroke="#1f9cff"/>${Array.from({length:2},(_,r)=>Array.from({length:2},(_,c)=>`<rect x="${60 + c*140}" y="${50 + r*80}" width="100" height="60" rx="10" fill="#102b46" stroke="#7FDBFF"/>`).join('')).join('')}</g>`,
    shield: `<g transform="translate(140,50)"><path d="M180 20 L320 60 L320 140 C320 200 240 240 180 260 C120 240 40 200 40 140 L40 60 Z" fill="rgba(149,249,133,.15)" stroke="#95f985"/><text x="180" y="130" text-anchor="middle" font-family="Inter" font-weight="800" font-size="26" fill="#d9ffd3">3TG</text></g>`,
    water: `<g transform="translate(160,40)"><path d="M160 40 C210 100 240 140 240 180 A80 80 0 1 1 80 180 C80 140 110 100 160 40Z" fill="rgba(76,201,240,.18)" stroke="#4cc9f0"/></g>`,
    waterPlus: `<g transform="translate(160,40)"><path d="M160 40 C210 100 240 140 240 180 A80 80 0 1 1 80 180 C80 140 110 100 160 40Z" fill="rgba(76,201,240,.18)" stroke="#4cc9f0"/><g transform="translate(255,160)" stroke="#4cc9f0"><line x1="-18" y1="0" x2="18" y2="0" stroke-width="6"/><line x1="0" y1="-18" x2="0" y2="18" stroke-width="6"/></g></g>`,
    solar: `<g transform="translate(80,80)">${Array.from({length:3},(_,r)=>Array.from({length:6},(_,c)=>`<rect x="${c*60}" y="${r*38}" width="54" height="30" fill="#153b63" stroke="#3da6ff"/>`).join('')).join('')}<rect x="0" y="-12" width="360" height="12" fill="#1f9cff" opacity=".25" /><rect x="-10" y="120" width="380" height="8" fill="#7FDBFF" opacity=".3" /><circle cx="520" cy="20" r="30" fill="#ffd166" opacity=".9"/></g>`,
    bolt: `<g transform="translate(200,40)"><polygon points="120,0 60,120 160,120 100,240 260,100 160,100" fill="rgba(255,209,102,.25)" stroke="#ffd166" /></g>`,
    target: `<g transform="translate(180,40)"><circle cx="140" cy="120" r="90" fill="none" stroke="#b892ff" /><circle cx="140" cy="120" r="60" fill="none" stroke="#b892ff" opacity=".6"/><circle cx="140" cy="120" r="30" fill="none" stroke="#b892ff" opacity=".4"/><line x1="140" y1="30" x2="140" y2="210" stroke="#b892ff"/><line x1="50" y1="120" x2="230" y2="120" stroke="#b892ff"/></g>`,
    future: `<g transform="translate(120,60)"><rect x="0" y="0" width="400" height="240" rx="20" fill="#0e2338" stroke="#1f9cff"/><path d="M40 180 L200 60 L360 180" fill="none" stroke="#7FDBFF"/><circle cx="200" cy="60" r="10" fill="#7FDBFF" filter="url(#glow)"/><text x="200" y="210" text-anchor="middle" font-family="Inter" font-size="22" fill="#cfe6ff">2030</text></g>`
  };
  return base.replace("%%ICON%%", icons[kind] || icons["chip"]);
}

/* --- Robust close triggers --- */
// Close when clicking any element tagged with [data-close], or any .modal-close
modal.addEventListener('click', (e)=>{
  const t = e.target;
  if (t.dataset && t.dataset.close) { closeModal(); }
  if (t.classList && t.classList.contains('modal-close')) { closeModal(); }
});

// Also support Enter/Space on the close button for accessibility
modalClose.addEventListener('keydown', (e)=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); closeModal(); }
});

/* --- Intel logo intro glow on page load --- */
const intelLogoEl = document.querySelector('.intel-logo');
if(intelLogoEl){
  intelLogoEl.classList.add('glow-on');
  setTimeout(()=>intelLogoEl.classList.remove('glow-on'), 2400);
}

/* --- Global delegates to guarantee the ✕ closes everywhere --- */
function isModalOpen(){ return modal && modal.getAttribute('aria-hidden') === 'false'; }

function handleGlobalClose(e){
  if(!isModalOpen()) return;
  const t = e.target;
  if (t && (t.closest && t.closest('.modal-close'))) {
    e.preventDefault();
    closeModal();
  }
}

document.addEventListener('click', handleGlobalClose, true);
document.addEventListener('pointerup', handleGlobalClose, true);
document.addEventListener('touchend', handleGlobalClose, true);


/* --- Harden search/filter wiring --- */
function safeApplyFilters(){ try{ applyFilters(); }catch(e){ console.error(e); } }

if (searchInput){
  searchInput.addEventListener('keyup', safeApplyFilters);
  searchInput.addEventListener('change', safeApplyFilters);
}
if (categorySelect){
  categorySelect.addEventListener('input', safeApplyFilters);
}





/* ---------- Subscription form (Gmail only) ---------- */
(() => {
  const form = document.getElementById('subscribeForm');
  if(!form) return;
  const name = document.getElementById('subName');
  const email = document.getElementById('subEmail');
  const consent = document.getElementById('subConsented');
  const msg = document.getElementById('subMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = '';

    const n = (name.value||'').trim();
    const em = (email.value||'').trim().toLowerCase();
    if(!n){ msg.textContent = 'Please enter your name.'; return; }
    if(!/^[^@\s]+@gmail\.com$/.test(em)){ msg.textContent = 'Please use a valid @gmail.com address.'; return; }
    if(!consent.checked){ msg.textContent = 'Please agree to receive updates.'; return; }

    msg.textContent = 'Thanks! You are subscribed.';
  });
})();


/* ---------- Language Toggle (robust) ---------- */
(() => {
  // Store originals per TEXT NODE (not parent) so restoration is exact.
  const ORIGINAL_TEXT = new WeakMap();     // TextNode -> original string
  const ORIGINAL_ATTR = new WeakMap();     // Element  -> {placeholder, ariaLabel}

  // Phrase dictionary (extend as needed)
  const PHRASES = new Map([
    // --- Global / headings ---
    ["Intel — Sustainability Through the Ages","إنتل — الاستدامة عبر العصور"],
    ["Through the Ages","عبر العصور"],
    ["From founding and early chips to modern sustainability milestones—scrub the timeline and explore each moment.","من التأسيس والرقاقات الأولى إلى إنجازات الاستدامة الحديثة — تصفّح الخط الزمني واستكشف كل لحظة."],
    ["Hover a card to reveal a quick summary. Click/tap to open full details.","حرّك المؤشر فوق البطاقة لتعرض ملخصًا سريعًا. انقر/اضغط لفتح التفاصيل الكاملة."],
  
    // --- Filters / legend / UI ---
    ["All categories","جميع الفئات"],
    ["All","الكل"],
    ["Search","بحث"],
    ["Year","السنة"],
    ["Category","الفئة"],
    ["History","التاريخ"],
    ["Innovation","الابتكار"],
    ["People","الأفراد"],
    ["Environment","البيئة"],
    ["Energy","الطاقة"],
    ["Water","المياه"],
    ["Goals","الأهداف"],
    ["Materials","المواد"],
    ["Close","إغلاق"],
    ["Read more","اقرأ المزيد"],
    ["Learn more","اعرف المزيد"],
    ["Details…","التفاصيل…"],
  
    // --- Cards: Intel Founded (1968) ---
    ["Intel Founded","تأسيس إنتل"],
    ["Robert Noyce and Gordon Moore found Intel in Santa Clara.","روبرت نويْس وغوردون مور يؤسسان شركة إنتل في سانتا كلارا."],
    ["Intel Corporation is founded in 1968 by Robert Noyce and Gordon Moore. The company begins with a focus on semiconductor memory and quickly becomes a leader in integrated electronics, forming the base for future microprocessor breakthroughs.","تأسست شركة إنتل عام ١٩٦٨ على يد روبرت نويْس وغوردون مور. بدأت الشركة بالتركيز على ذاكرة أشباه الموصلات وسرعان ما أصبحت رائدة في الإلكترونيات المتكاملة، مما مهّد الطريق لاختراقات المعالجات الدقيقة لاحقًا."],
  
    // --- Cards: Intel® 4004 — First Microprocessor (1971) ---
    ["Intel® 4004 — First Microprocessor","إنتل® 4004 — أول معالج دقيق"],
    ["The 4004 debuts as the first commercial microprocessor.","ظهر 4004 كأول معالج دقيق تجاري."],
    ["Intel introduces the 4004, a 4-bit CPU. It demonstrates that general-purpose computing can be integrated into a single chip—paving the way for programmable electronics in calculators, control systems, and, ultimately, personal computers.","قدّمت إنتل المعالج 4004، وهو وحدة معالجة مركزية بقدرة ٤-بت. أثبت إمكانية دمج الحوسبة العامة في شريحة واحدة—ممهّدًا الطريق للآلات الحاسبة القابلة للبرمجة وأنظمة التحكم، وفي النهاية أجهزة الحاسوب الشخصية."],
  
    // --- Cards: 8086 Architecture (1978) ---
    ["8086 Architecture","معمارية 8086"],
    ["The 16-bit 8086 launches the x86 family.","أطلق المعالج 8086 بقدرة ١٦-بت عائلة x86."],
    ["Intel’s 8086 processor, with a 16-bit architecture, becomes the foundation of the x86 instruction set. This lineage evolves through 286, 386, 486 and Pentium® families—defining software compatibility for generations of computers.","أصبح معالج إنتل 8086 بمعمارية ١٦-بت أساس مجموعة تعليمات x86، وتطورت هذه السلالة عبر عائلات 286 و386 و486 وبنتيوم®، محدِّدةً توافق البرمجيات لأجيال من الحواسيب."],
  
    // --- Cards: Pentium® Era (1993) ---
    ["Pentium® Era","عصر بنتيوم®"],
    ["Pentium® processors popularize multimedia performance.","نشرت معالجات بنتيوم® أداء الوسائط المتعددة على نطاق واسع."],
    ["The Pentium® brand ushers in higher IPC, superscalar design, and floating-point performance that fuels richer productivity and media applications—helping PCs go mainstream throughout the 1990s.","قدّمت علامة بنتيوم® معدلات تنفيذ أعلى لكل دورة، وتصميمًا فائق التدرج، وأداءً أقوى للنقطة العائمة، ما غذّى تطبيقات الإنتاجية والوسائط الغنية—وساعد الحواسيب الشخصية على الانتشار الواسع خلال التسعينيات."],
  
    // --- Cards: Multi-Core Mainstream (2006) ---
    ["Multi-Core Mainstream","الانتشار الواسع للمعالجات متعددة الأنوية"],
    ["Dual- and quad-core designs go mainstream.","تصميمات ثنائية ورباعية الأنوية تصبح شائعة."],
    ["Intel ramps multi-core CPUs across client and data center platforms. Parallel execution, improved power management and new instruction sets expand performance per watt for modern workloads.","توسّع إنتل انتشار وحدات المعالجة متعددة الأنوية عبر منصات الحواسيب ومراكز البيانات. يرفع التنفيذ المتوازي وتحسين إدارة الطاقة والتعليمات الجديدة الأداء لكل واط لأعباء العمل الحديثة."],
  
    // --- Cards: Conflict-Free Microprocessors (2014) ---
    ["Conflict-Free Microprocessors","معالجات خالية من الصراعات"],
    ["Microprocessors verified conflict-free for 3TG.","معالجات موثّقة بأنها خالية من صراعات معادن 3TG."],
    ["Intel advances responsible sourcing with microprocessors verified as conflict-free for tin, tantalum, tungsten, and gold. The program builds supplier transparency and auditing to reduce the risk of minerals linked to armed conflict.","تعزّز إنتل التوريد المسؤول بمعالجات موثّقة خالية من صراعات القصدير والتنتالوم والتنغستن والذهب. يبني البرنامج شفافية المورّدين والتدقيق لتقليل مخاطر المعادن المرتبطة بالنزاعات المسلحة."],
  
    // --- Cards: Water Restoration Projects Begin (2017) ---
    ["Water Restoration Projects Begin","بدء مشاريع استعادة المياه"],
    ["Watershed projects return water to local ecosystems.","تعيد مشاريع أحواض الأنهار المياه إلى الأنظمة البيئية المحلية."],
    ["Intel funds watershed restorations that help recharge aquifers, improve streamflow, and support habitats in the communities where it operates. These projects complement factory conservation to reduce net water impacts.","تموّل إنتل ترميم أحواض الأنهار للمساعدة في إعادة تغذية المياه الجوفية وتحسين تدفّق الجداول ودعم الموائل في المجتمعات التي تعمل فيها. تكمل هذه المشاريع جهود الحفاظ داخل المصانع لتقليل الأثر الصافي على المياه."],
  
    // --- Cards: RISE 2030 Strategy (2020) ---
    ["RISE 2030 Strategy","استراتيجية RISE 2030"],
    ["Goals for energy, water, circularity, and community.","أهداف للطاقة والمياه والاقتصاد الدائري والمجتمع."],
    ["The RISE 2030 framework sets measurable goals—100% renewable electricity, net-positive water, zero total waste to landfill, and deepened community impact—aligned to Intel’s role in enabling sustainable technology at scale.","يحدّد إطار RISE 2030 أهدافًا قابلة للقياس—١٠٠٪ كهرباء متجددة، ومياه إيجابية صافيًا، وصفر نفايات إلى المدافن، وتعميق الأثر المجتمعي—متوافقًا مع دور إنتل في تمكين التكنولوجيا المستدامة على نطاق واسع."],
  
    // --- Cards: On-Site & Global Renewables (2021) ---
    ["On-Site & Global Renewables","الطاقة المتجددة في المواقع وحول العالم"],
    ["Solar and renewable purchases expand worldwide.","تتوسع عمليات شراء الطاقة الشمسية والمتجددة حول العالم."],
    ["Intel grows on-site solar arrays and purchases more renewable electricity through PPAs and certificates. Efficiency projects and abatement complement clean energy to reduce operational emissions.","تزيد إنتل مصفوفات الطاقة الشمسية في مواقعها وتشتري المزيد من الكهرباء المتجددة عبر اتفاقيات شراء الطاقة والشهادات. تكمل مشاريع الكفاءة والمعالجة الطاقة النظيفة لخفض الانبعاثات التشغيلية."],
  
    // --- Cards: Net-Positive Water (2022) ---
    ["Net-Positive Water (Select Regions)","مياه إيجابية صافيًا (مناطق محددة)"],
    ["Restoration + conservation return more water than used.","الترميم + الحفاظ يعيدان مياهًا أكثر مما يُستهلك."],
    ["Combining factory conservation with funded restoration projects, Intel achieves net-positive water balances in certain operating regions, strengthening local water resilience.","بدمج الحفاظ داخل المصانع مع مشاريع الترميم المموّلة، تحقق إنتل توازنًا مائيًا إيجابيًا في بعض مناطق التشغيل، ما يعزّز مرونة المياه محليًا."],
  
    // --- Cards: 99% Renewable Electricity (Ops) (2023) ---
    ["99% Renewable Electricity (Ops)","٩٩٪ كهرباء متجددة (العمليات)"],
    ["Operations report 99% renewable electricity.","تُبلغ العمليات عن ٩٩٪ كهرباء متجددة."],
    ["Intel’s operations report 99% renewable electricity usage worldwide, alongside ongoing efficiency work. The roadmap continues toward 100% renewable electricity and net-zero scope 1 & 2 by 2040.","تشير عمليات إنتل إلى استخدام ٩٩٪ كهرباء متجددة عالميًا، إلى جانب جهود الكفاءة المستمرة. وتستمر خارطة الطريق نحو كهرباء متجددة ١٠٠٪ وصافي انبعاثات صفري للنطاقين ١ و٢ بحلول ٢٠٤٠."],
  
    // --- Cards: 2030 Ambitions (2030) ---
    ["2030 Ambitions","طموحات 2030"],
    ["Targets include 100% renewable electricity & net-positive water.","تشمل الأهداف كهرباء متجددة ١٠٠٪ ومياه إيجابية صافيًا."],
    ["By 2030, Intel targets 100% renewable electricity across operations, net-positive water, circular manufacturing practices, and sustained community initiatives that multiply impact through the broader technology ecosystem.","بحلول ٢٠٣٠، تستهدف إنتل كهرباء متجددة ١٠٠٪ عبر العمليات، ومياهًا إيجابية صافيًا، وممارسات تصنيع دائرية، ومبادرات مجتمعية مستدامة تضاعف الأثر عبر منظومة التكنولوجيا."],
  
    // --- Subscribe block / footer ---
    ["Subscribe","اشترك"],
    ["Subscribe for quarterly updates on Intel’s sustainability goals, milestones, and ways you can contribute.","اشترك لتصلك تحديثات ربع سنوية حول أهداف واستراتيجيات الاستدامة لدى إنتل، وأبرز الإنجازات، وطرق مساهمتك."],
    ["Email address","البريد الإلكتروني"],
    ["Your email","بريدك الإلكتروني"],
    ["I agree to receive Intel sustainability updates.","أوافق على تلقي تحديثات الاستدامة من إنتل."],
    ["Email (Gmail only)","البريد الإلكتروني (Gmail فقط)"],
    ["We’ll never share your email.","لن نشارك بريدك الإلكتروني مطلقًا."],
    ["Intel Sustainability Newsletter","نشرة إنتل للاستدامة"],
    ["Search years, titles, or topics…","ابحث عن سنوات أو عناوين أو مواضيع…"],
    ["Your name","اسمك"],
    ["you@gmail.com","you@gmail.com"],
    ["Arabic","العربية"],
    ["English","English"],
    ["@2025 Shashank Pabitwar, intel project","@٢٠٢٥ ششانك بابيتوار، مشروع إنتل"]
  ]);

  // Ensure truncated previews (150 chars + …) translate:
(function addTruncatedDetailPairs(){
  if (!Array.isArray(data)) return;
  data.forEach(evt => {
    const en = (evt && evt.detail) ? String(evt.detail) : "";
    if (!en) return;
    const previewEn = en.slice(0,150) + (en.length > 150 ? "…" : "");
    // If we have a full Arabic for this detail, make a truncated Arabic too:
    const fullAr = PHRASES.get(en);
    if (fullAr) {
      const previewAr = fullAr.slice(0,150) + (fullAr.length > 150 ? "…" : "");
      PHRASES.set(previewEn, previewAr);
    }
  });
})();


  // Word-level dictionary for fallback tokens
  const WORDS = new Map([
    ["sustainability","الاستدامة"],["through","عبر"],["the","ال"],["ages","العصور"],
    ["history","التاريخ"],["innovation","الابتكار"],["people","الأفراد"],["environment","البيئة"],
    ["subscribe","اشترك"],["email","البريد"],["address","العنوان"],["submit","إرسال"],
    ["search","بحث"],["close","إغلاق"],["read","اقرأ"],["more","المزيد"],["less","أقل"],
    ["learn","اعرف"],["next","التالي"],["previous","السابق"],["cancel","إلغاء"],["reset","إعادة تعيين"]
  ]);

  const toEasternDigits = (s) => s.replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

  function translateString(str){
    if (!str) return str;
    const trimmed = str.trim();
    if (!trimmed) return str;

    // exact phrase first
    const direct = PHRASES.get(trimmed) || PHRASES.get(trimmed.replace(/\s+/g,' '));
    if (direct) return str.replace(trimmed, toEasternDigits(direct));

    // token-level fallback
    const out = trimmed.split(/(\s+)/).map(tok => {
      if (/^\s+$/.test(tok)) return tok;
      // leave pure numbers/punct but convert digits
      if (/^[\d\-/.:,]+$/.test(tok)) return toEasternDigits(tok);
      const lower = tok.toLowerCase();
      const w = WORDS.get(lower);
      return w ? w : tok;
    }).join('');

    return str.replace(trimmed, toEasternDigits(out));
  }

  function walkTextNodes(root, onText){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (/(SCRIPT|STYLE|NOSCRIPT)/.test(tag)) return NodeFilter.FILTER_REJECT;
        // skip hidden elements (display:none) to avoid toggling things like templates
        const cs = p instanceof Element ? getComputedStyle(p) : null;
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        // avoid translating inside inputs/buttons where value is not textContent
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
        if (p.closest('.intel-logo,[data-no-translate],svg,canvas')) {
          return NodeFilter.FILTER_REJECT;
        }
        
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(onText);
  }

  function setArabic(){
    const root = document.documentElement;
    root.setAttribute('lang','ar');
    root.setAttribute('dir','rtl');
    if (document.body) document.body.setAttribute('dir','rtl');
    root.classList.add('rtl');

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = 'English';

    // attributes
    document.querySelectorAll('[placeholder], [aria-label]').forEach(el => {
      if (!ORIGINAL_ATTR.has(el)) {
        ORIGINAL_ATTR.set(el, {
          placeholder: el.getAttribute('placeholder'),
          ariaLabel: el.getAttribute('aria-label')
        });
      }
      const ph = el.getAttribute('placeholder');
      if (ph) el.setAttribute('placeholder', translateString(ph));
      const al = el.getAttribute('aria-label');
      if (al) el.setAttribute('aria-label', translateString(al));
    });

    // texts
    walkTextNodes(document.body || document, node => {
      if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, node.nodeValue);
      node.nodeValue = translateString(ORIGINAL_TEXT.get(node));
    });
  }

  function setEnglish(){
    const root = document.documentElement;
    root.setAttribute('lang','en');
    root.setAttribute('dir','ltr');
    if (document.body) document.body.setAttribute('dir','ltr');
    root.classList.remove('rtl');

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = 'Arabic';

    // restore attributes
    document.querySelectorAll('[placeholder], [aria-label]').forEach(el => {
      const orig = ORIGINAL_ATTR.get(el);
      if (orig) {
        if (orig.placeholder != null) el.setAttribute('placeholder', orig.placeholder);
        if (orig.ariaLabel  != null) el.setAttribute('aria-label',  orig.ariaLabel);
      }
    });

    // restore text nodes
    walkTextNodes(document.body || document, node => {
      const orig = ORIGINAL_TEXT.get(node);
      if (orig != null) node.nodeValue = orig;
    });
  }

  function initToggle(){
    const btn = document.getElementById('langToggle');
    if (!btn) return false;

    // initialize to current dir without altering content first time
    const isAR = (document.documentElement.getAttribute('dir') === 'rtl');
    if (isAR) setArabic(); else setEnglish();

    btn.addEventListener('click', () => {
      const nowAR = (document.documentElement.getAttribute('dir') === 'rtl');
      if (nowAR) setEnglish(); else setArabic();
    });
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle, { once:true });
  } else if (!initToggle()) {
    setTimeout(initToggle, 0);
  }
})();;;

