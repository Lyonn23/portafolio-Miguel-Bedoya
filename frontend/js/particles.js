/* ============================================================================
   PARTICLES.JS — Atmósfera de Polvo Volcánico y Embers Carmesí
   Partículas cinematográficas con reacción al cursor y brillo orgánico
============================================================================ */

function initParticles(canvasId, overrides = {}) {
  const CONFIG = Object.assign({
    density: 18000,
    maxParticles: 95,
    linkDistance: 110,
    speed: 0.28,
    baseRadius: 1.4,
    pulseAmplitude: 1.2,
    colorRgb: '255, 45, 75',        // Carmesí radiante
    accentColorRgb: '255, 255, 255', // Blanco estelar
    lineOpacityMax: 0.12,
    dotOpacityMax: 0.75,
    mouseRadius: 180,
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
    width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
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
      const isAccent = Math.random() < 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed - 0.08, // Leve deriva ascendente tipo ember
        size: Math.random() * CONFIG.baseRadius + 0.8,
        isAccent: isAccent,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0015 + Math.random() * 0.002
      });
    }
  }

  function step(t) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around screen
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Mouse gravitation & repel
      if (CONFIG.reactToMouse && mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseRadius && dist > 1) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }
      }
    }

    // Dibujar conexiones entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.linkDistance) {
          const opacity = (1 - dist / CONFIG.linkDistance) * CONFIG.lineOpacityMax;
          ctx.strokeStyle = `rgba(${CONFIG.colorRgb}, ${opacity})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Dibujar cada partícula (Embers con halo)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const pulse = reduceMotion ? 1 : (Math.sin(t * p.pulseSpeed + p.phase) * 0.3 + 0.8);
      const radius = p.size * pulse;
      const rgb = p.isAccent ? CONFIG.accentColorRgb : CONFIG.colorRgb;
      const alpha = p.isAccent ? 0.85 : 0.65;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(radius, 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.shadowColor = `rgba(${rgb}, 0.8)`;
      ctx.shadowBlur = p.isAccent ? 8 : 12;
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
