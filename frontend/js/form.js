/* ============================================================================
   FORM.JS — Envío directo y funcional a beleonnm@gmail.com con diseño y fallbacks
============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  let statusTimeout = null;

  // Si se redirigió tras envío exitoso
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('enviado') === '1') {
    setStatus('✓ ¡Propuesta de proyecto enviada con éxito a beleonnm@gmail.com! Te responderé en breve.', 'success');
    // Limpiar inmediatamente el parámetro de la URL para que no persista al recargar la página
    try {
      if (window.history && window.history.replaceState) {
        const cleanPath = window.location.pathname.replace(/index\.html$/, '') || '/';
        window.history.replaceState({}, document.title, cleanPath + window.location.hash);
      }
    } catch (e) {}
  }

  form.addEventListener('submit', async (e) => {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // honeypot anti-spam
    if (payload._gotcha) {
      e.preventDefault();
      return;
    }

    if (!payload.nombre || !payload.email || !payload.mensaje) {
      e.preventDefault();
      setStatus('Por favor completa tu nombre, correo y mensaje.', 'error');
      return;
    }

    // Asunto personalizado solicitado: "Propuesta de proyecto"
    const subjectTitle = `Propuesta de proyecto — ${payload.nombre} (${payload.proyecto || 'General'})`;
    const subjectInput = document.getElementById('form-subject');
    if (subjectInput) subjectInput.value = subjectTitle;

    const nextInput = document.getElementById('form-next');
    if (nextInput) {
      const currentUrl = window.location.href.split('?')[0].split('#')[0];
      nextInput.value = `${currentUrl}?enviado=1#contacto`;
    }

    // Si se prueba en local como archivo (file:///), enviar vía POST directo HTML para evitar bloqueos CORS
    if (window.location.protocol === 'file:') {
      setStatus('Enviando propuesta de proyecto a beleonnm@gmail.com…', 'pending');
      return;
    }

    e.preventDefault();
    setStatus('Enviando propuesta de proyecto a beleonnm@gmail.com…', 'pending');

    let originalText = 'Enviar Mensaje';
    if (submitBtn) {
      originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando…</span>`;
    }

    const emailPayload = {
      name: payload.nombre,
      email: payload.email,
      whatsapp: payload.whatsapp || 'No especificado',
      proyecto: payload.proyecto || 'General',
      message: payload.mensaje,
      _subject: subjectTitle,
      _replyto: payload.email,
      _captcha: 'false',
      _template: 'table',
      _autoresponse: `Hola ${payload.nombre}, he recibido tu propuesta de proyecto correctamente. Revisaré los detalles y me pondré en contacto contigo a la brevedad.`
    };

    let sent = false;

    // 1. Si el backend local está corriendo en localhost:3000, enviar directo con Nodemailer Gmail
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      try {
        const localRes = await fetch('http://localhost:3000/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (localRes.ok) {
          const localData = await localRes.json();
          if (localData.ok) {
            sent = true;
          }
        }
      } catch {
        // Backend local no disponible en este momento
      }
    }

    // 2. Si no, enviar vía Cloudflare Pages Function /api/contacto
    if (!sent) {
      try {
        const cfRes = await fetch('/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (cfRes.ok) {
          const cfData = await cfRes.json();
          if (cfData.ok) sent = true;
        }
      } catch {
        // Fallback a FormSubmit
      }
    }

    // 3. Si no, enviar directamente a FormSubmit con diseño de tabla
    if (!sent) {
      try {
        const fsRes = await fetch('https://formsubmit.co/ajax/beleonnm@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });

        if (fsRes.ok) {
          const fsData = await fsRes.json();
          if (fsData.success === 'true' || fsData.success === true) {
            sent = true;
          } else if (fsData.message && fsData.message.toLowerCase().includes('activate')) {
            setStatus(`
              <strong>⚠️ Activación requerida por FormSubmit (Paso único):</strong><br>
              FormSubmit te ha enviado un enlace a <strong>beleonnm@gmail.com</strong>.
              Ábrelo y presiona <em>"Activate Form"</em> (revisa también Spam/Promociones).
              Una vez activado, todas las propuestas llegarán a tu bandeja automáticamente.
            `, 'pending');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
            return;
          }
        }
      } catch (err) {
        console.warn('[form.js] Error al conectar con FormSubmit:', err);
      }
    }

    if (sent) {
      setStatus('✓ ¡Propuesta de proyecto enviada con éxito a beleonnm@gmail.com! Te responderé en breve.', 'success');
      form.reset();
    } else {
      // En caso de restricciones de red, fallback con submit nativo o botones directos
      try {
        form.submit();
        return;
      } catch (submitErr) {
        const mailtoUrl = `mailto:beleonnm@gmail.com?subject=${encodeURIComponent(subjectTitle)}&body=${encodeURIComponent(`Nombre: ${payload.nombre}\nEmail: ${payload.email}\nWhatsApp: ${payload.whatsapp || ''}\nProyecto: ${payload.proyecto || ''}\n\nMensaje:\n${payload.mensaje}`)}`;
        const waUrl = `https://wa.me/573102099975?text=${encodeURIComponent(`Hola Miguel, soy ${payload.nombre}. Te escribo sobre una propuesta de proyecto (${payload.proyecto || 'General'}): ${payload.mensaje}`)}`;

        setStatus(`
          No se pudo conectar al servidor de correo. Puedes enviar tu propuesta con un solo clic:
          <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="${mailtoUrl}" class="chip" style="text-decoration: none; color: #FFFFFF; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.35);">✉ Abrir en Correo</a>
            <a href="${waUrl}" target="_blank" rel="noopener" class="chip" style="text-decoration: none; color: #000000; background: #FFFFFF; font-weight: 700;">💬 Abrir en WhatsApp</a>
          </div>
        `, 'error');
      }
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  function setStatus(message, state) {
    if (!statusEl) return;
    statusEl.style.transition = 'opacity 0.35s ease';
    statusEl.style.opacity = '1';
    statusEl.innerHTML = message;
    statusEl.className = `form-status ${state} is-${state}`;

    if (statusTimeout) clearTimeout(statusTimeout);
    // Si es éxito, auto-ocultar suavemente tras 6 segundos para que no se quede ahí siempre
    if (state === 'success') {
      statusTimeout = setTimeout(() => {
        clearStatus();
      }, 6000);
    }
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.style.transition = 'opacity 0.4s ease';
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.innerHTML = '';
      statusEl.className = 'form-status';
      statusEl.style.opacity = '1';
    }, 400);
  }
});
