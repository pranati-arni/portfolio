/* =================================================================
   Pranati Arni — Portfolio behavior (shared by both pages)
   Every feature checks for its elements first, so the same file
   works on index.html (rail home) and projects.html (full grid).
   ================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* =================================================================
   QUICK CLEAN FADE — lift overlay on load, fade between pages
   (runs first so the overlay always lifts)
   ================================================================= */
(function pageFade() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;
  const hide = () => overlay.classList.add('is-hidden');

  if (reduceMotion) { hide(); return; }
  requestAnimationFrame(() => setTimeout(hide, 60));   // fade in on load

  // fade out, then navigate, for internal page-to-page links
  document.querySelectorAll('a[href]').forEach(a => {
    let url;
    try { url = new URL(a.href, location.href); } catch (e) { return; }
    const external   = a.target === '_blank' || url.origin !== location.origin || a.href.startsWith('mailto:');
    const inPageHash = url.pathname === location.pathname && url.hash;
    if (external || inPageHash) return;

    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (url.pathname === location.pathname && !url.hash) {     // same page → glide to top
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      overlay.classList.remove('is-hidden');
      setTimeout(() => { location.href = a.href; }, 420);
    });
  });
})();

/* =================================================================
   PROJECTS DATA  —  to add a real project:
   1. copy one object below
   2. fill in title / desc / tag / link
   3. change status from 'soon' to 'live'
   This single list feeds BOTH the home page and the projects page.
   ================================================================= */
const projects = [
  {
    title: "Welcome to CPAL — Dallas Child-Poverty Story",
    desc:  "An interactive data-story web page I built during my internship at the Child Poverty Action Lab. A ring of neighborhood clocks all keep one time, a \"play the years\" slider walks through Dallas child-poverty data from 1990 to today, and five chapters tell the story — the problem, the data, the network, the response, and the future. Static site: plain HTML, CSS, and JavaScript, no build step.",
    tag:   "HTML · CSS · JS · Data Viz",
    link:  "",            // add the live link here once it's deployed
    status:"live"          // 'soon' = placeholder · 'live' = real project
  },
  {
    title: "Compassion In Crisis — Nonprofit Website",
    desc:  "As Chief Technology Officer of this nonprofit, I built and maintain its website to raise awareness and support fundraising, along with its digital tools and online outreach.",
    tag:   "Web · Nonprofit",
    link:  "",
    status:"live"
  },
  {
    title: "Conversation Chatbot",
    desc:  "A chatbot that simulates a conversation with a user, built during the Elite 101 internship-preparation program while learning Git, Jira, source control, and team collaboration.",
    tag:   "Python · Chatbot",
    link:  "",
    status:"live"
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
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }
})();

/* =================================================================
   RAIL — build nodes, track scroll, highlight active (home only)
   ================================================================= */
const SECTIONS = [
  { id: 'about',        label: 'About'        },
  { id: 'journey',      label: 'Journey'      },
  { id: 'experience',   label: 'Experience'   },
  { id: 'achievements', label: 'Awards'       },
  { id: 'projects',     label: 'Projects'     },
  { id: 'skills',       label: 'Skills'       },
  { id: 'interests',    label: 'Interests'    },
  { id: 'contact',      label: 'Contact'      }
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

/* scroll progress → rail fill + comet (optional) */
(function scrollProgress() {
  const fill  = document.getElementById('railFill');
  const comet = document.getElementById('railComet');
  if (!fill && !comet) return;

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (fill)  fill.style.height = (pct * 100) + '%';
    if (comet) comet.style.top   = (pct * 100) + '%';
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
   3D TILT on project cards (any page with cards)
   ================================================================= */
(function tiltCards() {
  if (reduceMotion || !canHover) return;
  const MAX = 8;
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

/* =================================================================
   MAGNETIC BUTTONS (pull slightly toward the cursor)
   ================================================================= */
(function magnetic() {
  if (reduceMotion || !canHover) return;
  const STRENGTH = 16;
  document.querySelectorAll('.cta, .nav__cta, .more-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const my = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${mx * STRENGTH}px, ${my * STRENGTH}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* =================================================================
   HERO DEPTH — mouse parallax on the glow + scroll fade/scale
   ================================================================= */
(function heroDepth() {
  const hero = document.getElementById('top');
  if (!hero || reduceMotion) return;
  const glowWrap = hero.querySelector('.hero__glow-wrap');
  const content  = hero.querySelector('.hero__content');

  if (canHover && glowWrap) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const mx = (e.clientX - r.width / 2) / r.width;
      const my = (e.clientY - r.height / 2) / r.height;
      glowWrap.style.transform = `translate(${mx * 46}px, calc(-50% + ${my * 34}px))`;
    });
    hero.addEventListener('mouseleave', () => { glowWrap.style.transform = ''; });
  }

  if (content) {
    window.addEventListener('scroll', () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight || 1));
      content.style.opacity = String(Math.max(0, 1 - p * 1.15));
      content.style.transform = `translateY(${p * 46}px) scale(${1 - p * 0.06})`;
    }, { passive: true });
  }
})();

/* =================================================================
   FLOATING ACHIEVEMENTS — gentle float (handled by CSS @keyframes
   achFloat, composited transform only). Previously a per-frame
   requestAnimationFrame loop that called getBoundingClientRect on
   each card every frame, forcing a synchronous reflow ~60x/sec and
   driving up Total Blocking Time. CSS runs it on the compositor with
   zero main-thread cost.
   ================================================================= */
