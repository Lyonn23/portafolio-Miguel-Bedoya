# Portafolio — Guía rápida

Sitio de portafolio multi-página para desarrollador web / fotógrafo / creador
de contenido / editor de video. Fondo negro, acentos blancos "neón",
partículas animadas y transiciones al hacer scroll.

## Estructura de carpetas

```
portafolio/
├── frontend/                  ← todo lo que ve el usuario
│   ├── index.html              (Inicio)
│   ├── desarrollo-web.html
│   ├── fotografia.html
│   ├── creador-contenido.html
│   ├── edicion-video.html
│   ├── contacto.html
│   ├── css/
│   │   ├── variables.css       (colores, fuentes, espaciados — EDITA AQUÍ el estilo global)
│   │   ├── base.css            (reset y fundamentos)
│   │   ├── nav.css             (barra de navegación)
│   │   ├── hero.css            (portada + selector de disciplinas)
│   │   ├── components.css      (tarjetas, galería, footer, formulario)
│   │   └── animations.css      (keyframes y animaciones de scroll)
│   ├── js/
│   │   ├── data.js             (TODO tu contenido: texto, proyectos, fotos — EDITA AQUÍ)
│   │   ├── components.js       (genera el menú y el footer en todas las páginas)
│   │   ├── render.js           (pinta el contenido de data.js en el HTML)
│   │   ├── particles.js        (fondo de partículas animado)
│   │   ├── main.js             (animaciones de scroll, texto rotativo, menú móvil)
│   │   └── form.js             (envío del formulario de contacto al backend)
│   └── assets/                 (tus imágenes van aquí)
└── backend/                    ← servidor para el formulario de contacto
    ├── server.js
    ├── package.json
    └── .env.example
```

## Cómo editar tu contenido (sin tocar el diseño)

Todo tu texto e información vive en **`frontend/js/data.js`**:

- `perfil` → tu nombre, biografía, roles que rotan en el hero, contacto.
- `redes` → tus redes sociales.
- `desarrollo` → intro, stack de tecnologías y proyectos de desarrollo web.
- `fotografia` → intro, equipo y galería de fotos.
- `contenido` → intro, plataformas y piezas de contenido.
- `video` → intro, herramientas y proyectos de video.

Solo cambia el texto entre comillas `' '`. Para agregar un proyecto más,
copia un bloque `{ ... }` existente dentro de su lista y pégalo debajo,
separado por una coma.

Para cambiar tus imágenes, reemplaza los archivos dentro de
`frontend/assets/` manteniendo el mismo nombre, o cambia la ruta en
`data.js` por la URL de la imagen que quieras usar.

## Cómo editar el estilo (colores, fuentes, tamaños)

Abre **`frontend/css/variables.css`**. Ahí están todos los "tokens" de diseño:

- `--bg-void`, `--bg-surface` → tonos de negro de fondo.
- `--neon`, `--neon-glow-*` → el blanco neón y sus resplandores.
- `--font-display`, `--font-body`, `--font-mono` → las tres fuentes usadas.
- `--fs-*` → tamaños de texto.
- `--space-*` → espaciados.

Cambiar un valor aquí actualiza automáticamente todas las páginas.

## Cómo ver el sitio en tu computador

No necesitas instalar nada para ver el **frontend**: abre `frontend/index.html`
directamente en tu navegador, o mejor, sirve la carpeta con un servidor local
simple para que todo funcione perfecto (rutas, fetch, etc.):

```bash
cd frontend
python3 -m http.server 5500
# abre http://localhost:5500
```

## Cómo activar el formulario de contacto (backend + email a tu correo)

El formulario de la página de Contacto necesita el backend corriendo:

```bash
cd backend
npm install
npm start
```

Esto levanta un servidor en `http://localhost:3000`. Cada mensaje se
guarda siempre en `backend/mensajes.json`, y además, si configuras el
email, te llega directo a **bedoyaleon231@gmail.com**.

Para activar el envío de email:

1. Copia `backend/.env.example` como `backend/.env`.
2. Activa la verificación en 2 pasos en la cuenta de Gmail que va a enviar
   el correo: https://myaccount.google.com/security
3. Genera una "contraseña de aplicación" aquí:
   https://myaccount.google.com/apppasswords (elige app "Correo").
4. Pega ese código de 16 letras en `GMAIL_APP_PASSWORD` dentro de `.env`,
   y el correo que lo envía en `GMAIL_USER`.
5. `CONTACT_TO` ya viene configurado a tu correo (`bedoyaleon231@gmail.com`).

Sin este paso, el sitio sigue funcionando y guardando los mensajes en
`mensajes.json` — solo que no te llegará el email hasta que configures
la contraseña de aplicación.

Si despliegas el backend en otro lugar (Render, Railway, etc.), recuerda
actualizar `API_URL` en `frontend/js/form.js` con la URL real, y configurar
las mismas variables de entorno allá.

## GitHub en la sección de Desarrollo Web

En `frontend/js/data.js`, dentro de `desarrollo.github`, escribe tu
usuario real de GitHub (por ejemplo `"octocat"`, sin @ ni URL completa).
La página trae tu foto, bio, seguidores y tus 4 repositorios con más
estrellas automáticamente — no necesitas backend para esto, usa la API
pública de GitHub.

## Tu foto en el inicio

Reemplaza `frontend/assets/perfil.jpg` por tu foto real (mismo nombre, o
cambia la ruta en `perfil.foto` dentro de `data.js`). Ya viene con el
efecto de "camuflaje": blanco y negro, bordes disueltos hacia el fondo, y
una capa de partículas encima que la integra con el resto del sitio. Si
quieres que se note más o menos, ajusta en `frontend/css/hero.css`:

- `.hero__photo { opacity: ... }` → qué tan visible es.
- `mask-image: radial-gradient(...)` → qué tanto se disuelven los bordes.

## Publicar el sitio (frontend)
 
El frontend es HTML/CSS/JS puro, así que puedes subirlo gratis a:
 
- **GitHub Pages**: sube la carpeta `frontend/` a un repositorio y activa Pages.
- **Netlify / Vercel**: arrastra la carpeta `frontend/` a su panel — despliegue instantáneo.
 
### Despliegue completo en Vercel

Este repositorio ya incluye un archivo `vercel.json` y una API de Vercel en
`api/` para que el formulario de contacto funcione en el mismo despliegue.

1. Conecta tu repositorio a Vercel.
2. Si quieres recibir los mensajes por correo, configura estas variables de
   entorno en Vercel:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `CONTACT_TO` (opcional, por defecto usa `beleonnm@gmail.com`)
3. Despliega el proyecto. El frontend estará servido desde `frontend/` y el
   endpoint del formulario estará disponible en `/api/contacto`.

> Nota: Vercel no conserva archivos locales como `backend/mensajes.json`
> entre invocaciones. Por eso el envío de mensajes en Vercel depende del correo
> electrónico. Si deseas almacenamiento permanente, usa un backend con base de
> datos o un servicio especializado.
 
Para el backend local (si quieres probar el formulario en tu máquina),
usa un servicio como Render o Railway, que soportan Node.js/Express gratis
en su plan básico.

## Notas de accesibilidad y rendimiento ya incluidas

- Respeta `prefers-reduced-motion`: si el usuario desactiva animaciones en
  su sistema, el sitio elimina automáticamente las animaciones.
- Foco de teclado visible en todos los enlaces, botones y campos.
- Imágenes con `loading="lazy"`.
- Formulario con honeypot anti-spam básico.
