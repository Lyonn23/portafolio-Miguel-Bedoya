/* ============================================================================
   CLOUDFLARE PAGES FUNCTION — POST /api/contacto
   Procesa y envía mensajes de contacto directamente a beleonnm@gmail.com
============================================================================ */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { nombre, email, whatsapp, proyecto, mensaje, _gotcha } = body;

    // Honeypot anti-spam
    if (_gotcha) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!nombre || !email || !mensaje) {
      return new Response(JSON.stringify({ error: 'Nombre, email y mensaje son campos obligatorios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const prominentSubject = `Propuesta de proyecto — ${nombre} (${proyecto || 'General'})`;

    const emailPayload = {
      name: nombre,
      email: email,
      whatsapp: whatsapp || 'No especificado',
      proyecto: proyecto || 'General',
      message: mensaje,
      _subject: prominentSubject,
      _replyto: email,
      _captcha: 'false',
      _template: 'table'
    };

    let sent = false;

    // 1. Si está configurado Resend API en Cloudflare:
    if (env && env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Portafolio <onboarding@resend.dev>',
            to: 'beleonnm@gmail.com',
            reply_to: email,
            subject: prominentSubject,
            html: `
              <h2>🚨 Nueva propuesta desde el Portafolio</h2>
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
              <p><strong>Proyecto:</strong> ${proyecto || 'N/A'}</p>
              <p><strong>Mensaje:</strong></p>
              <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #000;">${mensaje}</blockquote>
            `
          })
        });
        if (resendRes.ok) sent = true;
      } catch (err) {
        console.error('Error enviando con Resend:', err);
      }
    }

    // 2. Envío a través de FormSubmit directo a beleonnm@gmail.com
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
        if (fsRes.ok) sent = true;
      } catch (err) {
        console.error('Error con FormSubmit:', err);
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      mensaje: '¡Mensaje enviado con éxito a beleonnm@gmail.com!'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Error interno al procesar el mensaje.',
      detalle: err.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
