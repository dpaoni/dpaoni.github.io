/* Vortex Property Services — shared site behaviour.
   Loaded with `defer` on every page. Every block guards for the elements it
   needs, so the same file is safe on pages that don't have them. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── MARK CURRENT PAGE IN NAV ── */
  (function () {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.primary-nav a, .side-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop().toLowerCase();
      if (href && href === here) a.setAttribute('aria-current', 'page');
    });
  })();

  /* ── SEASONAL BANNER — dismissal persists across pages (localStorage) ── */
  (function () {
    var banner = document.getElementById('seasonalBanner');
    if (!banner) return;
    var close = document.getElementById('bannerClose');
    if (close) {
      close.addEventListener('click', function () {
        try { localStorage.setItem('vpsBannerDismissed', '1'); } catch (e) {}
        banner.classList.add('dismissed');
      });
    }
  })();

  /* ── MOBILE DRAWER MENU ── */
  (function () {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('sideMenu');
    if (!toggle || !menu) return;
    var overlay = document.getElementById('sideOverlay');
    var closeBtn = document.getElementById('sideMenuClose');

    function open() {
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      menu.classList.add('open');
      menu.removeAttribute('aria-hidden');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) { close(); } else { open(); }
    });
    if (overlay) overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  })();

  /* ── HERO BACKGROUND PHOTO ──
     Activates only if images/hero.jpg actually loads. If the file is missing
     the <img> is removed and the hero keeps its light-blue gradient fallback,
     so nothing breaks before a real photo is added. */
  (function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var img = hero.querySelector('.hero-bg');
    if (!img) return;
    function activate() { hero.classList.add('has-hero-photo'); }
    function drop() { img.remove(); }
    if (img.complete) {
      if (img.naturalWidth > 0) activate(); else drop();
    } else {
      img.addEventListener('load', activate);
      img.addEventListener('error', drop);
    }
  })();

  /* ── OPTIONAL IMAGES ──
     Any <img data-optional> stays hidden until it actually loads, and removes
     itself if the file is missing — so photo slots can ship before the real
     photo exists without showing a broken-image icon. */
  (function () {
    document.querySelectorAll('img[data-optional]').forEach(function (img) {
      function show() { if (img.naturalWidth > 0) img.classList.add('is-loaded'); }
      function drop() { img.remove(); }
      if (img.complete) { if (img.naturalWidth > 0) show(); else drop(); }
      else { img.addEventListener('load', show); img.addEventListener('error', drop); }
    });
  })();

  /* ── HERO SCROLL ARROW ── */
  (function () {
    var arrow = document.getElementById('scrollArrow');
    if (!arrow) return;
    arrow.addEventListener('click', function () {
      var t = document.getElementById('process') || document.querySelector('section, main');
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  })();

  /* ── ACTIVE SECTION HIGHLIGHT for in-page anchor nav ── */
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.side-nav a[href^="#"], .primary-nav a[href^="#"]');
    if (!links.length) return;
    var map = new Map();
    links.forEach(function (l) {
      var id = l.getAttribute('href').slice(1);
      if (id) map.set(id, l);
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var link = map.get(e.target.id);
        if (!link) return;
        links.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { threshold: 0.1, rootMargin: '-10% 0px -55% 0px' });
    map.forEach(function (_link, id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  })();

  /* ── REVEAL-ON-SCROLL ── */
  function reveal(nodeList, cls, threshold) {
    var els = Array.prototype.slice.call(nodeList);
    if (!els.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add(cls); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add(cls); obs.unobserve(e.target); }
      });
    }, { threshold: threshold });
    els.forEach(function (el) { obs.observe(el); });
  }

  var snowRows = document.querySelectorAll('.snow-pricing-row');
  snowRows.forEach(function (r, i) { r.style.transitionDelay = (i * 0.07) + 's'; });
  reveal(snowRows, 'visible', 0.2);

  var whyCards = document.querySelectorAll('.why-card');
  whyCards.forEach(function (c, i) { c.style.setProperty('--card-delay', (i * 0.1) + 's'); });
  reveal(whyCards, 'visible', 0.3);

  reveal(document.querySelectorAll('.price-card.featured'), 'in-view', 0.45);

  /* ── CONTACT-CHIP ENTRANCE PULSE (homepage footer) ── */
  (function () {
    var chips = document.querySelectorAll('.contact-row .contact-chip');
    var footer = document.getElementById('quote');
    if (!chips.length || !footer || reducedMotion || !('IntersectionObserver' in window)) return;
    var done = false;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !done) {
          done = true;
          chips.forEach(function (chip, i) {
            chip.style.animationDelay = (i * 0.08) + 's';
            chip.classList.add('pulse');
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(footer);
  })();

  /* ── BEFORE / AFTER COMPARISON SLIDERS ── */
  (function () {
    var frames = document.querySelectorAll('[data-ba]');
    if (!frames.length) return;
    var active = null;

    function setPct(frame, pct) {
      pct = Math.min(100, Math.max(0, pct));
      var after = frame.querySelector('.ba-after');
      var div = frame.querySelector('.ba-divider');
      if (after) after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      if (div) { div.style.left = pct + '%'; div.setAttribute('aria-valuenow', Math.round(pct)); }
    }
    function drag(frame, clientX) {
      var r = frame.getBoundingClientRect();
      setPct(frame, (clientX - r.left) / r.width * 100);
    }

    document.addEventListener('mousemove', function (e) { if (active) drag(active, e.clientX); });
    document.addEventListener('mouseup', function () { active = null; });
    document.addEventListener('touchmove', function (e) { if (active) drag(active, e.touches[0].clientX); }, { passive: true });
    document.addEventListener('touchend', function () { active = null; });
    document.addEventListener('touchcancel', function () { active = null; });

    frames.forEach(function (frame) {
      var div = frame.querySelector('.ba-divider');
      if (!div) return;
      div.addEventListener('mousedown', function (e) { active = frame; e.preventDefault(); });
      div.addEventListener('touchstart', function () { active = frame; }, { passive: true });
      div.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var cur = parseFloat(div.style.left) || 50;
        setPct(frame, cur + (e.key === 'ArrowRight' ? 5 : -5));
      });
    });
  })();

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        var oq = o.querySelector('.faq-q');
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ── QUOTE FORM — shared by the homepage form and the dedicated quote page ── */
  (function () {
    var form = document.getElementById('quoteForm');
    if (!form) return;

    // Prefill the service select from a ?tier= link on the pricing cards.
    var TIER_SERVICE = {
      'basic-mowing': 'Lawn Care', 'yard-cleanup': 'Lawn Care', 'seasonal-cleanup': 'Lawn Care',
      'surface-cleaning': 'Power Washing', 'home-exterior': 'Power Washing', 'roof-cleaning': 'Power Washing',
      'snow-light': 'Snow Removal', 'snow-medium': 'Snow Removal', 'snow-heavy': 'Snow Removal',
      'snow-salting': 'Snow Removal', 'snow-commercial': 'Snow Removal', 'snow-seasonal': 'Snow Removal',
      'bundle': 'Multiple Services'
    };
    var tier = new URLSearchParams(window.location.search).get('tier');
    var serviceSel = form.querySelector('select[name="service"]');
    if (tier && serviceSel && TIER_SERVICE[tier]) {
      var want = TIER_SERVICE[tier];
      Array.prototype.forEach.call(serviceSel.options, function (o) {
        if (o.value === want || o.textContent.trim() === want) serviceSel.value = o.value;
      });
    }

    // Reveal a free-text field when "Other" is chosen for the referral source.
    var refSel = form.querySelector('select[name="referral"]');
    var refOther = form.querySelector('.ref-other');
    if (refSel && refOther) {
      var refInput = refOther.querySelector('input');
      var syncRefOther = function () {
        var show = refSel.value === 'Other';
        refOther.style.display = show ? '' : 'none';
        if (refInput) {
          refInput.disabled = !show;
          if (!show) refInput.value = '';
        }
      };
      refSel.addEventListener('change', syncRefOther);
      syncRefOther();
    }

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('.form-field').forEach(function (f) { f.classList.remove('has-error'); });

      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (el.type === 'hidden' || el.name === 'bot-field') return;
        var field = el.closest('.form-field');
        if (!field) return;
        var val = (el.value || '').trim();
        if (el.required && !val) { field.classList.add('has-error'); valid = false; return; }
        if (el.type === 'tel' && val && val.replace(/\D/g, '').length !== 10) { field.classList.add('has-error'); valid = false; return; }
        if (el.type === 'email' && val && !emailRe.test(val)) { field.classList.add('has-error'); valid = false; }
      });

      if (!valid) {
        var firstErr = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstErr) firstErr.focus();
        return;
      }

      var errEl = document.getElementById('formError');
      if (errEl) errEl.style.display = 'none';

      var payload = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      })
      .then(function (r) {
        if (!r.ok) throw new Error('Submission failed');
        var nameEl = form.querySelector('[name="name"]');
        var fn = document.getElementById('firstName');
        if (fn && nameEl) fn.textContent = nameEl.value.trim().split(' ')[0];
        form.style.display = 'none';
        var ok = document.getElementById('formSuccess');
        if (ok) ok.classList.add('visible');
      })
      .catch(function () {
        if (errEl) errEl.style.display = 'block';
      });
    });
  })();
})();
