// antiinspect.js — medidas ligeras para dificultar inspección casual
// NOTA: Esto solo dificulta el acceso casual. No puede impedir que alguien
// determinado vea el código (el navegador necesita el código para ejecutarlo).

(function () {
  'use strict';

  // Evitar menú contextual
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Bloquear teclas comunes de DevTools y ver fuente
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (ver fuente)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+K (Firefox devtools)
    if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
      e.preventDefault();
      return false;
    }
  });

  // Crear overlay que se muestra si detectamos DevTools (heurística)
  var overlay = document.createElement('div');
  overlay.id = 'antiinspect-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.background = 'rgba(0,0,0,0.95)';
  overlay.style.color = '#fff';
  overlay.style.display = 'none';
  overlay.style.zIndex = '99999';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.textAlign = 'center';
  overlay.style.padding = '24px';
  overlay.style.fontFamily = 'Inter, Arial, sans-serif';
  overlay.style.fontSize = '18px';
  overlay.innerHTML = '<div><h2 style="margin-bottom:12px;">Acceso de desarrollador detectado</h2><p style="opacity:0.85;line-height:1.5;max-width:720px;margin:0 auto;">Parece que estás intentando abrir las herramientas de desarrollo. Esta acción no está permitida en esta página. Si necesitas soporte, contacta al propietario del sitio.</p></div>';
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);
  });

  // Heurística simple para detectar DevTools abierto: diferencia entre outer/inner
  var devtoolsOpen = false;
  var threshold = 160; // px — sensible en algunos navegadores

  function checkDevTools() {
    var widthDiff = window.outerWidth - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > threshold || heightDiff > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        overlay.style.display = 'flex';
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
        overlay.style.display = 'none';
      }
    }
  }

  // Timeout loop — baja frecuencia para no afectar rendimiento
  setInterval(checkDevTools, 1000);

})();
