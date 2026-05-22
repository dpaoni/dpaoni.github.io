// Fade-in observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Discord copy
function copyDiscord(btn) {
  navigator.clipboard.writeText('domisawsum');
  const handle = btn.querySelector('.social-handle');
  const original = handle.textContent;
  handle.textContent = 'Copied!';
  setTimeout(() => { handle.textContent = original; }, 1500);
}
