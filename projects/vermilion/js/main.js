/* =====================================================================
   VERMILION — shared interactions
   Header scroll state · mobile nav · scroll-reveal · form confirmation
   · active nav link · footer year. Progressive enhancement; the site
   is fully usable with JS disabled.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Header: solidify on scroll ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile navigation drawer ---- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var drawer = document.querySelector('.nav__mobile');

  function setMenu(open) {
    if (nav) nav.classList.toggle('is-open', open);
    if (drawer) drawer.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!(nav && nav.classList.contains('is-open')));
    });
  }
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---- Active nav link based on current file ---- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  /* ---- Scroll-reveal via IntersectionObserver ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Reservation / inquiry form: front-end confirmation only ---- */
  document.querySelectorAll('form[data-confirm]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.form__success');
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('role', 'status');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
