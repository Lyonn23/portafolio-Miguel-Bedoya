// ============================================================================
// ANTIINSPECT.JS — Protección activa y ocultamiento de código en el navegador
// - Deshabilita menú contextual (clic derecho) protegiendo el código
// - Permite interacción y pegado legítimo dentro de inputs y textareas
// - Bloquea teclas y atajos de DevTools (F12, Ctrl+Shift+I/J/C/K, Ctrl+U, Ctrl+S)
// - Deshabilita el arrastre de imágenes
// - Silencia logs de consola en producción para no exponer endpoints
// - TRAMPA DEBUGGER LOOP: Pausa y congela DevTools en bucle si intentan abrirlo
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

  // 4. Silenciar la consola en entornos públicos para no exponer endpoints ni llamadas
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    ['log', 'debug', 'info', 'dir'].forEach(function (method) {
      if (window.console && typeof window.console[method] === 'function') {
        window.console[method] = function () {};
      }
    });
  }

  // 5. TRAMPA DEBUGGER LOOP (Congelamiento de DevTools)
  // Cuando DevTools está cerrado: el navegador lo procesa en microsegundos sin pausa ni impacto.
  // Cuando DevTools está abierto: el navegador detiene la ejecución en el debugger repetidamente,
  // congelando la pestaña de inspección y haciendo imposible leer o inspeccionar el sitio.
  function initDebuggerTrap() {
    // Si tú mismo necesitas inspeccionar localmente, puedes añadir ?debug=true a la URL
    if (window.location.search && window.location.search.indexOf('debug=true') !== -1) {
      return;
    }

    function activateTrap() {
      try {
        (function () {
          return function (t) {
            return ('' + t / t).length !== 1 || t === 0;
          };
        })()
        .constructor('debugger')();
      } catch (err) {}
    }

    // Intervalo recurrente de protección
    setInterval(activateTrap, 250);

    // Detección activa por tiempo de respuesta de debugger
    setInterval(function () {
      var startTime = performance.now();
      try {
        (function () {}).constructor('debugger')();
      } catch (e) {}
      var elapsed = performance.now() - startTime;
      if (elapsed > 100) {
        // DevTools abierto detectado -> Limpiar consola
        if (window.console && typeof window.console.clear === 'function') {
          window.console.clear();
        }
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebuggerTrap);
  } else {
    initDebuggerTrap();
  }
})();
