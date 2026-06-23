/* Throughline — shared behavior. Frozen contract; do not edit in page files. */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ------------------------------------------------ */
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    // Close menu when a link is chosen (mobile)
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.matchMedia('(max-width: 860px)').matches) {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Demo form: client validation + success state --------------------- */
  var form = document.querySelector('[data-demo-form]');
  if (form) {
    var success = document.querySelector('[data-form-success]');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setInvalid(field, on) {
      if (field) field.setAttribute('data-invalid', on ? 'true' : 'false');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;

      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var valid = input.value.trim() !== '';
        if (input.type === 'email') valid = emailRe.test(input.value.trim());
        setInvalid(field, !valid);
        if (!valid && ok) { ok = false; firstBad = input; }
        else if (!valid) ok = false;
      });

      if (!ok) { if (firstBad) firstBad.focus(); return; }

      if (success) {
        form.hidden = true;
        success.setAttribute('data-active', 'true');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });

    // Clear error as the user corrects it
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.getAttribute('data-invalid') === 'true') setInvalid(field, false);
      });
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
