/* ============================================================================
   MAIN.JS — Animaciones Gear Reveal de Alto Rendimiento & Respuesta <0.2s
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initRoleTyper();
  initHeroParallax();
  initCard3DTilt();
});

/* ---------------- Reveal Ultrarrápido al Hacer Scroll ---------------- */
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
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---------------- Rotador de Roles con Efecto Mecatrónico ---------------- */
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

  const TYPE_SPEED = 45;   // Rápido y enérgico
  const DELETE_SPEED = 25;
  const HOLD_TIME = 1300;

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
        return setTimeout(tick, 200);
      }
      return setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------------- Parallax 3D Central (Foto + Anillos + Mega Título) ---------------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.hero__portrait-img');
  const stadium = document.querySelector('.stadium-stage');
  const megaTitle = document.querySelector('.hero__mega-title');

  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX = (e.clientX - cx) / (rect.width / 2); // -1 a 1
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
      portrait.style.transform = `perspective(1000px) rotateY(${currentX * 10}deg) rotateX(${-currentY * 8}deg) translate3d(${currentX * 12}px, ${currentY * 8}px, 0)`;
    }

    if (stadium) {
      stadium.style.transform = `translate(calc(-50% + ${-currentX * 18}px), calc(-50% + ${-currentY * 12}px)) rotate(${currentX * 2}deg)`;
    }

    if (megaTitle) {
      megaTitle.style.transform = `translate(calc(-50% + ${currentX * 25}px), calc(-50% + ${currentY * 15}px))`;
    }

    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/* ---------------- 3D Tilt Reactivo en Tarjetas (<0.15s) ---------------- */
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
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -y * 12;
      const rotY = x * 12;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.22s var(--ease-quick), box-shadow 0.22s ease';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
}
