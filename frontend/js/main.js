/* ============================================================================
   MAIN.JS — Interacciones Cinematográficas, 3D Tilt y Efectos "Gear Reveal"
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initRoleTyper();
  initNavScrollState();
  initSmoothAnchors();
  initHero3DTilt();
  initConcentricParallax();
});

/* ---------------- Reveal Suave al Hacer Scroll ---------------- */
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
        const delay = Number(entry.target.getAttribute('data-reveal-delay') || 0);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---------------- Rotador de Roles en el Hero ---------------- */
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

  const TYPE_SPEED = 60;
  const DELETE_SPEED = 35;
  const HOLD_TIME = 1800;

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
        return setTimeout(tick, 350);
      }
      return setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------------- 3D Tilt Interactivo en Cards y Foto Hero ---------------- */
function initHero3DTilt() {
  const tiltElements = document.querySelectorAll('.hero__visual-card, .track, .stat');
  if (!tiltElements.length || window.matchMedia('(pointer: coarse)').matches) return;

  tiltElements.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
      const yPct = (mouseY / bounds.height - 0.5) * 2; // -1 to 1

      const rotateX = -yPct * 8; // max 8 deg
      const rotateY = xPct * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function onMouseLeave() {
      card.style.transition = 'transform 0.5s var(--ease-out), box-shadow 0.5s var(--ease-out)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ---------------- Parallax de Anillos Concéntricos (Motivo del Video) ---------------- */
function initConcentricParallax() {
  const stadium = document.querySelector('.stadium-bg');
  if (!stadium || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouseX = (e.clientX - cx) / cx; // -1 to 1
    mouseY = (e.clientY - cy) / cy;
  }, { passive: true });

  function step() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    const rings = stadium.querySelectorAll('.stadium-ring');
    rings.forEach((ring, idx) => {
      const factor = (idx + 1) * 2.5;
      ring.style.transform = `translate(${targetX * factor}px, ${targetY * factor}px)`;
    });

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ---------------- Nav Scroll State ---------------- */
function initNavScrollState() {
  const onScroll = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- Smooth Anchor Scroll ---------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
