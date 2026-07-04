// Scroll reveal
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    revealItems.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach(el => observer.observe(el));
  }
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

// Mobile nav toggle (.site-nav pattern)
const menuToggle = document.querySelector('.menu-toggle');
const navActions = document.querySelector('.nav-actions');
if (menuToggle && navActions) {
  function closeMenu() {
    navActions.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menu';
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navActions.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Close' : 'Menu';
    if (!isOpen) menuToggle.focus();
  });

  navActions.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navActions.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navActions.classList.contains('open')) {
      closeMenu();
    }
  });
}

// Discord copy (contact page)
function copyDiscord(btn) {
  const handle = btn.querySelector('.social-handle');
  if (!handle) return;
  const original = handle.textContent;
  const flash = msg => {
    handle.textContent = msg;
    setTimeout(() => { handle.textContent = original; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText('').then(() => flash('Copied!')).catch(() => flash(''));
  } else {
    flash('');
  }
}
