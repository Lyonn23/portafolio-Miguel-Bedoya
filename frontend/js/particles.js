/* ============================================================================
   PARTICLES.JS — Atmósfera de Embers Volcánicos (#FF0000 & #FFFFFF)
   Optimizado para 60fps con impacto visual inmediato
============================================================================ */

function initParticles(canvasId, overrides = {}) {
  const CONFIG = Object.assign({
    density: 18000,
    maxParticles: 75,
    linkDistance: 110,
    speed: 0.35,
    baseRadius: 1.5,
    colorRedRgb: '255, 0, 0',       // #FF0000 Puro
    colorWhiteRgb: '255, 255, 255', // #FFFFFF Puro
    lineOpacityMax: 0.14,
    mouseRadius: 160
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
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticlesArray();
  }

  function initParticlesArray() {
    const count = Math.min(CONFIG.maxParticles, Math.floor((width * height) / CONFIG.density));
    particles = [];
    for (let i = 0; i < count; i++) {
      const isRed = Math.random() < 0.65; // Mayoría rojas como el video
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed - 0.12, // Deriva ascendente
        size: Math.random() * CONFIG.baseRadius + 0.8,
        isRed: isRed,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function step(t) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseRadius && dist > 1) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
      }
    }

    // Líneas finas entre partículas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.linkDistance) {
          const alpha = (1 - dist / CONFIG.linkDistance) * CONFIG.lineOpacityMax;
          ctx.strokeStyle = `rgba(${CONFIG.colorRedRgb}, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Dibujar partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const pulse = reduceMotion ? 1 : (Math.sin(t * 0.002 + p.phase) * 0.35 + 0.85);
      const r = Math.max(p.size * pulse, 0.6);
      const rgb = p.isRed ? CONFIG.colorRedRgb : CONFIG.colorWhiteRgb;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.isRed ? 0.8 : 0.9})`;
      ctx.shadowColor = `rgba(${rgb}, 0.9)`;
      ctx.shadowBlur = p.isRed ? 10 : 6;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  requestAnimationFrame(step);
}
