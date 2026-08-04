/* ============================================================================
   MAIN.JS — Interacciones y animaciones generales del sitio
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initRoleTyper();
  initNavScrollState();
  initSmoothAnchors();
  initYear();
});

/* ---------------- Reveal al hacer scroll ---------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-reveal-delay') || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---------------- Rotador de roles en el hero ---------------- */
function initRoleTyper() {
  const el = document.getElementById('role-typer');
  if (!el || typeof PORTFOLIO_DATA === 'undefined') return;

  const roles = PORTFOLIO_DATA.perfil.roles;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 1400;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, HOLD_TIME);
      }
      return setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, 300);
      }
      return setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------------- Nav: cambia estilo al hacer scroll ---------------- */
function initNavScrollState() {
  const onScroll = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- Scroll suave a anclas internas ---------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}
