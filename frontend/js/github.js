/* ============================================================================
   GITHUB.JS — Tarjeta Centrada & Telemetría en Vivo de GitHub
   Sin textos de "Sin descripción", centrado, con datos reales de actividad,
   repositorios ordenados, badges de lenguaje y métricas reales de @Lyonn23.
============================================================================ */

document.addEventListener('DOMContentLoaded', renderGithubCard);

async function renderGithubCard() {
  const mount = document.getElementById('github-card');
  if (!mount || typeof PORTFOLIO_DATA === 'undefined') return;

  const username = PORTFOLIO_DATA.desarrollo.github || 'Lyonn23';

  mount.innerHTML = githubSkeleton();

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`).catch(() => null),
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`).catch(() => null),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=5`).catch(() => null)
    ]);

    let user = null;
    let repos = [];
    let latestActivity = null;

    if (userRes && userRes.ok) {
      user = await userRes.json();
    } else {
      // Fallback con datos reales de Miguel
      user = {
        login: username,
        name: 'Miguel Bedoya',
        avatar_url: 'https://avatars.githubusercontent.com/u/105307303?v=4',
        html_url: `https://github.com/${username}`,
        bio: 'Desarrollador Web & Creador Audiovisual // Creative Suite',
        public_repos: 3,
        followers: 0,
        following: 1
      };
    }

    if (reposRes && reposRes.ok) {
      repos = await reposRes.json();
    } else {
      // Repositorios reales de Lyonn23
      repos = [
        {
          name: 'portafolio-Miguel-Bedoya',
          html_url: `https://github.com/${username}/portafolio-Miguel-Bedoya`,
          description: null,
          language: 'JavaScript',
          stargazers_count: 0,
          forks_count: 0,
          pushed_at: new Date().toISOString()
        },
        {
          name: 'EDEN',
          html_url: `https://github.com/${username}/EDEN`,
          description: null,
          language: 'Web Stack',
          stargazers_count: 0,
          forks_count: 0,
          pushed_at: new Date().toISOString()
        },
        {
          name: 'Lyonn23',
          html_url: `https://github.com/${username}/Lyonn23`,
          description: null,
          language: 'Config / Readme',
          stargazers_count: 0,
          forks_count: 0,
          pushed_at: new Date().toISOString()
        }
      ];
    }

    // Calcular actividad reciente
    if (eventsRes && eventsRes.ok) {
      try {
        const events = await eventsRes.json();
        if (Array.isArray(events) && events.length > 0) {
          const pushEvent = events.find(e => e.type === 'PushEvent') || events[0];
          if (pushEvent) {
            const repoName = pushEvent.repo?.name?.split('/')[1] || pushEvent.repo?.name;
            const dateStr = formatTimeAgo(new Date(pushEvent.created_at));
            latestActivity = `Actividad reciente en <strong>${repoName}</strong> (${dateStr})`;
          }
        }
      } catch (e) {
        // Ignorar error de parsing de eventos
      }
    }

    if (!latestActivity && repos.length > 0 && repos[0].pushed_at) {
      const topRepo = repos[0];
      const dateStr = formatTimeAgo(new Date(topRepo.pushed_at));
      latestActivity = `Último push en <strong>${topRepo.name}</strong> (${dateStr})`;
    }

    // Filtrar hasta 4 repositorios destacados
    const displayRepos = repos.slice(0, 4);

    mount.innerHTML = `
      <div class="gh-card gh-card--centered" data-reveal>
        <div class="gh-card__profile">
          <div class="gh-card__avatar-wrap">
            <img class="gh-card__avatar" src="${user.avatar_url}" alt="Foto de perfil de GitHub de ${user.login}" loading="lazy">
            <span class="gh-card__online-dot" title="Perfil verificado"></span>
          </div>

          <div class="gh-card__info">
            <h3 class="gh-card__name">${user.name || user.login}</h3>
            <a class="gh-card__handle" href="${user.html_url}" target="_blank" rel="noopener">@${user.login} ↗</a>
            
            ${user.bio ? `<p class="gh-card__bio">${escapeHtml(user.bio)}</p>` : ''}

            <!-- Telemetría en Vivo de Métricas -->
            <div class="gh-card__stats">
              <div class="gh-stat-pill">
                <span class="gh-stat-num">${user.public_repos ?? 3}</span>
                <span class="gh-stat-lbl">Repositorios</span>
              </div>
              <div class="gh-stat-pill">
                <span class="gh-stat-num">${user.followers ?? 0}</span>
                <span class="gh-stat-lbl">Seguidores</span>
              </div>
              <div class="gh-stat-pill">
                <span class="gh-stat-num">${user.following ?? 1}</span>
                <span class="gh-stat-lbl">Siguiendo</span>
              </div>
            </div>

            ${latestActivity ? `
              <div class="gh-card__activity">
                <span class="gh-activity-pulse"></span>
                <span>${latestActivity}</span>
              </div>
            ` : ''}

            <a class="btn btn--solid" href="${user.html_url}" target="_blank" rel="noopener" style="font-size: 13px; padding: 0.65rem 1.4rem;">
              <span>Ver perfil completo en GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <!-- Cuadrícula Centrada de Repositorios Limpios (Sin "Sin descripción") -->
        <div class="gh-repos-grid">
          ${displayRepos.map(r => `
            <a class="gh-repo-item" href="${r.html_url}" target="_blank" rel="noopener">
              <div class="gh-repo-header">
                <span class="gh-repo-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </span>
                <h4 class="gh-repo-name">${r.name}</h4>
              </div>

              ${r.description ? `
                <p class="gh-repo-desc">${escapeHtml(r.description)}</p>
              ` : `
                <div class="gh-repo-meta-bar">
                  <span class="gh-meta-pill">Código activo</span>
                  <span class="gh-meta-pill">Rama main</span>
                </div>
              `}

              <div class="gh-repo-footer">
                ${r.language ? `
                  <span class="gh-repo-lang">
                    <span class="gh-lang-dot"></span>
                    ${r.language}
                  </span>
                ` : '<span class="gh-repo-lang"><span class="gh-lang-dot"></span>General</span>'}

                <div class="gh-repo-counts">
                  <span>★ ${r.stargazers_count ?? 0}</span>
                  ${r.forks_count ? `<span>⑂ ${r.forks_count}</span>` : ''}
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    const el = mount.querySelector('[data-reveal]');
    if (el) requestAnimationFrame(() => el.classList.add('is-visible'));

  } catch (err) {
    mount.innerHTML = `
      <div class="gh-card gh-card--centered">
        <div class="gh-card__profile">
          <h3 class="gh-card__name">Miguel Bedoya</h3>
          <a class="gh-card__handle" href="https://github.com/Lyonn23" target="_blank" rel="noopener">@Lyonn23 ↗</a>
          <p class="gh-card__bio">Explora los repositorios y proyectos de código abierto directamente en GitHub.</p>
          <a class="btn btn--solid" href="https://github.com/Lyonn23" target="_blank" rel="noopener">Abrir GitHub @Lyonn23 ↗</a>
        </div>
      </div>
    `;
  }
}

function formatTimeAgo(date) {
  if (isNaN(date.getTime())) return 'recientemente';
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 3600) return 'hace un momento';
  const hours = Math.floor(seconds / 3600);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  return `hace ${Math.floor(days / 30)} meses`;
}

function githubSkeleton() {
  return `
    <div class="gh-card gh-card--centered gh-card--loading">
      <div class="gh-skeleton gh-skeleton--avatar" style="margin: 0 auto;"></div>
      <div class="gh-skeleton gh-skeleton--line" style="width: 35%; margin: 1rem auto 0.5rem auto;"></div>
      <div class="gh-skeleton gh-skeleton--line" style="width: 60%; margin: 0 auto;"></div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}
