/* ============================================================================
   DATA.JS — Panel de contenido del portafolio
   ----------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cambiar el contenido
   del sitio: tu nombre, biografía, proyectos, fotos, videos, redes, etc.
   No requiere saber programar: solo cambia el texto entre comillas.

   Reglas rápidas:
   - No borres las comas "," entre líneas.
   - No borres las comillas ' ' que rodean cada texto.
   - Las imágenes van en /frontend/assets/ (reemplaza los archivos placeholder
     o cambia la ruta aquí por una URL externa).
============================================================================ */

const PORTFOLIO_DATA = {

  /* ---------------- IDENTIDAD ---------------- */
  perfil: {
    nombre: "Miguel Bedoya",
    inicial: "MB",                       // se usa como logo en la nav
    tagline: "Construyo, edito y cuento historias.",
    roles: [
      "Desarrollador Web",
      "Fotógrafo",
      "Creador de Contenido",
      "Editor de Video"
    ],
    ubicacion: "Armenia, Quindío, Colombia",
    disponible: true,                    // true = muestra badge "Disponible para proyectos"
    bio: "Soy un creador multidisciplinario que combina código, cámara y edición para construir historias visuales completas — desde una interfaz web hasta el corte final de un video. Me obsesiona el detalle: el pixel exacto, el encuadre exacto, el frame exacto.",
    email: "beleonnm@gmail.com",
    telefono: "+57 310 209 9975",
    whatsapp: "573102099975",            // formato internacional sin "+" ni espacios, para el link de WhatsApp
    foto: "assets/perfil.jpg",           // reemplaza este archivo por tu foto real (misma ruta/nombre)
    cv: "assets/Miguel Bedoya CV..pdf.pdf"
  },

  /* ---------------- REDES SOCIALES ---------------- */
  redes: [
    { nombre: "Instagram", url: "https://instagram.com/beleonm" },
    { nombre: "GitHub",    url: "https://github.com/Lyonn23" },
    { nombre: "YouTube",   url: "https://www.youtube.com/@beleonnm" },
    { nombre: "LinkedIn",  url: "https://www.linkedin.com/in/miguel-bedoya-león-725082343/" },
    { nombre: "TikTok",    url: "https://tiktok.com/@beleonm" }
  ],

  /* ---------------- DESARROLLO WEB ---------------- */
  desarrollo: {
    intro: "Construyo sitios y aplicaciones rápidas, accesibles y cuidadas al detalle — del diseño a la puesta en producción.",
    github: "Lyonn23",   // tu usuario de GitHub (sin @ ni URL) — ej: "octocat"
    servicios: [
      "Webs estratégicas para empresas y profesionales",
      "Páginas publicitarias para negocios",
      "Webs para marcas personales",
      "Páginas e invitaciones interactivas para eventos",
      "Babyshowers",
      "Bodas"
    ],
    stack: [
      "HTML5", "CSS3", "JavaScript", "React", "Node.js",
      "Express", "MongoDB", "Git", "Figma", "Tailwind CSS"
    ],
    proyectos: []
  },

  /* ---------------- FOTOGRAFÍA ---------------- */
  fotografia: {
    intro: "Capturo luz, momentos y composición. Retrato, calle y producto — siempre buscando el encuadre que no se explica, se siente.",
    equipo: ["Cámara: Canon EOS Rebel T7 y Iphone 14 PRO MAX", "Lentes: 55mm", "Edición: Lightroom + Photoshop"],
    galeria: [
      { titulo: "Serie Retrato",   categoria: "Retrato",  imagen: "assets/fotografia-1.jpg" },
      { titulo: "Serie paisaje",    categoria: "Paisaje",    imagen: "assets/fotografia-2.jpg" },
      { titulo: "Serie paisaje",  categoria: "Paisaje", imagen: "assets/fotografia-3.jpg" },
      { titulo: "Serie flores",   categoria: "Flores",  imagen: "assets/fotografia-4.jpg" },
      { titulo: "Serie retrato",    categoria: "Retrato",   imagen: "assets/fotografia-5.jpg" },
      { titulo: "Serie paisaje", categoria: "Paisaje",imagen: "assets/fotografia-6.jpg" }
    ]
  },

  /* ---------------- CREACIÓN DE CONTENIDO ---------------- */
  contenido: {
    intro: "Diseño contenido pensado para detener el scroll: guion, formato y estética adaptados a cada plataforma.",
    plataformas: [
      { nombre: "seguidores Instagram", seguidores: "1.194" },
      { nombre: "seguidores TikTok",    seguidores: "84" },
      { nombre: "seguidores YouTube",   seguidores: "33" }
    ],
    piezas: [
      {
        titulo: "Campaña / Serie Uno",
        formato: "imagen en TikTok",
        descripcion: "Una simple imagen con una frase reflexiva, la cual llegó a impactar en ciertas personas alcanzando poco mas de 29 mil views.",
        link: "https://www.tiktok.com/@beleonm/photo/7645742466443775245?is_from_webapp=1&sender_device=pc&web_id=7567831558411044364"
      },
      {
        titulo: "Campaña / Serie Dos",
        formato: "Carrusel",
        descripcion: "Post para la página de Instagram de una iglesia en la cual soy servidor, conectó con las personas y obtuvo un alcance de poco mas de 2 mil views.",
        link: "https://www.instagram.com/p/DXai9CmFkLQ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
      },
      {
        titulo: "Campaña / Serie Tres",
        formato: "Video largo",
        descripcion: "Video reflexivo sobre la llegada a la edad de los 20 viviendo una vida como cristiano, impactó en poco mas de mil personas.",
        link: "https://www.instagram.com/reel/DV2L7cvEXaa/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
      }
    ]
  },

  /* ---------------- EDICIÓN DE VIDEO ---------------- */
  video: {
    intro: "Edito con ritmo: color, sonido y corte al servicio de la historia. De crudo a entregable final.",
    herramientas: ["Premiere Pro", "Capcut", "DaVinci Resolve"],
    proyectos: [
      {
        titulo: "Video Uno",
        tipo: "Promo para invitar a servir en la iglesia en el ministerio de multimedia",
        descripcion: "Promo para invitar a servir en la iglesia en el ministerio de multimedia, de mi parte, me encargué de la edición, el color grading y la producción de las tomas de video.",
        videoSrc: 'assets/video-01-h264.mp4'
      },
      {
        titulo: "Video Dos",
        tipo: "Video corto reflexivo sobre la vida y la fe",
        descripcion: "Video editado y producido completamente de mi autoria, con enfoque en la narrativa y la edición, la música fue sacada de una pelicula.",
        videoSrc: 'assets/video-02-h264.mp4'
      },
      {
        titulo: "Video Tres",
        tipo: "Promo para un restaurante.",
        descripcion: "Video editado a partir de material crudo proporcionado por el cliente, hice color grading, edición y audio agregado.",
        videoSrc: 'assets/video-03-h264.mp4'
      }
    ]
  }
};
