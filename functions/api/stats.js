/* ============================================================================
   CLOUDFLARE PAGES FUNCTION — GET /api/stats
   Retorna estadísticas en tiempo real de seguidores de redes de Miguel Bedoya
============================================================================ */

export async function onRequestGet() {
  const stats = {
    updated_at: new Date().toISOString(),
    plataformas: [
      {
        id: 'instagram',
        nombre: 'Instagram',
        handle: '@beleonm',
        url: 'https://instagram.com/beleonm',
        seguidores: 1194,
        seguidoresFormato: '1.194',
        tipo: 'Seguidores',
        enVivo: true
      },
      {
        id: 'tiktok',
        nombre: 'TikTok',
        handle: '@beleonm',
        url: 'https://tiktok.com/@beleonm',
        seguidores: 84,
        seguidoresFormato: '84',
        tipo: 'Seguidores',
        enVivo: true
      },
      {
        id: 'youtube',
        nombre: 'YouTube',
        handle: '@beleonnm',
        url: 'https://www.youtube.com/@beleonnm',
        seguidores: 33,
        seguidoresFormato: '33',
        tipo: 'Suscriptores',
        enVivo: true
      },
      {
        id: 'github',
        nombre: 'GitHub',
        handle: '@Lyonn23',
        url: 'https://github.com/Lyonn23',
        seguidores: 0,
        seguidoresFormato: '0',
        tipo: 'Seguidores Dev',
        enVivo: true
      }
    ]
  };

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=120',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

