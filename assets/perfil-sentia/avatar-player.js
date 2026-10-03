/* ═══════════════════════════════════════════════════════════════
   Avatar interactivo:
   - Estado quieto: el PNG limpio con transparencia real (generado en
     Canva) — se ve bien en modo claro Y oscuro, sin bordes raros.
   - Al activarse: se reemplaza por el <canvas> que reproduce el video
     completo. MP4 no soporta transparencia nativa, así que el fondo
     plano del video se recorta en vivo con un "chroma key" por
     cuadro mientras se reproduce.
   - Al terminar el video, regresa al PNG limpio (no al primer cuadro
     del video, para no arrastrar el ligero borde del recorte).

   Activación: en computadora (con mouse) se activa al pasar el mouse
   encima — así es más descubrible que un clic. En celular/touch, al
   no existir "hover", se activa con el toque.

   Uso: window.SentiaAvatarPlayer.mount(wrapEl, { videoSrc, imageSrc, bgColor })
   wrapEl debe contener dentro: <img class="res-avatar-img"> y
   <canvas class="res-avatar-canvas">.

   Reutilizable para los próximos avatares por perfil: cada uno solo
   necesita su propio PNG + video + color de fondo a quitar.
   ═══════════════════════════════════════════════════════════════ */
window.SentiaAvatarPlayer = {
  mount(wrapEl, opts) {
    const {
      videoSrc,
      imageSrc,
      bgColor = [244, 238, 232],
      threshold = 42,
      softness = 28,
      width = 260
    } = opts;

    const img = wrapEl.querySelector('.res-avatar-img');
    const canvas = wrapEl.querySelector('.res-avatar-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const video = document.createElement('video');
    video.src = videoSrc;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    let raf = null;
    let playing = false;

    img.src = imageSrc;

    function showImg() { img.style.display = ''; canvas.style.display = 'none'; }
    function showCanvas() { img.style.display = 'none'; canvas.style.display = ''; }

    function drawFrame() {
      if (!video.videoWidth) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = frame.data;
      const [br, bg, bb] = bgColor;
      for (let i = 0; i < d.length; i += 4) {
        const dr = d[i] - br, dg = d[i + 1] - bg, db = d[i + 2] - bb;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < threshold) d[i + 3] = 0;
        else if (dist < threshold + softness) d[i + 3] = Math.round(255 * (dist - threshold) / softness);
      }
      ctx.putImageData(frame, 0, 0);
    }

    function loop() {
      if (video.paused || video.ended) { raf = null; return; }
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    video.addEventListener('loadeddata', () => {
      const ratio = video.videoHeight / video.videoWidth;
      canvas.width = width;
      canvas.height = Math.round(width * ratio);
    });
    video.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(loop); });
    video.addEventListener('ended', () => {
      playing = false;
      video.currentTime = 0;
      showImg(); // regresa al PNG limpio, no al cuadro recortado del video
    });

    function play() {
      if (playing) return;
      playing = true;
      showCanvas();
      video.currentTime = 0;
      video.play().catch(() => { playing = false; showImg(); });
    }

    wrapEl.style.cursor = 'pointer';
    const tieneMouse = window.matchMedia('(hover: hover)').matches;
    if (tieneMouse) {
      wrapEl.addEventListener('mouseenter', play);
    } else {
      wrapEl.addEventListener('click', play);
      wrapEl.addEventListener('touchstart', play, { passive: true });
    }

    showImg();
    return video;
  }
};
