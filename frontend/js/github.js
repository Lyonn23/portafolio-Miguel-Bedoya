/* ============================================================================
   GITHUB.JS — Trae y muestra tu perfil real de GitHub (API pública, sin token)
   ----------------------------------------------------------------------------
   Usa el usuario definido en data.js → desarrollo.github
   No necesitas backend para esto: la API pública de GitHub permite
   consultas anónimas (con un límite generoso de peticiones por hora).
============================================================================ */

document.addEventListener('DOMContentLoaded', renderGithubCard);

async function renderGithubCard() {
  const mount = document.getElementById('github-card');
  if (!mount || typeof PORTFOLIO_DATA === 'undefined') return;

  const username = PORTFOLIO_DATA.desarrollo.github;
  const normalizedUsername = username?.trim().toLowerCase();

  if (!normalizedUsername || normalizedUsername === 'tuusuario' || normalizedUsername === 'your-github-user') {
    mount.innerHTML = githubFallback(
      'Agrega tu usuario de GitHub',
      'Edita <code>desarrollo.github</code> en <code>data.js</code> con tu usuario real para mostrar tu perfil aquí en vivo.'
    );
    return;
  }

  mount.innerHTML = githubSkeleton();

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
    ]);

    if (!userRes.ok) throw new Error('Usuario no encontrado');

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4);

    mount.innerHTML = `
      <div class="gh-card" data-reveal>
        <div class="gh-card__profile">
          <img class="gh-card__avatar" src="${user.avatar_url}" alt="Foto de perfil de GitHub de ${user.login}" loading="lazy">
          <div class="gh-card__info">
            <h3 class="gh-card__name">${user.name || user.login}</h3>
            <span class="gh-card__handle">@${user.login}</span>
            ${user.bio ? `<p class="gh-card__bio">${escapeHtml(user.bio)}</p>` : ''}
            <div class="gh-card__stats">
              <span><strong>${user.public_repos ?? 0}</strong> repos</span>
              <span><strong>${user.followers ?? 0}</strong> seguidores</span>
              <span><strong>${user.following ?? 0}</strong> siguiendo</span>
            </div>
            <a class="btn" href="${user.html_url}" target="_blank" rel="noopener">Ver perfil completo en GitHub →</a>
          </div>
        </div>

        ${topRepos.length ? `
          <ul class="gh-repos">
            ${topRepos.map(r => `
              <li class="gh-repo">
                <a href="${r.html_url}" target="_blank" rel="noopener">
                  <span class="gh-repo__name">${r.name}</span>
                  <span class="gh-repo__desc">${r.description ? escapeHtml(r.description) : 'Sin descripción'}</span>
                  <span class="gh-repo__meta">
                    ${r.language ? `<span class="gh-repo__lang">${r.language}</span>` : ''}
                    <span>★ ${r.stargazers_count}</span>
                  </span>
                </a>
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    `;

    // dispara el reveal si main.js ya montó el observer antes de que esto cargara
    const el = mount.querySelector('[data-reveal]');
    if (el) requestAnimationFrame(() => el.classList.add('is-visible'));

  } catch (err) {
    mount.innerHTML = githubFallback(
      'No se pudo cargar el perfil de GitHub',
      `Puede que el usuario "${username}" no exista o se alcanzó el límite de peticiones públicas de la API. Visítalo directamente:`,
      `https://github.com/${username}`
    );
  }
}

function githubSkeleton() {
  return `
    <div class="gh-card gh-card--loading">
      <div class="gh-skeleton gh-skeleton--avatar"></div>
      <div class="gh-skeleton gh-skeleton--line" style="width: 40%;"></div>
      <div class="gh-skeleton gh-skeleton--line" style="width: 70%;"></div>
    </div>
  `;
}

function githubFallback(title, text, link) {
  return `
    <div class="gh-card gh-card--fallback">
      <h3 class="card__title">${title}</h3>
      <p class="card__desc">${text}</p>
      ${link ? `<a class="btn" href="${link}" target="_blank" rel="noopener">Ir a GitHub →</a>` : ''}
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
