/* ============================================================================
   COMPONENTS.JS — Navegación y footer compartidos
   ----------------------------------------------------------------------------
   Editar el menú o el footer UNA sola vez aquí, se refleja en todas las
   páginas. Cada página solo necesita <div id="site-nav"></div> y
   <div id="site-footer"></div> en su HTML.
============================================================================ */

const NAV_LINKS = [
  { href: 'index.html',            label: 'Inicio',    track: 'home' },
  { href: 'desarrollo-web.html',   label: 'Desarrollo', track: 'dev' },
  { href: 'fotografia.html',       label: 'Fotografía', track: 'foto' },
  { href: 'creador-contenido.html',label: 'Contenido',  track: 'content' },
  { href: 'edicion-video.html',    label: 'Video',      track: 'video' },
  { href: 'contacto.html',         label: 'Contacto',   track: 'contacto' }
];

function currentTrack() {
  return document.body.getAttribute('data-track') || 'home';
}

function renderNav() {
  const mount = document.getElementById('site-nav');
  if (!mount) return;
  const active = currentTrack();
  const { nombre, inicial } = PORTFOLIO_DATA.perfil;

  mount.innerHTML = `
    <nav class="nav" id="nav">
      <a href="index.html" class="nav__brand" aria-label="${nombre} — inicio">
        <span class="nav__brand-mark">${inicial}</span>
        <span class="nav__brand-name">${nombre}</span>
      </a>

      <button class="nav__toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav__links" id="nav-links">
        ${NAV_LINKS.map(link => `
          <li>
            <a href="${link.href}" class="nav__link ${link.track === active ? 'is-active' : ''}">
              <span class="nav__link-tag">${link.track === 'home' ? '~' : link.track}</span>
              ${link.label}
            </a>
          </li>
        `).join('')}
      </ul>
    </nav>
  `;

  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.classList.toggle('is-open');
  });
}

function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const { nombre, email } = PORTFOLIO_DATA.perfil;
  const year = new Date().getFullYear();

  mount.innerHTML = `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__col">
          <span class="nav__brand-mark">${PORTFOLIO_DATA.perfil.inicial}</span>
          <p class="footer__tagline">${PORTFOLIO_DATA.perfil.tagline}</p>
        </div>

        <div class="footer__col">
          <span class="footer__label">Navegación</span>
          <ul class="footer__list">
            ${NAV_LINKS.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
          </ul>
        </div>

        <div class="footer__col">
          <span class="footer__label">Conecta</span>
          <ul class="footer__list">
            ${PORTFOLIO_DATA.redes.map(r => `<li><a href="${r.url}" target="_blank" rel="noopener">${r.nombre}</a></li>`).join('')}
            <li><a href="mailto:${email}">${email}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© ${year} Miguel Bedoya. Todos los derechos reservados.</span>
        <span class="footer__made">Diseñado &amp; construido a mano.</span>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
});
