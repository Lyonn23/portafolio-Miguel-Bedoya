/* ============================================================================
   RENDER.JS — Generación Dinámica de Vistas & Componentes del Portafolio
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderDesarrollo();
  renderFotografia();
  renderContenido();
  renderVideo();
  renderContacto();
});

/* ---------------- HOME ---------------- */
function renderHome() {
  const mount = document.getElementById('home-tracks');
  if (!mount) return;

  const tracks = [
    { key: 'dev', tag: '01', label: 'Desarrollo Web', href: 'desarrollo-web.html', desc: PORTFOLIO_DATA.desarrollo.intro },
    { key: 'foto', tag: '02', label: 'Fotografía', href: 'fotografia.html', desc: PORTFOLIO_DATA.fotografia.intro },
    { key: 'content', tag: '03', label: 'Creación de Contenido', href: 'creador-contenido.html', desc: PORTFOLIO_DATA.contenido.intro },
    { key: 'video', tag: '04', label: 'Edición de Video', href: 'edicion-video.html', desc: PORTFOLIO_DATA.video.intro }
  ];

  mount.innerHTML = tracks.map((t, i) => `
    <a class="track" href="${t.href}" data-reveal data-reveal-delay="${i * 90}">
      <div class="track__header">
        <span class="track__index">${t.tag}</span>
        <div class="track__body">
          <span class="track__label">${t.label}</span>
          <span class="track__desc">${t.desc}</span>
        </div>
      </div>
      <div class="track__arrow-wrap" aria-hidden="true">
        <span class="track__arrow">→</span>
      </div>
    </a>
  `).join('');

  // Sincronizar textos del hero
  const heroTag = document.getElementById('hero-location');
  if (heroTag) {
    heroTag.innerHTML = `<span>${PORTFOLIO_DATA.perfil.ubicacion}</span><span>${PORTFOLIO_DATA.perfil.coordenadas || "04°32'N 75°40'W"}</span>`;
  }

  const heroBio = document.getElementById('hero-bio');
  if (heroBio) heroBio.textContent = PORTFOLIO_DATA.perfil.bio;

  const badge = document.getElementById('availability-badge');
  if (badge && !PORTFOLIO_DATA.perfil.disponible) badge.style.display = 'none';

  // Renderizar Preview Destacado en Inicio (si el contenedor existe)
  renderHomeHighlights();
}

/* ---------------- HOME HIGHLIGHTS (Lo mejor de cada disciplina) ---------------- */
function renderHomeHighlights() {
  const mount = document.getElementById('home-highlights');
  if (!mount) return;

  mount.innerHTML = `
    <!-- Fila 1: Video Destacado + Estadísticas Virales -->
    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.75rem; margin-bottom: 2rem;" class="highlights-row">
      <div class="card" data-reveal>
        <div class="card__media card__media--video" style="aspect-ratio: 16/9;">
          <video src="${PORTFOLIO_DATA.video.proyectos[0].videoSrc}" controls preload="metadata" playsinline></video>
        </div>
        <div class="card__body">
          <span class="card__eyebrow">Producción Audiovisual Destacada</span>
          <h3 class="card__title">${PORTFOLIO_DATA.video.proyectos[0].titulo}</h3>
          <p class="card__desc">${PORTFOLIO_DATA.video.proyectos[0].descripcion}</p>
          <a class="card__link" href="edicion-video.html">Ver más producciones →</a>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div class="stat" data-reveal data-reveal-delay="80">
          <span class="stat__value">${PORTFOLIO_DATA.contenido.piezas[0].alcance}</span>
          <span class="stat__label">Alcance Viral TikTok</span>
        </div>
        <div class="stat" data-reveal data-reveal-delay="120">
          <span class="stat__value">1.194+</span>
          <span class="stat__label">Comunidad Instagram</span>
        </div>
        <div class="stat" data-reveal data-reveal-delay="160">
          <span class="stat__value">100%</span>
          <span class="stat__label">Compromiso & Detalle</span>
        </div>
      </div>
    </div>

    <!-- Fila 2: Muestra Fotográfica Rápida -->
    <div class="section__head" style="margin-top: var(--space-4);">
      <div>
        <span class="eyebrow">Capturas Recientes</span>
        <h3 class="section-title" style="font-size: var(--fs-h2);">Encuadres & Color</h3>
      </div>
      <a href="fotografia.html" class="btn">Explorar Galería Completa →</a>
    </div>

    <div class="gallery" style="margin-top: 1.5rem;">
      ${PORTFOLIO_DATA.fotografia.galeria.slice(0, 3).map((g, i) => `
        <figure class="gallery-item" data-reveal data-reveal-delay="${i * 90}">
          <img src="${g.imagen}" alt="${g.titulo}" loading="lazy">
          <figcaption>
            <span class="gallery-item__cat">${g.categoria}</span>
            <span class="gallery-item__title">${g.titulo}</span>
          </figcaption>
        </figure>
      `).join('')}
    </div>
  `;
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
      <article class="card" data-reveal data-reveal-delay="${i * 90}">
        <div class="card__body">
          <span class="card__eyebrow">${p.categoria}</span>
          <h3 class="card__title">${p.titulo}</h3>
          <p class="card__desc">${p.descripcion}</p>
          <ul class="chip-row" style="margin: 0.8rem 0;">
            ${p.tags.map(t => `<li class="chip" style="font-size: 0.7rem; padding: 0.25rem 0.65rem;">${t}</li>`).join('')}
          </ul>
          <a class="card__link" href="${p.link}" ${p.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
            ${p.link.startsWith('http') ? 'Ver en GitHub ↗' : 'Consultar Proyecto →'}
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

  const equipoEl = document.getElementById('foto-equipo');
  if (equipoEl) {
    equipoEl.innerHTML = data.equipo.map(e => `<li class="chip">${e}</li>`).join('');
  }

  mount.innerHTML = data.galeria.map((g, i) => `
    <figure class="gallery-item" data-reveal data-reveal-delay="${(i % 3) * 90}">
      <img src="${g.imagen}" alt="${g.titulo}" loading="lazy">
      <figcaption>
        <span class="gallery-item__cat">${g.categoria}</span>
        <span class="gallery-item__title">${g.titulo}</span>
      </figcaption>
    </figure>
  `).join('');
}

/* ---------------- CREACIÓN DE CONTENIDO ---------------- */
function renderContenido() {
  const mount = document.getElementById('content-piezas');
  if (!mount) return;
  const data = PORTFOLIO_DATA.contenido;

  const introEl = document.getElementById('content-intro');
  if (introEl) introEl.textContent = data.intro;

  const platMount = document.getElementById('content-plataformas');
  if (platMount) {
    platMount.innerHTML = data.plataformas.map((p, i) => `
      <div class="stat" data-reveal data-reveal-delay="${i * 90}">
        <span class="stat__value">${p.seguidores}</span>
        <span class="stat__label">${p.nombre}</span>
      </div>
    `).join('');
  }

  mount.innerHTML = data.piezas.map((p, i) => `
    <article class="card" data-reveal data-reveal-delay="${i * 90}">
      <div class="card__body">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="card__eyebrow">${p.formato}</span>
          ${p.alcance ? `<span class="chip" style="font-size: 0.7rem; color: var(--crimson-light); border-color: rgba(255,45,75,0.4);">${p.alcance}</span>` : ''}
        </div>
        <h3 class="card__title">${p.titulo}</h3>
        <p class="card__desc">${p.descripcion}</p>
        <a class="card__link" href="${p.link}" target="_blank" rel="noopener">Ver publicación ↗</a>
      </div>
    </article>
  `).join('');
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
    <article class="card" data-reveal data-reveal-delay="${i * 90}">
      <div class="card__media card__media--video">
        <video src="${p.videoSrc}" title="${p.titulo}" controls preload="metadata" playsinline></video>
      </div>
      <div class="card__body">
        <span class="card__eyebrow">${p.tipo}</span>
        <h3 class="card__title">${p.titulo}</h3>
        <p class="card__desc">${p.descripcion}</p>
      </div>
    </article>
  `).join('');
}

/* ---------------- CONTACTO ---------------- */
function renderContacto() {
  const emailEl = document.getElementById('contact-email');
  const phoneEl = document.getElementById('contact-phone');
  const waEl = document.getElementById('contact-whatsapp');
  const locEl = document.getElementById('contact-location');
  const redesEl = document.getElementById('contact-redes');

  if (emailEl) {
    emailEl.textContent = PORTFOLIO_DATA.perfil.email;
    emailEl.href = `mailto:${PORTFOLIO_DATA.perfil.email}`;
  }
  if (phoneEl) {
    phoneEl.textContent = PORTFOLIO_DATA.perfil.telefono;
    phoneEl.href = `tel:${PORTFOLIO_DATA.perfil.telefono.replace(/\s/g, '')}`;
  }
  if (waEl && PORTFOLIO_DATA.perfil.whatsapp) {
    waEl.textContent = PORTFOLIO_DATA.perfil.telefono;
    waEl.href = `https://wa.me/${PORTFOLIO_DATA.perfil.whatsapp}?text=Hola%20Miguel,%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto.`;
  }
  if (locEl) locEl.textContent = `${PORTFOLIO_DATA.perfil.ubicacion} (${PORTFOLIO_DATA.perfil.coordenadas || "04°32'N 75°40'W"})`;
  if (redesEl) {
    redesEl.innerHTML = PORTFOLIO_DATA.redes.map(r => `
      <a href="${r.url}" target="_blank" rel="noopener" class="chip" style="font-size: 0.82rem;">${r.nombre} ↗</a>
    `).join('');
  }
}
