/* ═══════════════════════════════════════════════════════════════
   APP · "Encuentra tu perfil Sentia"
   Controlador de la interfaz: arma la secuencia de preguntas según
   la rama elegida, pinta cada pantalla, calcula el resultado final
   y arma el registro completo (con etiquetas y placeholders de WATI)
   listo para guardarse. El guardado real a un servidor se conecta en
   una fase posterior — ver nota al final.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  const Q = window.SENTIA_QUESTIONS;
  const PROFILES = window.SENTIA_PROFILES;
  const Scoring = window.SentiaScoring;
  const FORMATOS_LABELS = window.SENTIA_FORMATOS_LABELS;
  const COMBINED = window.SENTIA_COMBINED_TAGLINES;
  const CURSOS = window.SENTIA_CURSOS;
  // Mismo servidor que ya usa el panel VIP para certificados/progreso (Fase 2).
  // Si la ruta aún no está desplegada en Railway, el guardado falla en silencio
  // y el test sigue funcionando igual para el usuario (nunca se bloquea por esto).
  const WEBHOOK_URL = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://sentia-academy-webhook-production.up.railway.app';

  const state = {
    perfilBase: null,
    scores: Scoring.emptyScores(),
    respuestas: [],   // [{pregunta, respuesta}] completas, para guardar
    tags: new Set(),
    formatos: new Set(),
    objetivos: [],    // respuesta de la pregunta contextual (su meta específica)
    queue: [],        // preguntas 2..7 (contextual + 5 generales), una vez conocido perfilBase
    step: 0,          // 0 = pregunta base; 1..6 = índice dentro de queue
    total: 7,
    genero: null,     // 'f' | 'm' | null (opcional) — se pregunta al terminar las preguntas, antes del resultado
    resultado: null,  // se llena al terminar el test
    resultadoId: null, // id estable del registro, fijado al llegar al resultado (sobrevive un recargo de página)
    history: []       // snapshots para "Pregunta anterior"
  };

  function snapshotState() {
    return {
      perfilBase: state.perfilBase,
      scores: Object.assign({}, state.scores),
      respuestas: state.respuestas.slice(),
      tags: new Set(state.tags),
      formatos: new Set(state.formatos),
      objetivos: state.objetivos.slice(),
      queue: state.queue.slice(),
      step: state.step
    };
  }
  function pushHistory() { state.history.push(snapshotState()); }
  function restoreSnapshot(s) {
    state.perfilBase = s.perfilBase;
    state.scores = s.scores;
    state.respuestas = s.respuestas;
    state.tags = s.tags;
    state.formatos = s.formatos;
    state.objetivos = s.objetivos;
    state.queue = s.queue;
    state.step = s.step;
  }
  function updateBackButton() {
    document.getElementById('q-back').classList.toggle('is-visible', state.history.length > 0);
  }

  // ── Progreso guardado: si cierran o recargan a medio test, lo retoman
  // donde iban en vez de empezar de cero. Se guarda en localStorage (no
  // sessionStorage) para que sobreviva aunque cierren la pestaña/navegador.
  // No se guarda `queue`: se reconstruye sola a partir de perfilBase. ──
  const PROGRESO_KEY = 'sentia-perfil-progreso';
  function guardarProgreso() {
    try {
      localStorage.setItem(PROGRESO_KEY, JSON.stringify({
        perfilBase: state.perfilBase,
        scores: state.scores,
        respuestas: state.respuestas,
        tags: Array.from(state.tags),
        formatos: Array.from(state.formatos),
        objetivos: state.objetivos,
        step: state.step
      }));
    } catch (e) {}
  }
  function leerProgreso() {
    try {
      const g = JSON.parse(localStorage.getItem(PROGRESO_KEY) || 'null');
      return g && typeof g === 'object' && g.perfilBase ? g : null;
    } catch (e) { return null; }
  }
  function limpiarProgreso() {
    try { localStorage.removeItem(PROGRESO_KEY); } catch (e) {}
  }

  // ── Resultado guardado: llegar al resultado también se guarda aparte del
  // progreso del cuestionario (que se borra apenas termina). Sin esto, recargar
  // la página estando en la pantalla de resultado (ej. a medio llenar el
  // formulario del asesor) mandaba de vuelta a la bienvenida y obligaba a
  // repetir las 7 preguntas — se guarda lo mínimo para recalcular el mismo
  // resultado (el id se conserva para que reenviarlo al servidor nunca
  // duplique el registro). Se borra solo con "Volver a hacer el test". ──
  const RESULTADO_KEY = 'sentia-perfil-resultado-guardado';
  function guardarEstadoResultado() {
    try {
      localStorage.setItem(RESULTADO_KEY, JSON.stringify({
        id: state.resultadoId,
        perfilBase: state.perfilBase,
        scores: state.scores,
        respuestas: state.respuestas,
        tags: Array.from(state.tags),
        formatos: Array.from(state.formatos),
        objetivos: state.objetivos,
        genero: state.genero
      }));
    } catch (e) {}
  }
  function leerEstadoResultado() {
    try {
      const g = JSON.parse(localStorage.getItem(RESULTADO_KEY) || 'null');
      return g && typeof g === 'object' && g.perfilBase && g.scores ? g : null;
    } catch (e) { return null; }
  }
  function limpiarEstadoResultado() {
    try { localStorage.removeItem(RESULTADO_KEY); } catch (e) {}
  }

  document.getElementById('q-back').addEventListener('click', () => {
    if (!state.history.length) return;
    restoreSnapshot(state.history.pop());
    document.getElementById('context-msg').classList.remove('is-visible');
    if (state.step === 0) renderBase(); else renderQueueStep();
  });

  const el = {
    screens: {
      welcome: document.getElementById('screen-welcome'),
      question: document.getElementById('screen-question'),
      genero: document.getElementById('screen-genero'),
      analysis: document.getElementById('screen-analysis'),
      result: document.getElementById('screen-result')
    }
  };

  function showScreen(name) {
    Object.entries(el.screens).forEach(([key, node]) => {
      node.classList.toggle('is-active', key === name);
    });
  }

  function resetTest() {
    state.perfilBase = null;
    state.scores = Scoring.emptyScores();
    state.respuestas = [];
    state.tags = new Set();
    state.formatos = new Set();
    state.objetivos = [];
    state.queue = [];
    state.step = 0;
    state.genero = null;
    state.resultado = null;
    state.resultadoId = null;
    state.history = [];
    resetLeadBox();
    resetGeneroBox();
    limpiarProgreso();
    limpiarEstadoResultado();
    showScreen('welcome');
  }
  window.__sentiaResetTest = resetTest;

  document.getElementById('btn-empezar').addEventListener('click', () => {
    showScreen('question');
    renderBase();
  });

  document.getElementById('btn-repetir').addEventListener('click', resetTest);

  // ── Pregunta base (siempre la primera) ──
  function renderBase() {
    renderQuestion({
      numero: 1,
      texto: Q.base.text,
      opciones: Q.base.options.map(o => ({ label: o.label, icon: o.icon, _value: o.value, _tag: o.tag })),
      onSelect: (opt) => {
        pushHistory();
        state.perfilBase = opt._value;
        state.tags.add(opt._tag === 'crecimiento_personal' ? 'crecimiento_personal' : opt._tag);
        state.respuestas.push({ pregunta: Q.base.text, respuesta: opt.label });
        // Construir la ruta de 6 preguntas restantes: contextual + 5 generales
        const contextual = Q.contextual[state.perfilBase] || Q.contextual._fallback;
        state.queue = [{ tipo: 'contextual', data: contextual }]
          .concat(Q.general.map(g => ({ tipo: 'general', data: g })));
        state.step = 1;
        guardarProgreso();
        mostrarMensajeContexto(Q.contextMessage[state.perfilBase] || Q.contextMessage.otro, () => renderQueueStep());
      }
    });
  }

  // Mensaje de transición breve ("Perfecto. Vamos a conocer...")
  function mostrarMensajeContexto(mensaje, callback) {
    const box = document.getElementById('context-msg');
    box.textContent = mensaje;
    box.classList.add('is-visible');
    setTimeout(() => {
      box.classList.remove('is-visible');
      callback();
    }, 1100);
  }

  // Pinta la pregunta que corresponde a state.step dentro de queue
  function renderQueueStep() {
    const item = state.queue[state.step - 1];
    renderQuestion({
      numero: state.step + 1,
      texto: item.data.text,
      opciones: item.data.options,
      onSelect: (opt) => {
        pushHistory();
        Scoring.addPoints(state.scores, opt.points);
        state.respuestas.push({ pregunta: item.data.text, respuesta: opt.label });
        (opt.tags || []).forEach(t => state.tags.add(t));
        if (opt.formato) state.formatos.add(opt.formato);
        if (item.tipo === 'contextual') state.objetivos.push(opt.label);
        state.step += 1;
        guardarProgreso();
        if (state.step - 1 < state.queue.length) {
          renderQueueStep();
        } else {
          showScreen('genero');
        }
      }
    });
  }

  // ── Render genérico de una pantalla de pregunta ──
  function renderQuestion({ numero, texto, opciones, onSelect }) {
    updateBackButton();
    document.getElementById('q-num').textContent = numero;
    document.getElementById('q-total').textContent = state.total;
    document.getElementById('progress-fill').style.width = Math.round((numero / state.total) * 100) + '%';

    const textEl = document.getElementById('q-text');
    const gridEl = document.getElementById('q-options');
    textEl.classList.remove('q-anim'); void textEl.offsetWidth; textEl.classList.add('q-anim');
    gridEl.classList.remove('q-anim'); void gridEl.offsetWidth; gridEl.classList.add('q-anim');

    textEl.textContent = texto;
    gridEl.innerHTML = '';
    opciones.forEach((opt, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'opt-card';
      card.style.setProperty('--d', (i * 0.04) + 's');
      card.innerHTML = '<span class="opt-card__ic">' + window.sentiaIconSvg(opt.icon) + '</span><span class="opt-card__label">' + opt.label + '</span>';
      card.addEventListener('click', () => {
        if (gridEl.classList.contains('is-locked')) return;
        gridEl.classList.add('is-locked');
        card.classList.add('is-selected');
        setTimeout(() => onSelect(opt), 260);
      });
      gridEl.appendChild(card);
    });
    gridEl.classList.remove('is-locked');
  }

  // ── Pantalla de género del avatar (opcional, antes del resultado) ──
  function resetGeneroBox() {
    document.querySelectorAll('.genero-opt').forEach(opt => opt.classList.remove('is-selected'));
    document.querySelectorAll('#genero-grid input[type="radio"]').forEach(r => { r.checked = false; });
  }
  document.querySelectorAll('.genero-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.genero-opt').forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      opt.querySelector('input[type="radio"]').checked = true;
    });
  });
  document.getElementById('btn-ver-resultados').addEventListener('click', () => {
    const checked = document.querySelector('#genero-grid input[type="radio"]:checked');
    const valor = checked ? checked.value : null;
    if (valor === 'nd') {
      // "Prefiero no decirlo": se sortea un avatar (f o m) nada más para
      // decidir qué imagen mostrar; se guarda aparte que no quiso decir el
      // género, para no reportarlo como si lo hubiera elegido.
      state.genero = Math.random() < 0.5 ? 'f' : 'm';
      state.tags.add('genero_reservado');
    } else {
      state.genero = valor;
    }
    // A partir de aquí ya hay suficiente para recalcular el resultado en
    // cualquier momento (ver nota de RESULTADO_KEY arriba) — se guarda ya,
    // antes de la animación de "analizando", por si recargan durante esta.
    state.resultadoId = 'sentia-' + Date.now().toString(36);
    guardarEstadoResultado();
    runAnalysis();
  });

  // ── Pantalla de análisis (mensajes animados antes del resultado) ──
  function runAnalysis() {
    showScreen('analysis');
    const mensajes = [
      'Analizando cómo aprendes…',
      'Identificando tus intereses…',
      'Detectando tu estilo…',
      'Construyendo tu ruta…',
      'Tu perfil está listo.'
    ];
    const label = document.getElementById('analysis-msg');
    let i = 0;
    label.textContent = mensajes[0];
    label.classList.add('is-visible');
    const iv = setInterval(() => {
      i++;
      if (i >= mensajes.length) {
        clearInterval(iv);
        setTimeout(() => renderResult(), 500);
        return;
      }
      label.classList.remove('is-visible');
      setTimeout(() => {
        label.textContent = mensajes[i];
        label.classList.add('is-visible');
      }, 160);
    }, 620);
  }

  // ── Pantalla de resultado ──
  // Blindada con try/finally: si algo truena a medias (ej. un elemento que
  // no existe por un caché de HTML viejo con JS nuevo), igual se muestra la
  // pantalla de resultado en vez de dejar a la persona viendo el spinner de
  // "analizando" para siempre.
  function renderResult() {
    try {
      renderResultInterno();
    } catch (e) {
      console.error('[perfil-sentia] Error al armar el resultado:', e);
    } finally {
      limpiarProgreso(); // llegar aquí es terminar el test, haya salido bien o a medias
      showScreen('result');
    }
  }
  // Aislado en su propia función (en vez de vivir inline en renderResultInterno):
  // nunca debe poder tumbar el resto del resultado si un elemento no existe
  // por un caché de HTML viejo con JS nuevo, y necesita poder llamarse de
  // nuevo sola cuando el catálogo (window.SENTIA_CURSOS_READY) llega tarde —
  // pasa al restaurar un resultado guardado justo al recargar la página,
  // donde no hay tiempo de sobra como en el flujo normal del cuestionario.
  function renderSiguientePaso(principal) {
    try {
      const curso = CURSOS && principal.cursoRecomendado ? CURSOS[principal.cursoRecomendado] : null;
      const siguiente = document.getElementById('res-siguiente');
      const siguienteCta = document.getElementById('res-siguiente-cta');
      if (curso && siguiente && siguienteCta) {
        document.getElementById('res-siguiente-area').textContent = curso.gratis ? '2 clases gratis' : 'Acceso VIP';
        siguiente.classList.toggle('res-siguiente--vip', !curso.gratis);
        document.getElementById('res-siguiente-titulo').textContent = curso.titulo;
        document.getElementById('res-siguiente-desc').textContent = curso.descripcion;
        siguienteCta.textContent = '';
        siguienteCta.append(curso.gratis ? 'Ver clases gratis ' : 'Crear mi cuenta ');
        siguienteCta.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
        siguienteCta.href = 'vip-auth.html';
        siguiente.style.display = '';
      } else if (siguiente) {
        siguiente.style.display = 'none';
      }
    } catch (e) { console.error('[perfil-sentia] Error en "siguiente paso":', e); }
  }
  // Si el catálogo todavía no había llegado la primera vez que se intentó
  // pintar esta sección, se reintenta sola en cuanto esté listo — sin esto,
  // restaurar el resultado al recargar la página podía dejar la tarjeta
  // oculta para siempre (el fetch cruzado a sentiamx.com no alcanza a
  // resolver antes de que renderResult() se dispare en ese caso).
  if (window.SENTIA_CURSOS_READY) {
    window.SENTIA_CURSOS_READY.then(() => {
      if (state.resultado) renderSiguientePaso(PROFILES[state.resultado.principal]);
    }).catch(() => {});
  }

  function renderResultInterno() {
    const resultado = Scoring.computeResult(state.scores);
    const principal = PROFILES[resultado.principal];
    const secundario = PROFILES[resultado.secondary];

    const badgeEl = document.getElementById('res-code');
    const avatarWrap = document.getElementById('res-avatar-wrap');
    const personaje = window.sentiaGetCharacter ? window.sentiaGetCharacter(principal.code, state.genero) : null;
    const mountKey = principal.code + ':' + state.genero;
    if (personaje && personaje.video && personaje.image && window.SentiaAvatarPlayer) {
      badgeEl.style.display = 'none';
      avatarWrap.style.display = '';
      avatarWrap.style.cursor = '';
      if (avatarWrap.dataset.mounted !== mountKey) {
        avatarWrap.dataset.mounted = mountKey;
        window.SentiaAvatarPlayer.mount(avatarWrap, {
          imageSrc: personaje.image,
          videoSrc: personaje.video.src,
          bgColor: personaje.video.bgColor
        });
      }
    } else if (personaje && personaje.image) {
      // Sin video para este perfil/sexo: se muestra el PNG fijo, sin el
      // gesto de hover (no hay nada que reproducir).
      badgeEl.style.display = 'none';
      avatarWrap.style.display = '';
      avatarWrap.style.cursor = 'default';
      if (avatarWrap.dataset.mounted !== mountKey) {
        avatarWrap.dataset.mounted = mountKey;
        const imgEl = avatarWrap.querySelector('.res-avatar-img');
        const canvasEl = avatarWrap.querySelector('.res-avatar-canvas');
        imgEl.src = personaje.image;
        imgEl.style.display = '';
        canvasEl.style.display = 'none';
      }
    } else {
      badgeEl.style.display = '';
      avatarWrap.style.display = 'none';
    }
    document.getElementById('res-code').textContent = principal.code;
    document.getElementById('res-name').textContent = principal.name;
    document.getElementById('res-tagline').textContent = principal.tagline;
    document.getElementById('res-desc').textContent = principal.description;
    document.getElementById('res-focus').textContent = principal.dominantFocus;
    document.getElementById('res-style').textContent = principal.learningStyle;
    document.getElementById('res-secondary-name').textContent = secundario.code + ' — ' + secundario.name;

    // Empate 1º/2º lugar: mostrar mensaje de "perfil combinado" además del normal
    const combinedBox = document.getElementById('res-combined');
    const secondaryWrap = document.getElementById('res-secondary-wrap');
    if (resultado.empatado) {
      const key = [resultado.principal, resultado.secondary].sort().join('_');
      document.getElementById('res-combined-codes').textContent = resultado.principal + ' + ' + resultado.secondary;
      document.getElementById('res-combined-text').textContent = 'Tu perfil combina dos fortalezas principales: ' + (COMBINED[key] || '');
      combinedBox.style.display = '';
      secondaryWrap.style.display = 'none';
    } else {
      combinedBox.style.display = 'none';
      secondaryWrap.style.display = '';
    }

    // Afinidad por perfil: solo el principal y el que le sigue (sección 2 del
    // rediseño) — ver el resto en 0% no aporta nada, solo ruido visual.
    const ordenados = resultado.sorted; // [[codigo, puntaje], ...] desc
    const bars = document.getElementById('res-bars');
    bars.innerHTML = ordenados.slice(0, 2).map(([codigo]) => {
      const p = PROFILES[codigo];
      const pct = resultado.percentages[codigo];
      return '<div class="res-bar res-bar--top"><div class="res-bar__head"><span>' + codigo + ' — ' + p.name + '</span><b>' + pct + '%</b></div>' +
        '<div class="res-bar__track"><i style="width:' + pct + '%"></i></div></div>';
    }).join('');

    document.getElementById('res-conecta').innerHTML = principal.conecta.map(t => '<span class="chip">' + t + '</span>').join('');

    // Tu siguiente paso recomendado: el único curso real (de los 3 que existen
    // hoy) que mejor conecta con este perfil. Los 3 ya tienen primeras clases
    // gratis, así que el badge/CTA siempre dicen "gratis" por ahora — se
    // sigue leyendo curso.gratis en vez de asumirlo, para que sea honesto si
    // algún curso vuelve a ser solo VIP más adelante.
    renderSiguientePaso(principal);

    state.resultado = resultado;
    resetLeadBox();
    const registro = armarRegistro(); // deja window.__ultimoResultadoSentia listo, sin datos de contacto todavía
    guardarResultadoEnServidor(registro);
    // showScreen('result') lo hace el finally de renderResult() (arriba).
  }

  // Guarda el resultado anónimo apenas está listo (sección 20: el resultado
  // existe aunque el usuario nunca deje datos de contacto). Nunca bloquea la
  // interfaz: si el servidor aún no tiene la ruta desplegada, solo se avisa
  // en consola y el usuario sigue viendo su resultado con normalidad.
  // ── Reintento de guardados fallidos ──
  // Si falla el internet o el webhook aún no responde, el envío queda en una
  // cola en localStorage y se reintenta solo (al recuperar conexión, o en la
  // próxima visita) en vez de perderse para siempre. Ambos endpoints son
  // idempotentes (mismo id = mismo documento), así que reintentar de más
  // nunca duplica nada.
  const PENDIENTES_KEY = 'sentia-perfil-pendientes';
  function leerPendientes() {
    try { const l = JSON.parse(localStorage.getItem(PENDIENTES_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }
  function escribirPendientes(lista) {
    try { if (lista.length) localStorage.setItem(PENDIENTES_KEY, JSON.stringify(lista)); else localStorage.removeItem(PENDIENTES_KEY); } catch (e) {}
  }
  function agregarPendiente(item) {
    escribirPendientes([...leerPendientes().filter(p => p.id !== item.id), item]);
  }
  function enviarAlWebhook(ruta, body) {
    return fetch(WEBHOOK_URL + ruta, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return true;
    }).catch(e => { console.warn('[perfil-sentia] Envío falló (¿ruta aún no desplegada?), queda pendiente:', e.message); return false; });
  }
  function intentarPendiente(item) {
    enviarAlWebhook(item.ruta, item.body).then(ok => {
      if (ok) {
        console.log('[perfil-sentia] Pendiente enviado al reintentar:', item.id);
        escribirPendientes(leerPendientes().filter(p => p.id !== item.id));
      }
    });
  }
  function reintentarPendientes() {
    leerPendientes().forEach(intentarPendiente);
  }
  window.addEventListener('online', reintentarPendientes);

  function guardarResultadoEnServidor(registro) {
    const item = { id: registro.id + ':resultado', ruta: '/api/perfil-sentia/resultado', body: registro };
    enviarAlWebhook(item.ruta, item.body).then(ok => {
      if (ok) console.log('[perfil-sentia] Resultado guardado en el servidor.');
      else agregarPendiente(item);
    });
  }

  function guardarContactoEnServidor(id, contacto) {
    const item = { id: id + ':contacto', ruta: '/api/perfil-sentia/' + encodeURIComponent(id) + '/contacto', body: contacto };
    enviarAlWebhook(item.ruta, item.body).then(ok => {
      if (ok) console.log('[perfil-sentia] Contacto guardado en el servidor.');
      else agregarPendiente(item);
    });
  }

  // ── Pie de resultado + captación de lead (secciones 3, 4, 16 del spec) ──
  // El pie con 3 opciones (estilo Alintec) es lo que se ve primero; el
  // formulario de nombre/WhatsApp solo aparece si eligen "Prefiero que un
  // asesor me escriba" — nunca es obligatorio dejar datos.
  function resetLeadBox() {
    document.getElementById('res-pie').style.display = '';
    document.getElementById('lead-box').style.display = 'none';
    document.getElementById('lead-form').style.display = '';
    document.getElementById('lead-done').style.display = 'none';
    document.getElementById('lead-lada').value = '+52';
    document.getElementById('lead-whatsapp').value = '';
    document.getElementById('lead-consent').checked = false;
  }

  document.getElementById('pie-asesor').addEventListener('click', () => {
    document.getElementById('res-pie').style.display = 'none';
    document.getElementById('lead-box').style.display = '';
  });
  // "Volver": salir del formulario del asesor sin dejar datos, de vuelta a
  // la opción de arriba (sección pedida explícitamente: siempre debe haber
  // una salida para quien no quiera esta opción).
  document.getElementById('lead-volver').addEventListener('click', resetLeadBox);
  document.getElementById('lead-save').addEventListener('click', () => {
    const lada = document.getElementById('lead-lada').value;
    const whatsapp = document.getElementById('lead-whatsapp').value.trim();
    const acepta = document.getElementById('lead-consent').checked;
    if (!whatsapp) { alert('Escribe tu WhatsApp para continuar.'); return; }
    if (!acepta) { alert('Necesitamos tu autorización para poder escribirte.'); return; }

    const registro = armarRegistro({
      nombre: null, telefono: lada + ' ' + whatsapp, correo: null,
      acepta_comunicaciones: true,
      fecha_consentimiento: new Date().toISOString()
    });
    guardarContactoEnServidor(registro.id, { nombre: null, telefono: lada + ' ' + whatsapp, correo: null, acepta_comunicaciones: true });

    document.getElementById('lead-form').style.display = 'none';
    document.getElementById('lead-done').style.display = '';
  });

  // ── Arma el registro completo (sección 5, 6, 14, 16 del spec) ──
  // Sin datos de contacto = resultado anónimo (nunca es obligatorio dejar datos).
  function armarRegistro(contacto) {
    const resultado = state.resultado;
    const principal = PROFILES[resultado.principal];
    const secundario = PROFILES[resultado.secondary];

    const tags = Array.from(state.tags);
    tags.push('perfil_' + resultado.principal, 'perfil_' + resultado.secondary);

    const base = {
      id: state.resultadoId || (window.__ultimoResultadoSentia && window.__ultimoResultadoSentia.id) || ('sentia-' + Date.now().toString(36)),
      fecha: new Date().toISOString(),
      source: 'perfil_sentia',

      perfil_base: state.perfilBase,
      perfil_principal: resultado.principal,
      perfil_secundario: resultado.secondary,
      genero: state.genero,
      todos_los_puntajes: resultado.scores,
      todos_los_porcentajes: resultado.percentages,
      enfoque_dominante: principal.dominantFocus,
      estilo_aprendizaje: principal.learningStyle,
      intereses: principal.conecta,
      objetivos: state.objetivos,
      formatos_preferidos: Array.from(state.formatos).map(f => FORMATOS_LABELS[f] || f),
      respuestas_completas: state.respuestas,
      ruta_recomendada: principal.recommendations,
      tags: Array.from(new Set(tags)),

      // Datos de contacto: null hasta que el usuario decida dejarlos (sección 3, 16, 20)
      nombre: null, telefono: null, correo: null,
      acepta_comunicaciones: false, fecha_consentimiento: null,

      // Preparado para una futura integración (sección 14) · sin funcionalidad real todavía
      wati_contact_id: null, wati_sync_status: 'not_synced', wati_last_sync: null
    };

    const registro = Object.assign(base, contacto || {});
    window.__ultimoResultadoSentia = registro;
    try { sessionStorage.setItem('sentia_perfil_resultado', JSON.stringify(registro)); } catch (e) {}
    console.log('[perfil-sentia] Registro listo (aún no se guarda en servidor):', registro);
    return registro;
  }

  // ── Retomar el test si quedó a medias ──
  // Si hay progreso guardado (al menos la pregunta base respondida), se
  // reconstruye la cola de preguntas a partir de perfilBase (no se guarda la
  // cola completa) y se muestra directo la pregunta donde se había quedado,
  // en vez de la pantalla de bienvenida.
  function restaurarProgreso() {
    const g = leerProgreso();
    if (!g) return false;
    state.perfilBase = g.perfilBase;
    state.scores = g.scores || Scoring.emptyScores();
    state.respuestas = g.respuestas || [];
    state.tags = new Set(g.tags || []);
    state.formatos = new Set(g.formatos || []);
    state.objetivos = g.objetivos || [];
    state.step = g.step || 0;
    const contextual = Q.contextual[state.perfilBase] || Q.contextual._fallback;
    state.queue = [{ tipo: 'contextual', data: contextual }].concat(Q.general.map(gq => ({ tipo: 'general', data: gq })));
    showScreen('question');
    if (state.step - 1 < state.queue.length) renderQueueStep(); else showScreen('genero');
    return true;
  }
  // Si ya habían llegado al resultado (ver RESULTADO_KEY arriba), eso manda
  // sobre un progreso de cuestionario a medias — recargar en la pantalla de
  // resultado (ej. llenando el formulario del asesor) no debe mandar de
  // vuelta a repetir las 7 preguntas.
  function restaurarResultadoGuardado() {
    const g = leerEstadoResultado();
    if (!g) return false;
    state.resultadoId = g.id;
    state.perfilBase = g.perfilBase;
    state.scores = g.scores;
    state.respuestas = g.respuestas || [];
    state.tags = new Set(g.tags || []);
    state.formatos = new Set(g.formatos || []);
    state.objetivos = g.objetivos || [];
    state.genero = g.genero;
    renderResult();
    return true;
  }
  try {
    if (!restaurarResultadoGuardado()) restaurarProgreso();
  } catch (e) {
    console.warn('[perfil-sentia] No se pudo retomar el resultado/progreso guardado:', e.message);
    limpiarProgreso();
    limpiarEstadoResultado();
  }

  // Envíos que no se confirmaron en una visita anterior (falló internet, el
  // webhook no respondió, etc.) se reintentan poco después de cargar.
  setTimeout(reintentarPendientes, 1500);
})();

/* NOTA: esta versión calcula el resultado, muestra los 6 perfiles sin agrupar,
   detecta empates, ofrece la captación opcional de lead con consentimiento, y
   deja el registro completo (incluyendo etiquetas y placeholders de WATI) listo
   en window.__ultimoResultadoSentia / sessionStorage. Falta conectar el guardado
   real (Firestore o el webhook) y el panel administrativo — fases siguientes. */

/* ── watiService (sección 15 del spec) · estructura preparada, SIN funcionalidad real ── */
window.watiService = {
  syncContactWithWati: function (user) { /* FUTURE IMPLEMENTATION */ },
  sendRecommendation: function (user, curso) { /* FUTURE IMPLEMENTATION */ },
  addWatiTags: function (user, tags) { /* FUTURE IMPLEMENTATION */ },
  sendCourseCampaign: function (audiencia, curso) { /* FUTURE IMPLEMENTATION */ }
};
