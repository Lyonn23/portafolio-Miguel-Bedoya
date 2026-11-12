/* ============================================================================
   FORM.JS — Envío del formulario de contacto & Fallback Inteligente
============================================================================ */

const API_URL = (() => {
  const sameOrigin = '/api/contacto';
  const localBackend = 'http://localhost:3000/api/contacto';
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port && window.location.port !== '3000') {
    return localBackend;
  }
  return sameOrigin;
})();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // honeypot anti-spam
    if (payload._gotcha) return;

    setStatus('Enviando mensaje…', 'pending');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('✓ ¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
        form.reset();
      } else {
        setStatus(data.error || 'Algo salió mal. Intenta de nuevo o contáctame por WhatsApp.', 'error');
      }
    } catch (err) {
      console.warn('[form.js] Fallback a WhatsApp/Email:', err);
      const waUrl = `https://wa.me/573102099975?text=${encodeURIComponent(`Hola Miguel, soy ${payload.nombre || 'alguien interesado'}. Mi proyecto: ${payload.proyecto || ''}. Mensaje: ${payload.mensaje || ''}`)}`;
      setStatus(`Mensaje listo. Si el backend está inactivo, <a href="${waUrl}" target="_blank" rel="noopener" style="color:#ff4d6d; text-decoration:underline;">haz clic aquí para enviarlo por WhatsApp</a>.`, 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  function setStatus(message, state) {
    if (!statusEl) return;
    statusEl.innerHTML = message;
    statusEl.className = `form-status ${state} is-${state}`;
  }
});
