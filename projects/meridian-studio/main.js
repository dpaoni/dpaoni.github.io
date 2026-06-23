/* Meridian Studio — shared behaviour. No dependencies. */
(function () {
  "use strict";

  /* Mark JS as available so reveal styles only hide content when we can show it. */
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile navigation ---------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-nav");
  if (toggle && panel) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---- Masthead border on scroll -------------------------- */
  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ----------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Portfolio filtering -------------------------------- */
  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-category]"));
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      var cat = btn.getAttribute("data-cat");
      filterBar.querySelectorAll(".filter").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      cards.forEach(function (card) {
        var match = cat === "all" || card.getAttribute("data-category") === cat;
        card.hidden = !match;
      });
    });
  }

  /* ---- Contact form: client-side validation + success ----- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var success = document.getElementById("form-success");

    var showError = function (field, message) {
      var wrap = field.closest(".field");
      var err = wrap.querySelector(".field__error");
      wrap.classList.toggle("field--invalid", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (err) err.textContent = message || "";
    };

    var validateField = function (field) {
      var value = (field.value || "").trim();
      if (field.hasAttribute("required") && !value) {
        showError(field, "This field is required.");
        return false;
      }
      if (field.type === "email" && value) {
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!ok) { showError(field, "Enter a valid email address."); return false; }
      }
      showError(field, "");
      return true;
    };

    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.closest(".field").classList.contains("field--invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"));
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var name = (form.querySelector("#name") || {}).value || "there";
      form.hidden = true;
      if (success) {
        var who = success.querySelector("[data-name]");
        if (who) who.textContent = name.split(" ")[0];
        success.classList.add("is-visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
  }

  /* ---- Footer year ---------------------------------------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
