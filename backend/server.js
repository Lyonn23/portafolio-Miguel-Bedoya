/* ============================================================================
   SERVER.JS — Backend mínimo para el formulario de contacto
   ----------------------------------------------------------------------------
   Qué hace:
   1. Recibe los datos del formulario en POST /api/contacto
   2. Valida los campos
   3. Guarda cada mensaje en backend/mensajes.json (para que no dependas
      de un servicio de correo externo desde el día uno)
   4. Si configuras las variables de entorno de correo (.env), además
      te envía un email con el mensaje

   Cómo correrlo:
     cd backend
     npm install
     npm start
   El servidor queda escuchando en http://localhost:3000
============================================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'mensajes.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // sirve el sitio también desde aquí si quieres

/* ---------------- Utilidades ---------------- */
function readMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveMessage(msg) {
  const messages = readMessages();
  messages.push(msg);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------------- Rutas ---------------- */

// Salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Recibir mensaje de contacto
app.post('/api/contacto', (req, res) => {
  const { nombre, email, proyecto, mensaje, whatsapp, _gotcha } = req.body;

  // honeypot: si el campo oculto viene lleno, es un bot -> respondemos ok y no hacemos nada
  if (_gotcha) {
    return res.json({ ok: true });
  }

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'El email no es válido.' });
  }

  const entry = {
    nombre: String(nombre).slice(0, 200),
    email: String(email).slice(0, 200),
    proyecto: String(proyecto || '').slice(0, 200),
    whatsapp: String(whatsapp || '').slice(0, 100),
    mensaje: String(mensaje).slice(0, 5000),
    fecha: new Date().toISOString()
  };

  try {
    saveMessage(entry);
  } catch (err) {
    console.error('Error guardando mensaje:', err);
    return res.status(500).json({ error: 'No se pudo guardar el mensaje. Intenta de nuevo.' });
  }

  // Envío de email real — se activa en cuanto configures GMAIL_USER y
  // GMAIL_APP_PASSWORD en el archivo .env (ver .env.example)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    enviarEmailNotificacion(entry).catch(err => console.error('Error enviando email:', err));
  } else {
    console.warn('⚠️  Email no configurado: agrega GMAIL_USER y GMAIL_APP_PASSWORD en backend/.env');
  }

  res.json({ ok: true, message: 'Mensaje recibido correctamente.' });
});

// Listar mensajes recibidos (protégelo o quítalo antes de producción real)
app.get('/api/mensajes', (req, res) => {
  res.json(readMessages());
});

/* ---------------- Email real vía Gmail (nodemailer) ----------------
   Requiere en backend/.env:
     GMAIL_USER=tu_correo_que_envia@gmail.com
     GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx   (contraseña de aplicación, NO tu contraseña normal)
     CONTACT_TO=beleonnm@gmail.com    (a dónde llega el mensaje — ya viene por defecto)
-------------------------------------------------------------------- */
async function enviarEmailNotificacion(entry) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const fechaLocal = new Date(entry.fecha).toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const subject = `📩 Nueva solicitud de contacto — ${entry.nombre}`;
  const proyecto = entry.proyecto || '(no especificado)';
  const whatsapp = entry.whatsapp || '(no especificado)';
  const mensajeHtml = escapeHtml(String(entry.mensaje)).replace(/\n/g, '<br>');

  await transporter.sendMail({
    from: `"Miguel Bedoya — Portafolio" <${process.env.GMAIL_USER}>`,
    to: process.env.CONTACT_TO || 'beleonnm@gmail.com',
    replyTo: entry.email,
    subject,
    text: [
      `Nombre: ${entry.nombre}`,
      `Email: ${entry.email}`,
      `WhatsApp: ${whatsapp}`,
      `Tipo de proyecto: ${proyecto}`,
      `Fecha: ${fechaLocal}`,
      '',
      'Mensaje:',
      entry.mensaje
    ].join('\n'),
    html: `
      <div style="margin:0;padding:24px;background:#070707;font-family:Arial,Helvetica,sans-serif;color:#f3f4f6;">
        <div style="max-width:680px;margin:0 auto;border:1px solid #2f2f2f;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#09111a,#10141d 60%,#08110f);box-shadow:0 0 20px rgba(92,255,203,0.08);">
          <div style="padding:18px 24px;border-bottom:1px solid #2f2f2f;background:rgba(92,255,203,0.08);">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <span style="padding:4px 10px;border-radius:999px;background:#5cffcb;color:#07110d;font-size:12px;font-weight:700;letter-spacing:0.08em;">PORTAFOLIO</span>
              <span style="font-size:12px;color:#9c9f9d;letter-spacing:0.12em;text-transform:uppercase;">Nueva solicitud</span>
            </div>
            <h2 style="margin:14px 0 6px;font-size:24px;color:#ffffff;">📩 Mensaje nuevo desde tu sitio</h2>
            <p style="margin:0;color:#c9d0c9;">Has recibido una nueva propuesta de contacto con todos los datos del formulario.</p>
          </div>

          <div style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#9c9f9d;font-weight:700;width:160px;">Nombre</td>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#ffffff;">${escapeHtml(entry.nombre)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#9c9f9d;font-weight:700;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#ffffff;">${escapeHtml(entry.email)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#9c9f9d;font-weight:700;">WhatsApp</td>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#ffffff;">${escapeHtml(whatsapp)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#9c9f9d;font-weight:700;">Tipo de proyecto</td>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#ffffff;">${escapeHtml(proyecto)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#9c9f9d;font-weight:700;">Fecha</td>
                <td style="padding:10px 0;border-bottom:1px solid #232323;color:#ffffff;">${escapeHtml(fechaLocal)}</td>
              </tr>
            </table>

            <div style="margin-top:22px;padding:18px;border:1px solid #2f2f2f;border-radius:12px;background:rgba(255,255,255,0.02);">
              <div style="margin-bottom:10px;color:#5cffcb;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Mensaje</div>
              <div style="color:#f3f4f6;line-height:1.7;">${mensajeHtml}</div>
            </div>

            <div style="margin-top:22px;color:#8f928e;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
              Responde directamente a este correo o usa la opción Reply To del mensaje.
            </div>
          </div>
        </div>
      </div>
    `
  });
}

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
