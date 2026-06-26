// Stagger fade-in children inside grid containers
document.querySelectorAll('.skills-grid, .certs-grid, .pricing-grid, .beyond-grid, .gallery-grid').forEach(grid => {
  Array.from(grid.querySelectorAll(':scope > .fade-in')).forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 75}ms`);
  });
});

// Scroll reveal observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  const setOpen = (open) => {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
}

// Discord copy
function copyDiscord(btn) {
  const handle = btn.querySelector('.social-handle');
  const original = handle.textContent;
  const flash = (msg) => {
    handle.textContent = msg;
    setTimeout(() => { handle.textContent = original; }, 1500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText('domisawsum')
      .then(() => flash('Copied!'))
      .catch(() => flash('domisawsum'));
  } else {
    // Insecure context / unsupported: surface the handle so it can be copied manually
    flash('domisawsum');
  }
}
