/* =================================================================
   Pranati Arni — Portfolio behavior (shared by both pages)
   Every feature checks for its elements first, so the same file
   works on index.html (rail home) and projects.html (full grid).
   ================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* =================================================================
   PROJECTS DATA  —  to add a real project:
   1. copy one object below
   2. fill in title / desc / tag / link
   3. change status from 'soon' to 'live'
   This single list feeds BOTH the home page and the projects page.
   ================================================================= */
const projects = [
  {
    title: "Project 01",
    desc:  "A space reserved for something I'm building. Check back soon.",
    tag:   "Coming soon",
    link:  "",            // e.g. "https://github.com/pranatiarni/..."
    status:"soon"          // 'soon' = placeholder · 'live' = real project
  },
  {
    title: "Project 02",
    desc:  "Another slot on the trajectory — a future build in the works.",
    tag:   "Coming soon",
    link:  "",
    status:"soon"
  }
  // , { title:"", desc:"", tag:"", link:"", status:"live" }  <-- add more here
];

/* ----- render project cards into any #projectsGrid on the page ----- */
(function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const lockIcon  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const arrowIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  grid.innerHTML = projects.map(p => {
    const soon = p.status !== 'live';
    const icon = soon
      ? lockIcon
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>';
    const footerEl = soon
      ? `<span class="card__soon-flag">◌ ${escapeHtml(p.tag || 'Coming soon')}</span>`
      : (p.link
          ? `<a class="card__link" href="${escapeHtml(p.link)}" target="_blank" rel="noopener">View project ${arrowIcon}</a>`
          : '');
    const tagEl = (!soon && p.tag) ? `<div class="card__tag">${escapeHtml(p.tag)}</div>` : '';

    return `
      <article class="card ${soon ? 'is-soon' : ''}">
        <span class="card__glare"></span>
        <div class="card__inner">
          <div class="card__icon">${icon}</div>
          ${tagEl}
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.desc)}</p>
          ${footerEl}
        </div>
      </article>`;
  }).join('');
})();

/* =================================================================
   NAVBAR — condense on scroll + mobile menu toggle (both pages)
   ================================================================= */
(function navbar() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onNavScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    const setOpen = (open) => {
      toggle.classList.toggle('open', open);
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    // close after tapping a link
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }
})();

/* =================================================================
   RAIL — build nodes, track scroll, highlight active (home only)
   ================================================================= */
const SECTIONS = [
  { id: 'about',    label: 'About'    },
  { id: 'projects', label: 'Projects' },
  { id: 'skills',   label: 'Skills'   },
  { id: 'contact',  label: 'Contact'  }
];

let nodeEls = [];
const nodesWrap = document.getElementById('railNodes');
if (nodesWrap) {
  nodesWrap.innerHTML = SECTIONS.map(s => `
    <button class="node" data-target="${s.id}" aria-label="Go to ${s.label}">
      <span class="node__dot"></span>
      <span class="node__label">${s.label}</span>
    </button>`).join('');

  nodeEls = Array.from(nodesWrap.querySelectorAll('.node'));

  nodeEls.forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        nodeEls.forEach(n => n.classList.toggle('is-active', n.dataset.target === id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  SECTIONS.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) activeObserver.observe(el);
  });
}

/* scroll progress → rail fill + comet + HUD readout (all optional) */
(function scrollProgress() {
  const fill  = document.getElementById('railFill');
  const comet = document.getElementById('railComet');
  const hudScroll = document.getElementById('hudScroll');
  if (!fill && !comet && !hudScroll) return;

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (fill)  fill.style.height = (pct * 100) + '%';
    if (comet) comet.style.top   = (pct * 100) + '%';
    if (hudScroll) hudScroll.textContent = String(Math.round(pct * 100)).padStart(3, '0');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

/* =================================================================
   SCROLL REVEAL
   ================================================================= */
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* =================================================================
   ATMOSPHERE — drifting starfield (white + a few blue)
   ================================================================= */
(function starfield() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, stars = [];

  function pseudo(n) { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(150, Math.round((w * h) / 10000));
    stars = Array.from({ length: count }, (_, i) => ({
      x: pseudo(i * 1.3) * w,
      y: pseudo(i * 2.7) * h,
      r: 0.4 + pseudo(i * 3.1) * 1.3,
      baseA: 0.12 + pseudo(i * 4.9) * 0.45,
      tw: pseudo(i * 5.5) * Math.PI * 2,
      tws: 0.6 + pseudo(i * 6.3) * 0.9,
      vy: 0.04 + pseudo(i * 7.1) * 0.10,
      blue: pseudo(i * 8.9) > 0.82            // a few blue stars
    }));
  }

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    t += 0.016;
    for (const s of stars) {
      const a = s.baseA * (0.55 + 0.45 * Math.sin(t * s.tws + s.tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.blue ? `rgba(124,192,255,${a})` : `rgba(255,255,255,${a})`;
      ctx.fill();
      s.y -= s.vy;
      if (s.y < -2) { s.y = h + 2; }
    }
    requestAnimationFrame(frame);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.blue ? `rgba(124,192,255,${s.baseA})` : `rgba(255,255,255,${s.baseA})`;
      ctx.fill();
    }
  }

  build();
  window.addEventListener('resize', () => { build(); if (reduceMotion) drawStatic(); });
  if (reduceMotion) drawStatic(); else requestAnimationFrame(frame);
})();

/* =================================================================
   NAME DECODE / SCRAMBLE on load (home hero only)
   ================================================================= */
(function decodeName() {
  const el = document.getElementById('heroName');
  if (!el) return;
  const finalText = el.dataset.text || el.textContent;
  if (reduceMotion) { el.textContent = finalText; return; }

  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#";
  let frame = 0;
  const total = 28;
  const stagger = 1.6;

  function tick() {
    let out = "";
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i];
      if (ch === " ") { out += " "; continue; }
      if (frame > i * stagger + 6)      out += ch;
      else if (frame > i * stagger)     out += glyphs[(frame * 7 + i * 13) % glyphs.length];
      else                              out += " ";
    }
    el.textContent = out;
    frame++;
    if (frame <= total + finalText.length * stagger) requestAnimationFrame(tick);
    else el.textContent = finalText;
  }
  requestAnimationFrame(tick);
})();

/* =================================================================
   3D TILT on project cards (any page with cards)
   ================================================================= */
(function tiltCards() {
  if (reduceMotion || !canHover) return;
  const MAX = 9;
  document.querySelectorAll('.card').forEach(card => {
    const inner = card.querySelector('.card__inner');
    if (!inner) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      inner.style.transform = `rotateX(${(0.5 - py) * MAX * 2}deg) rotateY(${(px - 0.5) * MAX * 2}deg)`;
      card.style.setProperty('--gx', (px * 100) + '%');
      card.style.setProperty('--gy', (py * 100) + '%');
    });
    card.addEventListener('mouseleave', () => { inner.style.transform = ''; });
  });
})();

/* =================================================================
   CURSOR GLOW (skip on touch / reduced-motion)
   ================================================================= */
(function cursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  if (reduceMotion || !canHover) { glow.remove(); return; }

  let tx = 0, ty = 0, x = 0, y = 0, shown = false;
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { shown = true; glow.style.opacity = '1'; x = tx; y = ty; }
  }, { passive: true });
  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; shown = false; });

  (function trail() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(trail);
  })();
})();
