/* ═══════════════════════════════════════════════════════════════
   Avatar interactivo con video (sin fondo transparente real, porque
   MP4 no soporta canal alfa). En vez de eso, se "recorta" el fondo
   plano del video por color en vivo usando un <canvas> (chroma key),
   cuadro por cuadro, mientras se reproduce.

   Uso: window.SentiaAvatarPlayer.mount(canvas, { src, bgColor })
   - Al cargar, se queda quieto mostrando el primer cuadro (sin fondo).
   - Al dar clic, reproduce el video completo (también sin fondo).
   - Al terminar, regresa solo a estar quieto en el primer cuadro.

   Pensado para reutilizarse con los próximos avatares por perfil
   (cada uno solo necesita su propio video + color de fondo a quitar).
   ═══════════════════════════════════════════════════════════════ */
window.SentiaAvatarPlayer = {
  mount(canvas, opts) {
    const {
      src,
      bgColor = [244, 238, 232], // color de fondo a quitar (detectado del video de prueba)
      threshold = 42,            // qué tan parecido al fondo debe ser un pixel para volverse transparente
      softness = 28              // suaviza el borde entre personaje y fondo (evita bordes duros)
    } = opts;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    let raf = null;

    function drawFrame() {
      if (!video.videoWidth) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = img.data;
      const [br, bg, bb] = bgColor;
      for (let i = 0; i < d.length; i += 4) {
        const dr = d[i] - br, dg = d[i + 1] - bg, db = d[i + 2] - bb;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < threshold) d[i + 3] = 0;
        else if (dist < threshold + softness) d[i + 3] = Math.round(255 * (dist - threshold) / softness);
      }
      ctx.putImageData(img, 0, 0);
    }

    function loop() {
      if (video.paused || video.ended) { raf = null; return; }
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    video.addEventListener('loadeddata', () => {
      const ratio = video.videoHeight / video.videoWidth;
      canvas.width = opts.width || 260;
      canvas.height = opts.height || Math.round(canvas.width * ratio);
      drawFrame(); // cuadro inicial quieto, ya sin fondo
    });
    video.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(loop); });
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      setTimeout(drawFrame, 60); // vuelve a dejar quieto el primer cuadro
    });

    canvas.style.cursor = 'pointer';
    canvas.title = 'Dale clic para saludar';
    canvas.addEventListener('click', () => {
      if (video.paused) { video.currentTime = 0; video.play().catch(() => {}); }
    });

    return video;
  }
};
