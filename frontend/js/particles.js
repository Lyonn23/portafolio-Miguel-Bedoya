/* ============================================================================
   PARTICLES.JS — Animated Dithering Shader & Topographic Wavefield
   Inspirado en la estética Cyber-Editorial & Dithering Shader (Bayer Matrix)
   Movimiento orgánico suave en GPU (WebGL) a 60fps con fallback 2D fluido.
   Paleta: Dark Monochrome / Titanium Silver (#000000, #0A0A0E, #8E8E98, #FFFFFF)
============================================================================ */

function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Intentar inicializar WebGL para rendimiento nativo a 60fps
  let gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' }) ||
           canvas.getContext('experimental-webgl');

  if (gl) {
    initWebGLDither(canvas, gl);
  } else {
    initCanvas2DTopography(canvas);
  }
}

/* ----------------------------------------------------------------------------
   WEBGL SHADER ENGINE: Bayer Matrix Dithering + Undulating Topographic Waves
---------------------------------------------------------------------------- */
function initWebGLDither(canvas, gl) {
  const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // Matriz de Dithering Bayer 4x4
    float bayer4(vec2 p) {
      vec2 b = floor(mod(p, 4.0));
      if (b.y < 1.0) {
        if (b.x < 1.0) return 0.0 / 16.0;
        if (b.x < 2.0) return 8.0 / 16.0;
        if (b.x < 3.0) return 2.0 / 16.0;
        return 10.0 / 16.0;
      } else if (b.y < 2.0) {
        if (b.x < 1.0) return 12.0 / 16.0;
        if (b.x < 2.0) return 4.0 / 16.0;
        if (b.x < 3.0) return 14.0 / 16.0;
        return 6.0 / 16.0;
      } else if (b.y < 3.0) {
        if (b.x < 1.0) return 3.0 / 16.0;
        if (b.x < 2.0) return 11.0 / 16.0;
        if (b.x < 3.0) return 1.0 / 16.0;
        return 9.0 / 16.0;
      } else {
        if (b.x < 1.0) return 15.0 / 16.0;
        if (b.x < 2.0) return 7.0 / 16.0;
        if (b.x < 3.0) return 13.0 / 16.0;
        return 5.0 / 16.0;
      }
    }

    // Campo de Ondas Topográficas Procedurales
    float topographicWave(vec2 p, float t, vec2 mouse) {
      // Deformación suave por proximidad del cursor
      float mDist = length(p - mouse);
      float mInfluence = smoothstep(0.45, 0.0, mDist) * 0.15;
      vec2 dir = normalize(p - mouse + 0.001);
      p += dir * mInfluence;

      // Armónicos de onda sinusoidal con rotación
      float t1 = t * 0.22;
      float t2 = t * 0.16;

      float w1 = sin(p.x * 2.8 + t1) * cos(p.y * 2.4 - t2);
      float w2 = sin(p.x * 4.8 - p.y * 3.6 + t1 * 1.3) * 0.5;
      float w3 = cos((p.x + p.y) * 5.2 - t2 * 1.5) * 0.25;
      float w4 = sin(length(p - vec2(0.8, 0.5)) * 6.5 - t1 * 0.9) * 0.35;

      float wave = w1 + w2 + w3 + w4;
      return wave * 0.45 + 0.5; // Normalizado en [0, 1]
    }

    void main() {
      // Resolución y coordenadas con aspecto corregido
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      float aspect = u_resolution.x / u_resolution.y;
      vec2 p = st;
      p.x *= aspect;

      vec2 m = u_mouse;
      m.x *= aspect;

      // Tamaño de bloque de dither (2.5px para textura táctil retro-futurista)
      float pixelSize = 2.5;
      vec2 ditherCoord = floor(gl_FragCoord.xy / pixelSize);

      // Calcular elevación topográfica
      float height = topographicWave(p * 1.25, u_time, m);

      // Curvas de nivel topográficas finas (líneas de contorno)
      float contourLines = abs(fract(height * 8.0) - 0.5);
      float isContour = smoothstep(0.08, 0.0, contourLines) * 0.35;

      // Combinar gradiente con líneas de nivel
      float luminance = clamp(height * 0.65 + isContour * 0.35, 0.0, 1.0);

      // Viñeteado elegante y atenuación en zona de lectura para máxima legibilidad
      float distCenter = length(st - vec2(0.38, 0.5));
      float textVignette = smoothstep(0.15, 0.65, distCenter);
      float edgeVignette = smoothstep(1.5, 0.3, length(st - vec2(0.5, 0.5)));
      luminance *= (textVignette * 0.45 + 0.55) * edgeVignette;

      // Umbral Bayer
      float threshold = bayer4(ditherCoord);

      // Salida monocromática con gradiente de titanio oscuro / grafito mate (CERO brillo cegador)
      vec3 darkVoid  = vec3(0.005, 0.005, 0.008);
      vec3 silverMid = vec3(0.16, 0.16, 0.20);
      vec3 silverHi  = vec3(0.36, 0.36, 0.42);

      vec3 color = darkVoid;

      if (luminance > threshold) {
        // Pixel activo: gradiente suave y atenuado
        float intensity = smoothstep(threshold, threshold + 0.35, luminance);
        color = mix(silverMid, silverHi, intensity);
      } else if (luminance > threshold * 0.55) {
        color = vec3(0.04, 0.04, 0.06);
      }

      // Mezcla final de fondo (opaco, sutil y elegante para contraste perfecto)
      gl_FragColor = vec4(color, 0.38);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    initCanvas2DTopography(canvas);
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    initCanvas2DTopography(canvas);
    return;
  }

  gl.useProgram(program);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  let width = 0, height = 0;
  const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

  function resize() {
    // Escala optimizada para 60fps constantes sin sobrecargar la GPU
    const scale = 0.75;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(width * scale));
    canvas.height = Math.max(1, Math.floor(height * scale));
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX / window.innerWidth;
    mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
  }, { passive: true });

  let startTime = performance.now();
  let isRunning = true;

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(render);
  });

  function render(now) {
    if (!isRunning) return;

    // Suavizado del mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    const elapsed = (now - startTime) * 0.001;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, mouse.x, mouse.y);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ----------------------------------------------------------------------------
   FALLBACK CANVAS 2D: Líneas Topográficas Curvas Ondulantes
---------------------------------------------------------------------------- */
function initCanvas2DTopography(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let t = 0;
  function loop() {
    ctx.clearRect(0, 0, width, height);
    t += 0.004;

    const lineCount = 18;
    const spacing = height / (lineCount * 0.85);

    ctx.lineWidth = 1;
    for (let i = 0; i < lineCount; i++) {
      const baseY = i * spacing + 50;
      const alpha = (0.05 + Math.sin((i / lineCount) * Math.PI) * 0.08) * 0.6;
      ctx.strokeStyle = `rgba(160, 160, 185, ${alpha})`;

      ctx.beginPath();
      for (let x = 0; x <= width; x += 30) {
        const wave = Math.sin(x * 0.003 + t + i * 0.25) * 45 +
                     Math.cos(x * 0.006 - t * 0.8 + i * 0.15) * 25;
        const y = baseY + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
