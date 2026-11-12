/* ============================================================================
   RENDER.JS — Generación de Contenido para Todas las Secciones
   Renderiza Desarrollo, Fotografía, Contenido, Video y Contacto
   directamente en la vista principal o en páginas dedicadas de forma instantánea.
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
      <div class="track__arrow-wrap" aria-hidden="true">
        <span class="track__arrow">→</span>
      </div>
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
    <figure class="gallery-item" data-reveal data-reveal-delay="${(i % 3) * 50}">
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
      <div class="stat" data-reveal data-reveal-delay="${i * 50}">
        <span class="stat__value">${p.seguidores}</span>
        <span class="stat__label">${p.nombre}</span>
      </div>
    `).join('');
  }

  mount.innerHTML = data.piezas.map((p, i) => `
    <article class="card" data-reveal data-reveal-delay="${i * 50}">
      <div class="card__body">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="card__eyebrow">${p.formato}</span>
          ${p.alcance ? `<span class="chip" style="font-size: 11px; color: var(--c-white); background: var(--c-red); border-color: var(--c-red); font-weight:700;">${p.alcance}</span>` : ''}
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
    <article class="card" data-reveal data-reveal-delay="${i * 50}">
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
      <a href="${r.url}" target="_blank" rel="noopener" class="chip">${r.nombre} ↗</a>
    `).join('');
  }
}
