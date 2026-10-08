/* =========================================================
   Chyve landing page (new design).

   It is mounted into a SHADOW ROOT inside #root, so its CSS (landing.css) and its
   DOM can't collide with the app's styles.css / app.js, in either direction.

   app.js calls:
     ChyveLanding.mount(rootEl)   -> true if the landing is showing (safe to call on every render)
     ChyveLanding.unmount()       -> stops its timers / observers / listeners

   If this file fails to load, app.js falls back to its original renderLanding().
   Sign-up / log-in buttons carry data-go="signup" | "login" and call the app's global goTo().
   ========================================================= */
(function () {
  'use strict';

  /* Photo files live in ./img. Swap any entry for a different file or URL.
     If a file is missing we fall back to the matching dish photo from dishes.js. */
  const PH = {
    grilled: 'img/grilled.jpg', eggs: 'img/eggs.jpg', avocado: 'img/avocado.jpg', pancakes: 'img/pancakes.jpg',
    soup: 'img/soup.jpg', carbonara: 'img/carbonara.jpg', friedrice: 'img/friedrice.jpg', bolognese: 'img/bolognese.jpg',
    padthai: 'img/padthai.jpg', curry: 'img/curry.jpg', tacos: 'img/tacos.jpg', chili: 'img/chili.jpg',
    risotto: 'img/risotto.jpg', salmon: 'img/salmon.jpg', steak: 'img/steak.jpg', chicken: 'img/chicken.jpg',
    grilledBig: 'img/grilledBig.jpg',
  };
  const NAME = { grilled: 'Golden Grilled Cheese', eggs: 'Perfect Scrambled Eggs', avocado: 'Avocado Toast', pancakes: 'Fluffy Pancakes', soup: 'Tomato Soup', carbonara: 'Spaghetti Carbonara', friedrice: 'Fried Rice', bolognese: 'Spicy Bolognese', padthai: 'Pad Thai', curry: 'Chicken Curry', tacos: 'Fish Tacos', chili: 'Classic Chili', risotto: 'Mushroom Risotto', salmon: 'Pan-Seared Salmon', steak: 'Butter-Basted Steak', chicken: 'Roasted Chicken' };

  const MARKUP = `
<header class="nav" id="nav">
  <div class="nav-in glass dark">
    <a class="brand" href="#top" aria-label="Chyve home"><span data-mark="26"></span>Chyve</a>
    <nav class="nav-links" aria-label="Sections"><a href="#features">Features</a><a href="#cook">Cook along</a><a href="#levels">Levels</a><a href="#plans">Plans</a></nav>
    <a class="btn btn-white btn-sm" href="#signup" data-go="signup">Start free</a>
  </div>
</header>

<main id="top">
<div class="hero" id="hero">
  <div class="rings" aria-hidden="true"><i class="ring r1"></i><i class="ring r2"></i><i class="ring r3"></i></div>
  <div class="lights" aria-hidden="true"><i></i><i></i><i></i></div>

  <div class="wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="live glass"><b></b>A new dish unlocks every morning</span>
        <h1 class="head" aria-label="Learn to cook, one dish a day.">
          <span aria-hidden="true"><span class="w" style="--i:0">Learn</span> <span class="w" style="--i:1">to</span> <span class="w" style="--i:2">cook,</span> <span class="mark"><span class="w" style="--i:3">one</span> <span class="w" style="--i:4">dish</span> <span class="w" style="--i:5">a</span> <span class="w" style="--i:6">day.</span></span></span>
        </h1>
        <p class="sub">Chyve hands you one small, doable dish every day. Cook it, keep your streak, and level up from scrambled eggs to showpiece mains.</p>
        <div class="hero-cta">
          <a class="btn btn-dark" href="#signup" data-go="signup">Start free</a>
          <a class="btn btn-line" href="#login" data-go="login">I already have an account</a>
        </div>
        <div class="proof">
          <div class="faces" id="faces" aria-hidden="true"></div>
          <div><b>54 recipes, 6 levels</b><small>One new dish at a time</small></div>
        </div>
      </div>

      <div class="device" id="device">
        <div class="orbit" id="orbit" aria-hidden="true"></div>
        <div class="phone">
          <div class="screen">
            <div class="notch"></div>
            <div class="ph-top">
              <span class="avatar">S</span>
              <div class="grow"><small>Welcome back</small><b>Sam Miller</b></div>
              <span class="round"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 0 0 4 0"/></svg></span>
            </div>
            <div class="ph-h">What's cooking today?</div>
            <div class="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Search any recipe<span class="f"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg></span></div>
            <div class="cats" id="cats"></div>
            <div class="ph-sec">Today's pick<span>See all</span></div>
            <div class="tr" id="trending"></div>
            <div class="tabbar glass dark" aria-hidden="true">
              <i class="on"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 3 10.5V21h6v-6h6v6h6V10.5Z"/></svg></i>
              <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></i>
              <i><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.6 2.2c.3 2.6-.9 4-2.2 5.4C9 9 7.5 10.4 7.5 13a4.5 4.5 0 0 0 9 0c0-1.2-.4-2.1-.9-3 .9.2 1.9 1 2.4 2.2.1-1.2.1-2.3-.4-3.5-.7-1.8-2.3-3.1-3.4-4.3-.6-.7-1.2-1.4-1.6-2.2Z"/></svg></i>
              <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></i>
            </div>
          </div>
        </div>

        <div class="oc oc-row a glass"><img data-ph="eggs" alt=""><div><b>Scrambled Eggs</b><span class="s">Step 2 of 4</span></div></div>
        <div class="oc oc-row b glass"><img data-ph="avocado" alt=""><div><b>Avocado Toast</b><span class="s">6 min · +20 XP</span></div></div>
        <div class="oc oc-peach glass peach"><small>Servings <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg></small><b>2<span>people</span></b></div>
        <div class="oc oc-lime glass lime"><small>Cooking time <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg></small><div class="row"><b>8<span>mins</span></b><svg class="ringsvg" viewBox="0 0 36 36" aria-hidden="true"><circle class="t" cx="18" cy="18" r="15"/><circle class="p" cx="18" cy="18" r="15"/></svg></div></div>
        <div class="oc oc-xp glass dark"><i><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg></i>+20 XP earned</div>
      </div>
    </div>
  </div>
</div>

<section id="features">
  <div class="wrap">
    <div class="head-row rv">
      <div class="l"><span class="pillnote">How it works</span><h2>Small dishes.<br>Real momentum.</h2></div>
      <p class="sub">Showing up tonight matters more than any single fancy dinner. Everything in Chyve is built around that.</p>
    </div>
    <div class="cards">
      <article class="fc peach rv"><div><h3>A new dish, daily</h3><p>Each day unlocks one achievable recipe for your level. No cookbook to wade through, just tonight's dinner.</p></div><div class="vis mosaic" id="mosaic"></div></article>
      <article class="fc lime rv" style="--d:.08s"><div><h3>Streaks that stick</h3><p>Cook today and keep it alive. Miss a day and it resets.</p></div><div class="vis"><div class="week" id="week"></div><div class="big"><span style="font-size:inherit;color:inherit;font-weight:inherit;letter-spacing:inherit" data-count="6">0</span><span>day streak</span></div></div></article>
      <article class="fc rv" style="--d:.16s"><div><h3>Levels and badges</h3><p>Earn XP for every dish, grow from Seedling to Sage, and collect badges on the way.</p></div><div class="vis" style="display:grid;gap:14px"><div class="xpbar"><div class="t"><span>Seedling</span><span><span data-count="120">0</span> / 180 XP</span></div><div class="b"><i></i></div></div><div class="badges" id="badges"></div></div></article>
      <article class="fc dark rv" style="--d:.24s"><div><h3>Weekly boards and circles</h3><p>Race friends on the weekly leaderboard and join private circles.</p></div><div class="vis"><div class="board" id="board"></div><small style="display:block;margin-top:10px;font-size:11px;opacity:.5">Example names and scores</small></div></article>
    </div>
  </div>
</section>

<section id="cook" style="padding-top:0">
  <div class="cook">
    <div class="wrap cook-grid">
      <div class="cook-copy rv">
        <span class="pillnote">Cook along</span>
        <h2>Every step,<br>one at a time.</h2>
        <p class="sub">Plain instructions, a timer when you need one, and a satisfying finish. Tick off each step and watch your XP land the moment the dish is done.</p>
        <div class="facts">
          <div><b data-count="12">0</b><span>minutes, start to plate</span></div>
          <div><b data-count="470">0</b><span>kcal per sandwich</span></div>
          <div><b>+<span data-count="20">0</span></b><span>XP when you finish</span></div>
        </div>
        <a class="btn btn-white" href="#signup" data-go="signup">Cook your first dish</a>
      </div>
      <div class="shot rv" id="shot" style="--d:.1s">
        <img data-ph="grilledBig" alt="Golden grilled cheese sandwich">
        <div class="toast glass dark" id="toast"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg></i>+20 XP · 7 day streak</div>
        <div class="confetti" id="confetti" aria-hidden="true"></div>
        <div class="panel glass dark">
          <div class="ph"><div class="t"><b>Golden Grilled Cheese</b><small>Seedling · 12 min</small></div>
            <div class="timer"><svg viewBox="0 0 46 46"><circle class="t" cx="23" cy="23" r="20"/><circle class="p" id="tp" cx="23" cy="23" r="20"/></svg><span id="tt">8:00</span></div></div>
          <ol class="ol" id="ol">
            <li><i><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg></i>Heat a heavy pan over medium-low heat.</li>
            <li><i><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg></i>Butter one side of the bread, mayo the other.</li>
            <li><i><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg></i>Add cheese, flip, press, and cook until crusty.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="levels" style="padding-top:0">
  <div class="wrap">
    <div class="head-row rv">
      <div class="l"><span class="pillnote">The path</span><h2>From Seedling<br>to Sage.</h2></div>
      <p class="sub">Six levels of nine recipes each. Every dish adds XP and moves you up, until you're cooking dinner-party food on a Tuesday.</p>
    </div>
    <div class="lv-list rv" id="lvList"></div>
  </div>
</section>

<section id="dishes" style="padding-top:0;padding-inline:0">
  <div class="wrap">
    <div class="head-row rv">
      <div class="l"><span class="pillnote">The recipes</span><h2>Tonight's dinner,<br>sorted.</h2></div>
      <p class="sub">Weeknight classics and a few showpieces, each written to be doable the first time.</p>
    </div>
  </div>
  <div class="rail" aria-hidden="true"><div class="track" id="trackA"></div><div class="track rev" id="trackB"></div></div>
</section>

<section id="plans" style="padding-top:0">
  <div class="wrap">
    <div class="head-row rv"><div class="l"><span class="pillnote">Plans</span><h2>Free to start.<br>Upgrade when you want to.</h2></div></div>
    <div class="plans" id="plansEl"></div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="cta rv">
      <img class="bub" data-ph="carbonara" alt="" style="width:150px;height:150px;left:6%;top:12%">
      <img class="bub" data-ph="tacos" alt="" style="width:100px;height:100px;left:14%;bottom:10%;animation-delay:-3s">
      <img class="bub" data-ph="pancakes" alt="" style="width:130px;height:130px;right:7%;top:10%;animation-delay:-5s">
      <img class="bub" data-ph="salmon" alt="" style="width:96px;height:96px;right:15%;bottom:12%;animation-delay:-7s">
      <h2>Your first dish is ready.</h2>
      <p>About twelve minutes and one pan. Start your streak tonight.</p>
      <a class="btn btn-dark" href="#signup" data-go="signup">Start free</a>
    </div>
  </div>
</section>
</main>

<footer>
  <div class="wrap">
    <a class="brand" href="#top"><span data-mark="22"></span>Chyve</a>
    <span>Grow your cooking, one dish at a time.</span>
    <nav aria-label="Footer"><a href="#features">Features</a><a href="#plans">Plans</a><a href="#login" data-go="login">Log in</a></nav>
  </div>
</footer>
`;

  let current = null; // { host, cleanups: [] }

  function unmount() {
    if (!current) return;
    const c = current; current = null;
    c.cleanups.forEach(fn => { try { fn(); } catch (e) {} });
    if (c.host && c.host.parentNode) c.host.parentNode.removeChild(c.host);
  }

  function mount(root) {
    if (!root) return false;
    if (current && current.host.isConnected && current.host.parentNode === root) return true; // already showing
    unmount();
    const cleanups = [];
    try {
      const host = document.createElement('div');
      host.id = 'chyve-landing';
      const R = host.attachShadow({ mode: 'open' });
      current = { host, cleanups };

      // Keep the page hidden until landing.css is in, so there is no flash of unstyled content.
      host.style.display = 'none';
      const reveal = () => { host.style.display = ''; };
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = './landing.css';
      link.addEventListener('load', reveal); link.addEventListener('error', reveal);
      const failSafe = setTimeout(reveal, 2500);
      cleanups.push(() => clearTimeout(failSafe));
      R.appendChild(link);

      const tpl = document.createElement('template');
      tpl.innerHTML = MARKUP;
      R.appendChild(tpl.content);

      root.innerHTML = '';
      root.appendChild(host);
      init(R, cleanups);
      return true;
    } catch (e) {
      console.error('Chyve landing failed to mount, using the original landing page.', e);
      unmount();
      return false;
    }
  }

  function init(R, cleanups) {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = s => R.querySelector(s);
    const $$ = s => R.querySelectorAll(s);
    const img = (id, alt = NAME[id] || '') => `<img src="${PH[id]}" alt="${alt}" loading="lazy" draggable="false">`;
    $$('img[data-ph]').forEach(el => { el.src = PH[el.dataset.ph]; });

    /* Missing photo? Fall back to the matching dish photo from dishes.js, otherwise hide it
       (the dark tile behind it stays). error events don't bubble, so listen in the capture phase. */
    function fallbackPhoto(src) {
      const id = Object.keys(PH).find(k => PH[k] === src || src.endsWith('/' + PH[k]));
      if (!id) return '';
      const key = id.replace(/Big$/, '').toLowerCase();
      const hit = (window.DISHES || []).find(d => d && d.photo && String(d.name || '').toLowerCase().replace(/[^a-z]/g, '').includes(key));
      return hit ? hit.photo : '';
    }
    R.addEventListener('error', e => {
      const t = e.target;
      if (!t || t.tagName !== 'IMG') return;
      if (!t.dataset.fb) { t.dataset.fb = '1'; const fb = fallbackPhoto(t.getAttribute('src') || ''); if (fb) { t.src = fb; return; } }
      t.style.visibility = 'hidden';
    }, true);

    /* buttons + in-page links. Everything is handled here, so the page URL / hash never changes. */
    R.addEventListener('click', e => {
      const go = e.target.closest('[data-go]');
      if (go) { e.preventDefault(); if (typeof window.goTo === 'function') window.goTo(go.dataset.go); return; }
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = id && id !== 'top' ? R.getElementById(id) : null;
      const y = target ? target.getBoundingClientRect().top + window.scrollY - 96 : 0;
      window.scrollTo({ top: Math.max(0, y), behavior: still ? 'auto' : 'smooth' });
    });

    const mark = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#C6E78B"/><path d="M12 19V10" stroke="#141414" stroke-width="2" stroke-linecap="round"/><path d="M12 13c-3 0-4.5-2-4.5-4.5C10.5 8.5 12 10 12 13Z" fill="#141414"/><path d="M12 11c2.6 0 4-1.8 4-4-2.6 0-4 1.6-4 4Z" fill="#141414"/></svg>`;
    $$('[data-mark]').forEach(el => el.innerHTML = mark(el.dataset.mark));
    const CHECK = (s = 12, w = 3) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`;

    /* ---------- hero ---------- */
    $('#faces').innerHTML = ['grilled', 'eggs', 'carbonara', 'curry'].map(id => img(id, '')).join('');
    $('#orbit').innerHTML = [['carbonara', 20], ['tacos', 110], ['pancakes', 200], ['curry', 290]].map(([id, a]) => `<div class="orb" style="--a:${a}deg">${img(id, '')}</div>`).join('');
    const ic = p => `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
    $('#cats').innerHTML = [
      ['Breakfast', '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor"/>'],
      ['Lunch', '<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M9 7c0-1.5 1-1.5 1-3M14 7c0-1.5 1-1.5 1-3"/>'],
      ['Dinner', '<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M17 21V3c-2 1-3 4-3 8h3"/>'],
      ['Snacks', '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/><circle cx="11" cy="15" r="1" fill="currentColor"/>'],
      ['Dessert', '<path d="M5 20h14M6 20l1.5-8h9L18 20M9 12c0-3 1.5-5 3-5s3 2 3 5"/>'],
      ['More', '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'],
    ].map(([n, p], i) => `<div class="cat ${i === 5 ? 'on' : ''}">${ic(p)}${n}</div>`).join('');
    $('#trending').innerHTML = [['grilled', '12 min · Seedling'], ['friedrice', '25 min · Sprout']].map(([id, m], i) => `<div class="tcard">${img(id)}<button class="heart" type="button" aria-label="Save recipe" aria-pressed="${i === 0}"><svg width="12" height="12" viewBox="0 0 24 24" stroke-width="2.6" stroke-linejoin="round"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11Z"/></svg></button><span class="tname">${NAME[id]}<small>${m}</small></span></div>`).join('');
    $$('.heart').forEach(b => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true')));

    /* mouse parallax on the device + glass specular light */
    const hero = $('#hero'), device = $('#device'); let tx = 0, ty = 0, cx = 0, cy = 0;
    if (matchMedia('(pointer: fine)').matches && !still) {
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * 2 - 1; ty = ((e.clientY - r.top) / r.height) * 2 - 1; });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
      let raf = 0, alive = true;
      (function loop() { if (!alive) return; cx += (tx - cx) * .07; cy += (ty - cy) * .07; device.style.setProperty('--rx', cx.toFixed(3)); device.style.setProperty('--ry', cy.toFixed(3)); raf = requestAnimationFrame(loop); })();
      cleanups.push(() => { alive = false; cancelAnimationFrame(raf); });
    }
    R.addEventListener('pointermove', e => { const g = e.target.closest && e.target.closest('.glass'); if (!g) return; const r = g.getBoundingClientRect(); g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); g.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); });
    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    /* ---------- features ---------- */
    $('#mosaic').innerHTML = ['eggs', 'grilled', 'avocado', 'pancakes', 'soup', 'carbonara'].map((id, i) => `<div style="--i:${i}">${img(id)}</div>`).join('');
    $('#week').innerHTML = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<div class="day ${i < 5 ? 'on' : i === 5 ? 'today' : ''}" style="--i:${i}"><i>${CHECK(12, 3.2)}</i>${d}</div>`).join('');
    const flame = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.6 2.2c.3 2.6-.9 4-2.2 5.4C9 9 7.5 10.4 7.5 13a4.5 4.5 0 0 0 9 0c0-1.2-.4-2.1-.9-3 .9.2 1.9 1 2.4 2.2.1-1.2.1-2.3-.4-3.5-.7-1.8-2.3-3.1-3.4-4.3-.6-.7-1.2-1.4-1.6-2.2Z"/></svg>';
    $('#badges').innerHTML = [['First Bite', CHECK(14, 3)], ['Three in a Row', flame], ['One Week Strong', flame]].map(([n, i], k) => `<div class="badge" style="--i:${k}"><i>${i}</i>${n}</div>`).join('');
    $('#board').innerHTML = [['Maya R.', 'carbonara', '860 XP'], ['Jonas K.', 'tacos', '790 XP'], ['You', 'grilled', '720 XP']].map(([n, p, x], i) => `<div class="r ${n === 'You' ? 'me' : ''}" style="--i:${i}">${img(p, '')}<b>${n}</b><span>${x}</span></div>`).join('');

    /* ---------- cook along demo ---------- */
    const shot = $('#shot'), ol = $('#ol'), toast = $('#toast'), conf = $('#confetti'), tp = $('#tp'), tt = $('#tt');
    conf.innerHTML = Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * 6.283, d = 90 + Math.random() * 130; return `<s style="--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d * .8 - 20).toFixed(0)}px;--r:${(Math.random() * 540 - 270).toFixed(0)}deg;--dl:${(Math.random() * .15).toFixed(2)}s;background:${['#C6E78B', '#FFC19B', '#fff', '#E5484D'][i % 4]}"></s>`; }).join('');
    const steps = [...ol.children]; let phase = 0, cookTimer = null;
    function paint() {
      steps.forEach((li, i) => { li.classList.toggle('on', i === phase); li.classList.toggle('done', i < phase); });
      const p = Math.min(1, phase / 3), left = Math.round(480 * (1 - p)), m = Math.floor(left / 60), s = String(left % 60).padStart(2, '0');
      tt.textContent = m + ':' + s; tp.style.transition = 'stroke-dashoffset 2.4s linear'; tp.style.strokeDashoffset = 125.7 * (1 - p);
    }
    function tick() {
      phase++;
      if (phase === 3) { steps.forEach(li => { li.classList.remove('on'); li.classList.add('done'); }); tt.textContent = '0:00'; tp.style.strokeDashoffset = 0; toast.classList.add('show'); conf.classList.remove('go'); void conf.offsetWidth; conf.classList.add('go'); }
      else if (phase > 3) { phase = 0; toast.classList.remove('show'); conf.classList.remove('go'); tp.style.transition = 'none'; tp.style.strokeDashoffset = 125.7; paint(); }
      else paint();
    }
    function startCook() { if (cookTimer || still) return; shot.classList.add('run'); paint(); cookTimer = setInterval(tick, 2600); }
    function stopCook() { clearInterval(cookTimer); cookTimer = null; shot.classList.remove('run'); }
    const cookIO = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? startCook() : stopCook()), { threshold: .4 });
    cookIO.observe(shot);
    cleanups.push(() => { cookIO.disconnect(); stopCook(); });
    if (still) { phase = 2; paint(); }

    /* ---------- levels ---------- */
    const LV = [
      ['Seedling', 0, 'Everyday basics: eggs, toast, and simple sides.', ['eggs', 'grilled', 'avocado']],
      ['Sprout', 180, 'Building confidence with pastas, stir-fries, and weeknight wins.', ['friedrice', 'bolognese', 'carbonara']],
      ['Sprig', 360, 'Weeknight mains: curries, tacos, and one-pot meals.', ['curry', 'tacos', 'chili']],
      ['Bloom', 540, 'Dinner-party starters like risotto and fish.', ['risotto', 'salmon', 'padthai']],
      ['Harvest', 720, 'Showpiece mains: roasts, braises, and layered bakes.', ['chicken', 'steak', 'salmon']],
      ['Sage', 900, 'Master-level dishes, confit and beyond.', ['steak', 'risotto', 'chicken']],
    ];
    $('#lvList').innerHTML = LV.map(([n, xp, d, ex], i) => `<div class="lv-row"><span class="n">0${i + 1}</span><div><h3>${n}</h3><span class="xp">from ${xp} XP</span></div><p>${d}</p><div class="thumbs">${ex.map((id, k) => img(id).replace('<img', `<img style="--rot:${(k - 1) * 6}deg"`)).join('')}</div></div>`).join('');

    /* ---------- dish marquee ---------- */
    const lvOf = id => (LV.find(l => l[3].includes(id)) || LV[0])[0];
    const card = id => `<div class="dc">${img(id)}<div class="cap glass dark"><b>${NAME[id]}</b><small>${lvOf(id)}</small></div></div>`;
    const A = ['grilled', 'carbonara', 'curry', 'salmon', 'pancakes', 'chili', 'risotto', 'tacos'], B = ['eggs', 'friedrice', 'steak', 'soup', 'padthai', 'chicken', 'bolognese', 'avocado'];
    $('#trackA').innerHTML = [...A, ...A].map(card).join(''); $('#trackB').innerHTML = [...B, ...B].map(card).join('');

    /* ---------- plans ---------- */
    const P = [
      ['Seedling', 'Free', '', 'Everything you need to start climbing.', ['One suggested dish at a time', 'Full recipe path, Seedling to Sage', 'Streaks, XP and badges', 'Progress saved to your profile'], 'Start free', 'btn-line', false],
      ['Sprout+', '$4.99', '/mo', 'For cooks who want to move at their own pace.', ['Everything in Seedling', 'Unlock any level immediately', 'Adjust ingredient yields on every recipe', 'Ad-free, always'], 'Get Sprout+', 'btn-white', true],
      ['Vintner Pro', '$9.99', '/mo', 'For the ones cooking dinner parties on a Tuesday.', ['Everything in Sprout+', 'Upload and track your own recipes', 'Priority recipe requests', 'Early access to new dishes'], 'Get Vintner Pro', 'btn-line', false],
    ];
    $('#plansEl').innerHTML = P.map(([n, p, per, d, f, cta, bc, feat], i) => `<article class="plan rv ${feat ? 'feat' : ''}" style="--d:${i * .08}s"><div class="top">${n}${feat ? '<span class="pop">Most popular</span>' : ''}</div><div><div class="price">${p}<span>${per}</span></div><p class="d">${d}</p></div><ul>${f.map(x => `<li><i>${CHECK(11, 3.4)}</i>${x}</li>`).join('')}</ul><a class="btn ${bc}" href="#signup" data-go="signup">${cta}</a></article>`).join('');

    /* ---------- reveal + count-up ---------- */
    function count(el) { const to = +el.dataset.count, t0 = performance.now(), d = 1400; (function f(t) { const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e); if (p < 1 && el.isConnected) requestAnimationFrame(f); })(t0); }
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); e.target.querySelectorAll('[data-count]').forEach(c => still ? c.textContent = c.dataset.count : count(c)); io.unobserve(e.target); }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  window.ChyveLanding = { mount, unmount };
})();
