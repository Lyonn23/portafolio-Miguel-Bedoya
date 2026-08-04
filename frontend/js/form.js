/* ============================================================================
   FORM.JS — Envía el formulario de contacto al backend (Express)
   ----------------------------------------------------------------------------
   Cambia API_URL si despliegas el backend en otra dirección/dominio.
============================================================================ */

const API_URL = (() => {
  const sameOrigin = '/api/contacto';
  const localBackend = 'http://localhost:3000/api/contacto';
  if (window.location.hostname === 'localhost' && window.location.port && window.location.port !== '3000') {
    return localBackend;
  }
  return sameOrigin;
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('[form.js] DOMContentLoaded');
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  // Evita el envío nativo y que otros handlers intercepten el submit
  form.setAttribute('action', 'javascript:void(0)');

  // Capturamos el click en el botón para prevenir cualquier envío nativo inmediato
  if (submitBtn) {
    submitBtn.addEventListener('click', (ev) => {
      // solo registro el clic; no prevenimos el comportamiento por aquí
      console.log('[form.js] submit button clicked');
    });
  }

  form.addEventListener('submit', async (e) => {
    console.log('[form.js] submit handler start');
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    console.log('[form.js] payload:', payload);

    // honeypot anti-spam simple
    if (payload._gotcha) return;

    setStatus('Enviando…', 'pending');
    submitBtn.disabled = true;

    try {
      console.log('[form.js] fetch ->', API_URL);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      console.log('[form.js] fetch response ok=', res.ok, 'status=', res.status, 'data=', data);

      if (res.ok) {
        setStatus('Mensaje enviado. Te responderé pronto.', 'success');
        console.log('[form.js] submit success — no modal configured, resetting form');
        form.reset();
      } else {
        setStatus(data.error || 'Algo salió mal. Intenta de nuevo.', 'error');
      }
    } catch (err) {
      console.error('[form.js] fetch error', err);
      setStatus('No se pudo conectar con el servidor. ¿Está corriendo el backend?', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  function setStatus(message, state) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `form-status is-${state}`;
  }

  // Modal removed: success now shows in the `.form-status` element and resets the form.
});
