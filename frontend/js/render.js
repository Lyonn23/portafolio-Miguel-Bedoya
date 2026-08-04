/* ============================================================================
   RENDER.JS — Pinta el contenido de PORTFOLIO_DATA (data.js) en cada página
   ----------------------------------------------------------------------------
   No necesitas tocar este archivo para actualizar textos o proyectos:
   eso se edita en data.js. Este archivo solo decide DÓNDE se inserta.
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderDesarrollo();
  renderFotografia();
  renderContenido();
  renderVideo();
  renderContacto();
});

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  const mount = document.getElementById('home-tracks');
  if (!mount) return;

  const tracks = [
    { key: 'dev', label: 'Desarrollo Web', href: 'desarrollo-web.html', desc: PORTFOLIO_DATA.desarrollo.intro },
    { key: 'foto', label: 'Fotografía', href: 'fotografia.html', desc: PORTFOLIO_DATA.fotografia.intro },
    { key: 'content', label: 'Creación de Contenido', href: 'creador-contenido.html', desc: PORTFOLIO_DATA.contenido.intro },
    { key: 'video', label: 'Edición de Video', href: 'edicion-video.html', desc: PORTFOLIO_DATA.video.intro }
  ];

  mount.innerHTML = tracks.map((t, i) => `
    <a class="track" href="${t.href}" data-reveal data-reveal-delay="${i * 80}">
      <span class="track__index">${String(i + 1).padStart(2, '0')}</span>
      <span class="track__body">
        <span class="track__label">${t.label}</span>
        <span class="track__desc">${t.desc}</span>
      </span>
      <span class="track__arrow" aria-hidden="true">→</span>
    </a>
  `).join('');

  const heroTag = document.getElementById('hero-location');
  if (heroTag) heroTag.textContent = PORTFOLIO_DATA.perfil.ubicacion;

  const heroBio = document.getElementById('hero-bio');
  if (heroBio) heroBio.textContent = PORTFOLIO_DATA.perfil.bio;

  const badge = document.getElementById('availability-badge');
  if (badge && !PORTFOLIO_DATA.perfil.disponible) badge.style.display = 'none';
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
}

/* ---------------- FOTOGRAFÍA ---------------- */
function renderFotografia() {
  const mount = document.getElementById('foto-galeria');
  if (!mount) return;
  const data = PORTFOLIO_DATA.fotografia;

  const introEl = document.getElementById('foto-intro');
  if (introEl) introEl.textContent = data.intro;

  const equipoEl = document.getElementById('foto-equipo');
  if (equipoEl) equipoEl.innerHTML = data.equipo.map(e => `<li>${e}</li>`).join('');

  mount.innerHTML = data.galeria.map((g, i) => `
    <figure class="gallery-item" data-reveal data-reveal-delay="${(i % 3) * 80}">
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
    platMount.innerHTML = data.plataformas.map(p => `
      <div class="stat">
        <span class="stat__value">${p.seguidores}</span>
        <span class="stat__label">${p.nombre}</span>
      </div>
    `).join('');
  }

  mount.innerHTML = data.piezas.map((p, i) => `
    <article class="card card--row" data-reveal data-reveal-delay="${i * 80}">
      <span class="card__eyebrow">${p.formato}</span>
      <h3 class="card__title">${p.titulo}</h3>
      <p class="card__desc">${p.descripcion}</p>
      <a class="card__link" href="${p.link}" target="_blank" rel="noopener">Ver pieza →</a>
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
  if (toolsMount) toolsMount.innerHTML = data.herramientas.map(h => `<li class="chip">${h}</li>`).join('');

  mount.innerHTML = data.proyectos.map((p, i) => `
    <article class="card" data-reveal data-reveal-delay="${i * 80}">
      <div class="card__media card__media--video">
        ${p.videoSrc
          ? `<video src="${p.videoSrc}" title="${p.titulo}" controls preload="metadata" playsinline></video>`
          : `<span class="card__media-placeholder">▶</span>`}
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

  if (emailEl) { emailEl.textContent = PORTFOLIO_DATA.perfil.email; emailEl.href = `mailto:${PORTFOLIO_DATA.perfil.email}`; }
  if (phoneEl) { phoneEl.textContent = PORTFOLIO_DATA.perfil.telefono; phoneEl.href = `tel:${PORTFOLIO_DATA.perfil.telefono.replace(/\s/g, '')}`; }
  if (waEl && PORTFOLIO_DATA.perfil.whatsapp) {
    waEl.textContent = PORTFOLIO_DATA.perfil.telefono;
    waEl.href = `https://wa.me/${PORTFOLIO_DATA.perfil.whatsapp}`;
  }
  if (locEl) locEl.textContent = PORTFOLIO_DATA.perfil.ubicacion;
  if (redesEl) {
    redesEl.innerHTML = PORTFOLIO_DATA.redes.map(r => `<a href="${r.url}" target="_blank" rel="noopener" class="social-link">${r.nombre}</a>`).join('');
  }
}
