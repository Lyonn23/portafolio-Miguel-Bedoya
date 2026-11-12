/* ============================================================================
   COMPONENTS.JS — Navegación Flotante, Footer HUD & Componentes Globales
   ============================================================================ */

const NAV_LINKS = [
  { href: 'index.html',            label: 'Inicio',     track: 'home',    tag: '00' },
  { href: 'desarrollo-web.html',   label: 'Desarrollo', track: 'dev',     tag: '01' },
  { href: 'fotografia.html',       label: 'Fotografía', track: 'foto',    tag: '02' },
  { href: 'creador-contenido.html',label: 'Contenido',  track: 'content', tag: '03' },
  { href: 'edicion-video.html',    label: 'Video',      track: 'video',   tag: '04' },
  { href: 'contacto.html',         label: 'Contacto',   track: 'contacto',tag: '05' }
];

function currentTrack() {
  return document.body.getAttribute('data-track') || 'home';
}

/* ---------------- Render Nav ---------------- */
function renderNav() {
  const mount = document.getElementById('site-nav');
  if (!mount) return;
  const active = currentTrack();
  const { nombre } = PORTFOLIO_DATA.perfil;

  mount.innerHTML = `
    <div class="nav-wrapper">
      <nav class="nav" id="nav">
        <a href="index.html" class="nav__brand" aria-label="${nombre} — inicio">
          <img class="nav__brand-logo" src="assets/logo.png" alt="${nombre} — logo">
          <span class="nav__brand-name">
            ${nombre}
            <span class="nav__brand-tag">PRO</span>
          </span>
        </a>

        <button class="nav__toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav__links" id="nav-links">
          ${NAV_LINKS.map(link => `
            <li>
              <a href="${link.href}" class="nav__link ${link.track === active ? 'is-active' : ''}">
                <span class="nav__link-tag">${link.tag}</span>
                ${link.label}
              </a>
            </li>
          `).join('')}
          <li class="nav__mobile-cta" style="margin-top: 0.5rem; display: none;">
            <a href="contacto.html" class="btn btn--solid" style="width: 100%;">Iniciar Proyecto</a>
          </li>
        </ul>

        <a href="contacto.html" class="nav__cta">
          <span>Hablemos</span>
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </div>
  `;

  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('is-open');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target) && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ---------------- Render Footer ---------------- */
function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const { nombre, email, ubicacion } = PORTFOLIO_DATA.perfil;
  const year = new Date().getFullYear();

  mount.innerHTML = `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__col">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img class="nav__brand-logo" src="assets/logo.png" alt="${nombre} — logo">
            <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: #ffffff;">${nombre}</span>
          </div>
          <p class="footer__tagline">${PORTFOLIO_DATA.perfil.tagline}</p>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--crimson-light); display: flex; align-items: center; gap: 0.5em; margin-top: 0.25rem;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--crimson-core); box-shadow: 0 0 8px var(--crimson-core);"></span>
            <span>${ubicacion}</span>
          </div>
        </div>

        <div class="footer__col">
          <span class="footer__label">Disciplinas</span>
          <ul class="footer__list">
            ${NAV_LINKS.filter(l => l.track !== 'home').map(l => `
              <li><a href="${l.href}">${l.label}</a></li>
            `).join('')}
          </ul>
        </div>

        <div class="footer__col">
          <span class="footer__label">Conectar</span>
          <ul class="footer__list">
            ${PORTFOLIO_DATA.redes.map(r => `
              <li><a href="${r.url}" target="_blank" rel="noopener">${r.nombre} ↗</a></li>
            `).join('')}
            <li><a href="mailto:${email}">${email}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© ${year} ${nombre}. Todos los derechos reservados.</span>
        <span class="footer__made">CREATIVE SUITE // CODE · PHOTO · CONTENT · VIDEO</span>
      </div>
    </footer>
  `;
}

/* ---------------- Inyección de Lightbox Global para Imágenes ---------------- */
function initGlobalLightbox() {
  if (document.getElementById('global-lightbox')) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'global-lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Cerrar vista">&times;</button>
    <img class="lightbox__img" src="" alt="Vista ampliada">
  `;
  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector('.lightbox__img');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  const close = () => {
    lightbox.classList.remove('is-open');
    imgEl.src = '';
  };

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });

  // Delegación de clic para abrir imágenes de galería
  document.addEventListener('click', (e) => {
    const galleryTarget = e.target.closest('.gallery-item') || e.target.closest('[data-lightbox]');
    if (galleryTarget) {
      const img = galleryTarget.querySelector('img') || galleryTarget;
      if (img && img.src) {
        imgEl.src = img.src;
        lightbox.classList.add('is-open');
      }
    }
  });
}

/* ---------------- Inyección de Cursor HUD Reactivo ---------------- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // No en móviles/touch
  if (document.querySelector('.custom-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';

  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states sobre elementos interactivos
  const interactiveSelector = 'a, button, input, textarea, .card, .gallery-item, .track, .hero__visual-card, .chip';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  initGlobalLightbox();
  initCustomCursor();
});
