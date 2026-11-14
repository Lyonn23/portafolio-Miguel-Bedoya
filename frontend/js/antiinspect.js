// ============================================================================
// ANTIINSPECT.JS — Protección y ocultamiento de código en el navegador
// - Deshabilita menú contextual (clic derecho) protegiendo el código
// - Permite interacción y pegado legítimo dentro de inputs y textareas
// - Bloquea teclas y atajos de DevTools (F12, Ctrl+Shift+I/J/C/K, Ctrl+U, Ctrl+S)
// - Deshabilita el arrastre de imágenes
// - Silencia logs de consola en entornos públicos para no exponer endpoints
// ============================================================================

(function () {
  'use strict';

  // 1. Bloquear menú contextual (clic derecho) fuera de campos de texto
  document.addEventListener('contextmenu', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
      return; // Permite copiar/pegar texto a usuarios legítimos en el formulario
    }
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Bloquear atajos de teclado de herramientas de desarrollo e inspección
  document.addEventListener('keydown', function (e) {
    var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    var metaOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // F12
    if (e.keyCode === 123 || e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+Shift+K
    // En Mac: Cmd+Option+I / Cmd+Option+J / Cmd+Option+C
    var shiftOrOption = isMac ? e.altKey : e.shiftKey;
    if (metaOrCtrl && shiftOrOption && ['I', 'J', 'C', 'K', 'i', 'j', 'c', 'k'].includes(e.key)) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U (Ver código fuente) o Cmd+Option+U en Mac
    if ((metaOrCtrl && (e.key === 'u' || e.key === 'U')) || (isMac && e.metaKey && e.altKey && (e.key === 'u' || e.key === 'U'))) {
      e.preventDefault();
      return false;
    }

    // Ctrl+S / Cmd+S (Guardar página)
    if (metaOrCtrl && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 3. Bloquear arrastre de imágenes
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // 4. Silenciar la consola en producción para no exponer endpoints ni llamadas
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    ['log', 'debug', 'info', 'dir'].forEach(function (method) {
      if (window.console && typeof window.console[method] === 'function') {
        window.console[method] = function () {};
      }
    });
  }
})();
