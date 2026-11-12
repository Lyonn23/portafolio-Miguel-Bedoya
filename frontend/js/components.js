/* ============================================================================
   COMPONENTS.JS — Navegación Omnidireccional Instantánea (<0.2s) & UI Global
   Garantiza que todos los botones de la barra funcionen en cualquier orden
   desde cualquier apartado con respuesta máxima de 0.2 segundos.
============================================================================ */

const NAV_ITEMS = [
  { id: 'inicio',     label: 'Inicio',     href: 'index.html#inicio',     tag: '00' },
  { id: 'desarrollo', label: 'Desarrollo', href: 'index.html#desarrollo', tag: '01' },
  { id: 'fotografia', label: 'Fotografía', href: 'index.html#fotografia', tag: '02' },
  { id: 'contenido',  label: 'Contenido',  href: 'index.html#contenido',  tag: '03' },
  { id: 'video',      label: 'Video',      href: 'index.html#video',      tag: '04' },
  { id: 'contacto',   label: 'Contacto',   href: 'index.html#contacto',   tag: '05' }
];

function isIndexPage() {
  const path = window.location.pathname.toLowerCase();
  return path.endsWith('index.html') || path.endsWith('/') || path === '' || !path.includes('.html');
}

/* ---------------- Render Nav ---------------- */
function renderNav() {
  const mount = document.getElementById('site-nav');
  if (!mount) return;
  const isHome = isIndexPage();

  mount.innerHTML = `
    <div class="nav-wrapper">
      <nav class="nav" id="nav">
        <a href="${isHome ? '#inicio' : 'index.html#inicio'}" class="nav__brand" data-nav-target="inicio" aria-label="Miguel Bedoya — inicio">
          <img class="nav__brand-logo" src="assets/logo.png" alt="MB logo">
          <span class="nav__brand-name">
            Miguel Bedoya
            <span class="nav__brand-tag">PRO</span>
          </span>
        </a>

        <button class="nav__toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav__links" id="nav-links">
          ${NAV_ITEMS.map(item => `
            <li>
              <a href="${isHome ? '#' + item.id : item.href}" 
                 class="nav__link ${item.id === 'inicio' ? 'is-active' : ''}" 
                 data-nav-target="${item.id}">
                <span class="nav__link-tag">${item.tag}</span>
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>

        <a href="${isHome ? '#contacto' : 'index.html#contacto'}" class="nav__cta" data-nav-target="contacto">
          <span>Hablemos</span>
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </div>
  `;

  setupNavInteractions();
}

/* ---------------- Interacciones de Navegación Instantánea ---------------- */
function setupNavInteractions() {
  const toggle = document.getElementById('nav-toggle');
  const linksWrap = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('[data-nav-target]');

  if (toggle && linksWrap) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = linksWrap.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !linksWrap.contains(e.target) && linksWrap.classList.contains('is-open')) {
        linksWrap.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Manejo de clic ultra-rápido en cualquier botón de la barra
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-nav-target');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        // En la misma página: salto suave e instantáneo sin recargar
        e.preventDefault();
        
        // Actualizar visualmente la clase activa al instante (<0.05s)
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('is-active'));
        const activeItem = document.querySelector(`.nav__link[data-nav-target="${targetId}"]`);
        if (activeItem) activeItem.classList.add('is-active');

        // Cerrar menú móvil al instante
        if (linksWrap) linksWrap.classList.remove('is-open');
        if (toggle) {
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }

        // Scroll suave hacia la sección
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Actualizar hash en la URL sin salto brusco
        if (history.pushState) {
          history.pushState(null, null, '#' + targetId);
        }
      }
    });
  });

  // Si la página se abre con un hash (ej: index.html#video), desplazar de inmediato
  if (window.location.hash) {
    const hashId = window.location.hash.substring(1);
    const hashEl = document.getElementById(hashId);
    if (hashEl) {
      setTimeout(() => {
        hashEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('is-active'));
        const activeLink = document.querySelector(`.nav__link[data-nav-target="${hashId}"]`);
        if (activeLink) activeLink.classList.add('is-active');
      }, 50);
    }
  }

  // Observer de Scroll para actualizar el botón activo automáticamente
  initScrollSpy();
}

/* ---------------- Scroll Spy para la barra de navegación ---------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav__link').forEach(l => {
          if (l.getAttribute('data-nav-target') === id) {
            l.classList.add('is-active');
          } else {
            l.classList.remove('is-active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-60px 0px -50% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------------- Render Footer ---------------- */
function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const { nombre, email, ubicacion, coordenadas } = PORTFOLIO_DATA.perfil;
  const year = new Date().getFullYear();
  const isHome = isIndexPage();

  mount.innerHTML = `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__col">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img class="nav__brand-logo" src="assets/logo.png" alt="logo">
            <span style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: #FFFFFF;">${nombre}</span>
          </div>
          <p class="footer__tagline">${PORTFOLIO_DATA.perfil.tagline}</p>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--c-red); display: flex; align-items: center; gap: 0.5em;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--c-red); box-shadow: 0 0 8px var(--c-red);"></span>
            <span>${ubicacion} · ${coordenadas || "04°32'N 75°40'W"}</span>
          </div>
        </div>

        <div class="footer__col">
          <span class="footer__label">Secciones</span>
          <ul class="footer__list">
            ${NAV_ITEMS.filter(item => item.id !== 'inicio').map(item => `
              <li><a href="${isHome ? '#' + item.id : item.href}" data-nav-target="${item.id}">${item.label}</a></li>
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

/* ---------------- Lightbox de Fotografía Instantáneo ---------------- */
function initGlobalLightbox() {
  if (document.getElementById('global-lightbox')) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'global-lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Cerrar">&times;</button>
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

  document.addEventListener('click', (e) => {
    const galleryTarget = e.target.closest('.gallery-item');
    if (galleryTarget) {
      const img = galleryTarget.querySelector('img');
      if (img && img.src) {
        imgEl.src = img.src;
        lightbox.classList.add('is-open');
      }
    }
  });
}

/* ---------------- Cursor Reactivo Ultrarrápido ---------------- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
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
    followerX += (mouseX - followerX) * 0.28;
    followerY += (mouseY - followerY) * 0.28;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  const interactiveSelector = 'a, button, input, textarea, .card, .gallery-item, .track, .chip, .hero__portrait-img';
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
