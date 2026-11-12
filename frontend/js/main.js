/* ============================================================================
   MAIN.JS — Animaciones Fluidas, 3D Tilt, Contadores Dinámicos & Parallax
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initRoleTyper();
  initHeroParallax();
  initCard3DTilt();
  initAnimatedCounters();

  // MutationObserver con debounce para elementos insertados dinámicamente sin sobrecargar el hilo principal
  let mutationTimeout = null;
  const domObserver = new MutationObserver(() => {
    if (mutationTimeout) clearTimeout(mutationTimeout);
    mutationTimeout = setTimeout(() => {
      initScrollReveal();
      initAnimatedCounters();
    }, 120);
  });
  domObserver.observe(document.body, { childList: true, subtree: true });
});

/* ---------------- Animación Bidireccional de Scroll (Aparecen y Desaparecen al Subir o Bajar) ---------------- */
let revealObserver = null;
function initScrollReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Al salir del viewport se oculta para reanimar suavemente al regresar (bidireccional)
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '30px 0px -30px 0px' });
  }

  const targets = document.querySelectorAll('[data-reveal], .card, .track, .stat, .gh-repo-item, .contact-info__card, .gallery-item, .section__head');
  targets.forEach(el => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', '');
    }
    revealObserver.observe(el);
  });
}
window.initScrollReveal = initScrollReveal;

/* ---------------- Rotador de Roles con Efecto Mecatrónico Typing ---------------- */
function initRoleTyper() {
  const el = document.getElementById('role-typer');
  if (!el || typeof PORTFOLIO_DATA === 'undefined') return;

  const roles = PORTFOLIO_DATA.perfil.roles;
  if (!roles || !roles.length) return;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 50;
  const DELETE_SPEED = 28;
  const HOLD_TIME = 1500;

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
        return setTimeout(tick, 220);
      }
      return setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------------- Parallax Suave del Escenario Derecho ---------------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.hero__portrait-img');
  const stadium = document.querySelector('.stadium-stage');
  const watermark = document.querySelector('.hero__stage-watermark');

  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX = (e.clientX - cx) / (rect.width / 2);
    mouseY = (e.clientY - cy) / (rect.height / 2);
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  function renderParallax() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    if (portrait) {
      portrait.style.transform = `perspective(1000px) rotateY(${currentX * 8}deg) rotateX(${-currentY * 6}deg) translate3d(${currentX * 10}px, ${currentY * 6}px, 0)`;
    }

    if (stadium) {
      stadium.style.transform = `translateY(-50%) translate3d(${-currentX * 14}px, ${-currentY * 10}px, 0) rotate(${currentX * 1.5}deg)`;
    }

    if (watermark) {
      watermark.style.transform = `translateY(-50%) translate3d(${currentX * 20}px, ${currentY * 12}px, 0)`;
    }

    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/* ---------------- 3D Tilt Reactivo en Tarjetas con Reflejo Dinámico ---------------- */
function initCard3DTilt() {
  const tiltCards = document.querySelectorAll('.card, .track, .stat');
  if (!tiltCards.length || window.matchMedia('(pointer: coarse)').matches) return;

  tiltCards.forEach(card => {
    let rect;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.18s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -y * 10;
      const rotY = x * 10;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.22s var(--ease-quick), box-shadow 0.22s ease';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
}

/* ---------------- Animación de Números Rodantes en Estadísticas ---------------- */
let counterObserver = null;
function initAnimatedCounters() {
  const stats = document.querySelectorAll('.stat__value');
  if (!stats.length) return;

  if (!counterObserver) {
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-target-value') || el.textContent.replace(/\D/g, ''), 10);
        if (isNaN(targetVal) || targetVal <= 0) return;

        if (entry.isIntersecting) {
          animateCounterEl(el, targetVal);
        } else {
          // Al salir de pantalla se prepara para re-rodar al volver
          el.textContent = '0';
        }
      });
    }, { threshold: 0.15 });
  }

  stats.forEach(s => {
    if (!s.hasAttribute('data-target-value')) {
      const numMatch = s.textContent.match(/\d+[\.,]?\d*/);
      if (numMatch) {
        s.setAttribute('data-target-value', numMatch[0].replace(/\D/g, ''));
      }
    }
    counterObserver.observe(s);
  });
}
window.initAnimatedCounters = initAnimatedCounters;

function animateCounterEl(el, target) {
  let start = 0;
  const duration = 1100;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * ease);
    el.textContent = current.toLocaleString('es-CO');
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString('es-CO');
    }
  }
  requestAnimationFrame(tick);
}
window.animateCounterEl = animateCounterEl;
