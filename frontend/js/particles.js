/* ============================================================================
   PARTICLES.JS — Fondo de partículas tipo "constelación / waveform"
   ----------------------------------------------------------------------------
   Función reutilizable: se usa para el fondo general de la página Y para el
   efecto de "camuflaje" sobre la foto de perfil en el inicio.

   Editable rápido: cambia las constantes en cada CONFIG al llamar initParticles.
============================================================================ */

function initParticles(canvasId, overrides = {}) {
  const CONFIG = Object.assign({
    density: 16000,        // menor = más partículas (px² por partícula)
    maxParticles: 140,
    linkDistance: 130,
    speed: 0.18,
    baseRadius: 1.4,
    pulseAmplitude: 1.1,
    color: '255, 255, 255',
    lineOpacityMax: 0.16,
    dotOpacityMax: 0.75,
    mouseRadius: 160,
    reactToMouse: true
  }, overrides);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particles = [];
  let width, height, dpr;
  const mouse = { x: null, y: null };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticlesArray();
  }

  function initParticlesArray() {
    const count = Math.min(CONFIG.maxParticles, Math.floor((width * height) / CONFIG.density));
    particles = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function step(t) {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (CONFIG.reactToMouse && mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseRadius) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
          p.x += (dx / dist) * force * 0.6;
          p.y += (dy / dist) * force * 0.6;
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.linkDistance) {
          const o = (1 - dist / CONFIG.linkDistance) * CONFIG.lineOpacityMax;
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${o})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      const pulse = reduceMotion ? 0 : Math.sin(t * 0.001 + p.phase) * CONFIG.pulseAmplitude;
      const r = CONFIG.baseRadius + pulse * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(r, 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, ${CONFIG.dotOpacityMax})`;
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  if (CONFIG.reactToMouse) {
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  }

  resize();
  if (reduceMotion) {
    step(0);
  } else {
    requestAnimationFrame(step);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Fondo general de toda la página
  initParticles('particle-canvas');

  // Capa de partículas sobre la foto de perfil (solo existe en index.html)
  if (document.getElementById('hero-photo-canvas')) {
    initParticles('hero-photo-canvas', {
      density: 6000,
      maxParticles: 90,
      linkDistance: 70,
      speed: 0.12,
      baseRadius: 1.1,
      lineOpacityMax: 0.35,
      dotOpacityMax: 0.9,
      reactToMouse: false
    });
  }
});
