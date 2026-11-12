/* ============================================================================
   COMPONENTS.JS — Navegación con Píldora Deslizante & UI Omnidireccional
   El indicador de cristal plateado se desplaza suavemente al hacer clic o scroll.
   Marca en texto puro "Miguel Bedoya" (sin ícono circular). Cero cursor custom.
============================================================================ */

const NAV_ITEMS = [
  { id: 'inicio',     label: 'Inicio',     href: '#inicio',     tag: '00' },
  { id: 'desarrollo', label: 'Desarrollo', href: '#desarrollo', tag: '01' },
  { id: 'fotografia', label: 'Fotografía', href: '#fotografia', tag: '02' },
  { id: 'contenido',  label: 'Contenido',  href: '#contenido',  tag: '03' },
  { id: 'video',      label: 'Video',      href: '#video',      tag: '04' },
  { id: 'contacto',   label: 'Contacto',   href: '#contacto',   tag: '05' }
];

// Limpieza de URL en el navegador: ocultar index.html y extensiones .html
try {
  if (window.history && window.history.replaceState) {
    const loc = window.location;
    if (loc.pathname.endsWith('index.html')) {
      const cleanUrl = loc.pathname.replace(/index\.html$/, '') || '/';
      window.history.replaceState({}, document.title, cleanUrl + loc.search + loc.hash);
    } else if (loc.pathname.endsWith('.html')) {
      const cleanUrl = loc.pathname.replace(/\.html$/, '');
      window.history.replaceState({}, document.title, cleanUrl + loc.search + loc.hash);
    }
  }
} catch (e) {}

function isIndexPage() {
  const path = window.location.pathname.toLowerCase();
  return path.endsWith('index.html') || path.endsWith('/') || path === '' || !path.includes('.html');
}

/* ---------------- Render Nav ---------------- */
function renderNav() {
  const mount = document.getElementById('site-nav');
  if (!mount) return;

  mount.innerHTML = `
    <div class="nav-wrapper">
      <nav class="nav" id="nav">
        <a href="#inicio" class="nav__brand" data-nav-target="inicio" aria-label="Miguel Bedoya — inicio">
          <span class="nav__brand-name">Miguel Bedoya</span>
        </a>

        <button class="nav__toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav__links" id="nav-links">
          <!-- Píldora Deslizante Plateada -->
          <div class="nav__slider" id="nav-slider"></div>

          ${NAV_ITEMS.map((item) => `
            <li>
              <a href="${item.href}" 
                 class="nav__link ${item.id === 'inicio' ? 'is-active' : ''}" 
                 data-nav-target="${item.id}">
                <span class="nav__link-tag">${item.tag}</span>
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>

        <a href="#contacto" class="nav__cta" data-nav-target="contacto">
          <span>Hablemos</span>
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </div>
  `;

  setupNavSliderAndScroll();
}

/* ---------------- Lógica de la Píldora Deslizante ---------------- */
function setupNavSliderAndScroll() {
  const toggle = document.getElementById('nav-toggle');
  const linksWrap = document.getElementById('nav-links');
  const slider = document.getElementById('nav-slider');
  const allNavLinks = document.querySelectorAll('.nav__link');

  let isNavigating = false;
  let navTimer = null;

  // Función para desplazar la píldora plateada con física fluida hacia la pestaña activa
  function moveSliderTo(linkEl) {
    if (!slider || !linkEl || window.innerWidth <= 920) return;
    const parentRect = linksWrap.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    const targetOffset = linkRect.left - parentRect.left;
    const targetWidth = linkRect.width;

    slider.style.width = `${targetWidth}px`;
    slider.style.transform = `translateX(${targetOffset}px)`;
    slider.classList.add('is-active');
  }

  // Posicionar en el elemento activo inicial
  setTimeout(() => {
    const initialActive = document.querySelector('.nav__link.is-active') || allNavLinks[0];
    if (initialActive) moveSliderTo(initialActive);
  }, 100);

  // Clic instantáneo en cualquier enlace (< 0.22s respuesta con desplazamiento fluido)
  document.querySelectorAll('[data-nav-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-nav-target');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        e.preventDefault();

        // Bloquear ScrollSpy temporalmente para que no sobreescriba el desplazamiento de clic
        isNavigating = true;
        clearTimeout(navTimer);
        navTimer = setTimeout(() => {
          isNavigating = false;
        }, 950);

        // Actualizar active y desplazar la píldora inmediatamente
        allNavLinks.forEach(l => l.classList.remove('is-active'));
        const activeLink = document.querySelector(`.nav__link[data-nav-target="${targetId}"]`);
        if (activeLink) {
          activeLink.classList.add('is-active');
          moveSliderTo(activeLink);
        }

        // Cerrar menú móvil
        if (linksWrap) linksWrap.classList.remove('is-open');
        if (toggle) {
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }

        // Scroll suave hacia la sección
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (history.pushState) {
          history.pushState(null, null, '#' + targetId);
        }
      }
    });
  });

  // Toggle móvil
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

  // Sincronizar al redimensionar
  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav__link.is-active');
    if (currentActive) moveSliderTo(currentActive);
  }, { passive: true });

  // ScrollSpy para mover la píldora mientras el usuario hace scroll manual
  initScrollSpy(moveSliderTo, () => isNavigating);
}

function initScrollSpy(moveSliderTo, getIsNavigating) {
  const sectionIds = ['inicio', 'desarrollo', 'fotografia', 'contenido', 'video', 'contacto'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  let currentActiveId = 'inicio';
  let ticking = false;

  function updateSpy() {
    if (getIsNavigating && getIsNavigating()) {
      ticking = false;
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    // Si llegamos al final de la página, activar contacto
    if (scrollY + windowH >= docH - 80) {
      setActive('contacto');
      ticking = false;
      return;
    }

    // Si estamos en la zona superior (Hero), activar inicio
    if (scrollY < 160) {
      setActive('inicio');
      ticking = false;
      return;
    }

    // Punto de detección: 140px debajo del tope (justo debajo de la barra flotante)
    const focalPoint = scrollY + 140;
    let targetSection = sections[0];

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (sec.offsetTop <= focalPoint) {
        targetSection = sec;
      } else {
        break;
      }
    }

    if (targetSection) {
      setActive(targetSection.id);
    }

    ticking = false;
  }

  function setActive(id) {
    if (currentActiveId === id) return;
    currentActiveId = id;
    const activeLink = document.querySelector(`.nav__link[data-nav-target="${id}"]`);
    if (activeLink) {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('is-active'));
      activeLink.classList.add('is-active');
      if (moveSliderTo) moveSliderTo(activeLink);
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateSpy);
      ticking = true;
    }
  }, { passive: true });

  // Disparo inicial
  updateSpy();
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
            <span style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: #FFFFFF;">${nombre}</span>
          </div>
          <p class="footer__tagline">${PORTFOLIO_DATA.perfil.tagline}</p>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--text-mid); display: flex; align-items: center; gap: 0.5em;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 0 8px #FFFFFF;"></span>
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

/* ---------------- Lightbox Instantáneo con Animación Spring y Despliegue Fluido ---------------- */
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
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.add('is-closing');
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightbox.classList.remove('is-closing');
      imgEl.src = '';
    }, 320);
  };

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });

  document.addEventListener('click', (e) => {
    const target = e.target.closest('.gallery-item, #hero-photo, [data-lightbox]');
    if (target) {
      const img = target.tagName === 'IMG' ? target : target.querySelector('img');
      if (img && img.src) {
        imgEl.src = img.src;
        imgEl.alt = img.alt || 'Vista ampliada';
        lightbox.classList.remove('is-closing', 'is-open');
        document.body.style.overflow = 'hidden';
        void lightbox.offsetWidth; // Forzar reflow para animación visible
        requestAnimationFrame(() => {
          lightbox.classList.add('is-open');
        });
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  initGlobalLightbox();
});
