/* ============================================================================
   RENDER.JS — Generación de Contenido Monocromático para Todas las Secciones
   Renderiza Desarrollo, Fotografía, Contenido, Video y Contacto
   directamente en la vista principal con respuesta ultrarrápida (< 0.22s).
   Estética Cyber-Editorial en blanco, titanio y negro carbón (sin rojo).
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderHomeTracks();
  renderDesarrollo();
  renderFotografia();
  renderContenido();
  renderVideo();
  renderContacto();
});

/* ---------------- TRACKS DE INICIO ---------------- */
function renderHomeTracks() {
  const mount = document.getElementById('home-tracks');
  if (!mount) return;

  const tracks = [
    { id: 'desarrollo', tag: '01', label: 'Desarrollo Web', desc: PORTFOLIO_DATA.desarrollo.intro },
    { id: 'fotografia', tag: '02', label: 'Fotografía', desc: PORTFOLIO_DATA.fotografia.intro },
    { id: 'contenido',  tag: '03', label: 'Creación de Contenido', desc: PORTFOLIO_DATA.contenido.intro },
    { id: 'video',      tag: '04', label: 'Edición de Video', desc: PORTFOLIO_DATA.video.intro }
  ];

  mount.innerHTML = tracks.map((t, i) => `
    <a class="track" href="#${t.id}" data-nav-target="${t.id}" data-reveal data-reveal-delay="${i * 50}">
      <div class="track__header">
        <span class="track__index">${t.tag}</span>
        <div class="track__body">
          <span class="track__label">${t.label}</span>
          <span class="track__desc">${t.desc}</span>
        </div>
      </div>
      <span class="track__arrow" aria-hidden="true">→</span>
    </a>
  `).join('');

  // Sincronizar textos del hero
  const heroBio = document.getElementById('hero-bio');
  if (heroBio) heroBio.textContent = PORTFOLIO_DATA.perfil.bio;

  const heroLocation = document.getElementById('hero-location');
  if (heroLocation) {
    heroLocation.innerHTML = `
      <span>${PORTFOLIO_DATA.perfil.ubicacion}</span>
      <span>${PORTFOLIO_DATA.perfil.coordenadas || "04°32'N 75°40'W"}</span>
    `;
  }
}

/* ---------------- DESARROLLO WEB ---------------- */
function renderDesarrollo() {
  const data = PORTFOLIO_DATA.desarrollo;

  const introEl = document.getElementById('dev-intro');
  if (introEl) introEl.textContent = data.intro;

  const serviciosMount = document.getElementById('dev-servicios');
  if (serviciosMount) {
    serviciosMount.innerHTML = data.servicios.map(s => `<li class="chip">${s}</li>`).join('');
  }

  const stackMount = document.getElementById('dev-stack');
  if (stackMount) {
    stackMount.innerHTML = data.stack.map(s => `<li class="chip">${s}</li>`).join('');
  }

  const proyectosMount = document.getElementById('dev-proyectos');
  if (proyectosMount && data.proyectos) {
    proyectosMount.innerHTML = data.proyectos.map((p, i) => `
      <article class="card" data-reveal data-reveal-delay="${i * 50}">
        <div class="card__body">
          <span class="card__eyebrow">${p.categoria}</span>
          <h3 class="card__title">${p.titulo}</h3>
          <p class="card__desc">${p.descripcion}</p>
          <ul class="chip-row" style="margin: 0.8rem 0;">
            ${p.tags.map(t => `<li class="chip" style="font-size: 11px; padding: 0.25rem 0.65rem;">${t}</li>`).join('')}
          </ul>
          <a class="card__link" href="${p.link}" ${p.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
            ${p.link.includes('github') ? 'Ver en GitHub ↗' : (p.link.startsWith('http') ? 'Visitar Sitio Web ↗' : 'Cotizar / Iniciar Proyecto →')}
          </a>
        </div>
      </article>
    `).join('');
  }
}

/* ---------------- FOTOGRAFÍA ---------------- */
function renderFotografia() {
  const mount = document.getElementById('foto-galeria');
  if (!mount) return;
  const data = PORTFOLIO_DATA.fotografia;

  const introEl = document.getElementById('foto-intro');
  if (introEl) introEl.textContent = data.intro;

  const equipoMount = document.getElementById('foto-equipo');
  if (equipoMount) {
    equipoMount.innerHTML = data.equipo.map(e => `<li class="chip">${e}</li>`).join('');
  }

  const filtrosMount = document.getElementById('foto-filtros');
  const categorias = ['Todos', ...new Set(data.galeria.map(g => g.categoria))];

  function renderGalleryItems(categoriaActiva = 'Todos') {
    const filtrados = categoriaActiva === 'Todos'
      ? data.galeria
      : data.galeria.filter(g => g.categoria === categoriaActiva);

    mount.innerHTML = filtrados.map((g, i) => `
      <figure class="gallery-item" data-category="${g.categoria}">
        <img src="${g.imagen}" alt="${g.titulo}" loading="lazy">
        <figcaption>
          <span class="gallery-item__cat">${g.categoria}</span>
          <span class="gallery-item__title">${g.titulo}</span>
        </figcaption>
      </figure>
    `).join('');
  }

  if (filtrosMount) {
    filtrosMount.innerHTML = categorias.map((cat, i) => `
      <button class="chip ${i === 0 ? 'is-active' : ''}" data-cat="${cat}" style="cursor: pointer; ${i === 0 ? 'background: #FFFFFF; border-color: #FFFFFF; color: #000000; font-weight:700;' : ''}">
        ${cat}
      </button>
    `).join('');

    filtrosMount.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        filtrosMount.querySelectorAll('button').forEach(b => {
          b.classList.remove('is-active');
          b.style.background = '';
          b.style.borderColor = '';
          b.style.color = '';
          b.style.fontWeight = '';
        });
        btn.classList.add('is-active');
        btn.style.background = '#FFFFFF';
        btn.style.borderColor = '#FFFFFF';
        btn.style.color = '#000000';
        btn.style.fontWeight = '700';

        renderGalleryItems(btn.getAttribute('data-cat'));
      });
    });
  }

  renderGalleryItems('Todos');
}

/* ---------------- ICONOS SVG OFICIALES PARA REDES SOCIALES ---------------- */
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.045.87.134V9.34a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.6a6.34 6.34 0 0 0 10.82 4.48c.36-.36.67-.77.92-1.22V10.4a8.16 8.16 0 0 0 4.85 1.57v-3.48a4.85 4.85 0 0 1 0-1.8z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
};

/* ---------------- CREACIÓN DE CONTENIDO (Acceso Directo con Iconos Oficiales) ---------------- */
function renderContenido() {
  const data = PORTFOLIO_DATA.contenido;
  if (!data) return;

  const introEl = document.getElementById('content-intro');
  if (introEl && data.intro) introEl.textContent = data.intro;

  const platMount = document.getElementById('content-plataformas');
  if (platMount && Array.isArray(data.canales)) {
    platMount.innerHTML = `
      <div class="social-grid">
        ${data.canales.map((c, i) => `
          <a href="${c.url}" target="_blank" rel="noopener" class="social-card" data-reveal data-reveal-delay="${i * 45}" aria-label="Abrir perfil de ${c.nombre} en nueva pestaña">
            <div class="social-card__left">
              <div class="social-card__icon">
                ${SOCIAL_ICONS[c.id] || ''}
              </div>
              <div class="social-card__info">
                <span class="social-card__name">${c.nombre}</span>
                <span class="social-card__handle">${c.handle}</span>
                <span class="social-card__badge">${c.badge || c.subtitulo || ''}</span>
              </div>
            </div>
            <div class="social-card__arrow" aria-hidden="true">↗</div>
          </a>
        `).join('')}
      </div>
    `;
  }

  // Si existe contenedor de piezas (opcional), renderizarlo
  const mount = document.getElementById('content-piezas');
  if (mount && Array.isArray(data.piezas)) {
    mount.innerHTML = data.piezas.map((p, i) => `
      <article class="card" data-reveal data-reveal-delay="${i * 50}">
        <div class="card__body">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="card__eyebrow">${p.formato}</span>
            ${p.alcance ? `<span class="chip" style="font-size: 11px; color: #FFFFFF; background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.3); font-weight:700;">${p.alcance}</span>` : ''}
          </div>
          <h3 class="card__title">${p.titulo}</h3>
          <p class="card__desc">${p.descripcion}</p>
          <span style="font-family: var(--font-mono); font-size: 13px; color: var(--text-mid);">${p.rol}</span>
        </div>
      </article>
    `).join('');
  }

  // Re-registrar observadores de scroll
  if (window.initScrollReveal) window.initScrollReveal();
}

function animateCounter(el, target) {
  const duration = 1200;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * ease);
    el.textContent = current.toLocaleString('es-CO');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('es-CO');
    }
  }

  requestAnimationFrame(update);
}

/* ---------------- EDICIÓN DE VIDEO ---------------- */
function renderVideo() {
  const mount = document.getElementById('video-proyectos');
  if (!mount) return;
  const data = PORTFOLIO_DATA.video;

  const introEl = document.getElementById('video-intro');
  if (introEl) introEl.textContent = data.intro;

  const toolsMount = document.getElementById('video-herramientas');
  if (toolsMount) {
    toolsMount.innerHTML = data.herramientas.map(h => `<li class="chip">${h}</li>`).join('');
  }

  mount.innerHTML = data.proyectos.map((p, i) => `
    <article class="card" data-reveal data-reveal-delay="${i * 50}">
      <div class="card__media card__media--video">
        <video src="${p.videoSrc}" title="${p.titulo}" controls preload="metadata" playsinline></video>
      </div>
      <div class="card__body">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="card__eyebrow">${p.tipo}</span>
          <div class="soundwave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <h3 class="card__title">${p.titulo}</h3>
        <p class="card__desc">${p.descripcion}</p>
      </div>
    </article>
  `).join('');
}

/* ---------------- CONTACTO ---------------- */
function renderContacto() {
  const emailEl = document.getElementById('contact-email');
  const waEl = document.getElementById('contact-whatsapp');
  const locEl = document.getElementById('contact-location');
  const redesEl = document.getElementById('contact-redes');

  if (emailEl) {
    emailEl.textContent = PORTFOLIO_DATA.perfil.email;
    emailEl.href = `mailto:${PORTFOLIO_DATA.perfil.email}`;
  }
  if (waEl && PORTFOLIO_DATA.perfil.whatsapp) {
    waEl.href = `https://wa.me/${PORTFOLIO_DATA.perfil.whatsapp}?text=Hola%20Miguel,%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto.`;
    waEl.innerHTML = `<span style="color: #000000 !important; font-weight: 700;">Chatear por WhatsApp</span> <span style="color: #000000 !important; font-weight: 700;" aria-hidden="true">↗</span>`;
  }
  if (locEl) locEl.textContent = `${PORTFOLIO_DATA.perfil.ubicacion} (${PORTFOLIO_DATA.perfil.coordenadas || "04°32'N 75°40'W"})`;
  if (redesEl) {
    redesEl.innerHTML = PORTFOLIO_DATA.redes.map(r => `
      <a href="${r.url}" target="_blank" rel="noopener" class="chip">${r.nombre} ↗</a>
    `).join('');
  }
}
