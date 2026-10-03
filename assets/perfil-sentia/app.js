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
    resultado: null,  // se llena al terminar el test
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
    state.resultado = null;
    state.history = [];
    resetLeadBox();
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
        if (state.step - 1 < state.queue.length) {
          renderQueueStep();
        } else {
          runAnalysis();
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
  function renderResult() {
    const resultado = Scoring.computeResult(state.scores);
    const principal = PROFILES[resultado.principal];
    const secundario = PROFILES[resultado.secondary];

    const badgeEl = document.getElementById('res-code');
    const avatarWrap = document.getElementById('res-avatar-wrap');
    if (principal.characterVideo && principal.characterImage && window.SentiaAvatarPlayer) {
      badgeEl.style.display = 'none';
      avatarWrap.style.display = '';
      if (avatarWrap.dataset.mounted !== principal.code) {
        avatarWrap.dataset.mounted = principal.code;
        window.SentiaAvatarPlayer.mount(avatarWrap, {
          imageSrc: principal.characterImage,
          videoSrc: principal.characterVideo.src,
          bgColor: principal.characterVideo.bgColor
        });
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

    // Mostrar los 6 perfiles individualmente (nunca agrupar "otros" como si fuera uno más).
    // Top 3 destacados, los otros 3 en versión reducida.
    const ordenados = resultado.sorted; // [[codigo, puntaje], ...] desc
    const bars = document.getElementById('res-bars');
    bars.innerHTML = ordenados.map(([codigo], i) => {
      const p = PROFILES[codigo];
      const pct = resultado.percentages[codigo];
      const clase = i < 3 ? 'res-bar res-bar--top' : 'res-bar res-bar--rest';
      return '<div class="' + clase + '"><div class="res-bar__head"><span>' + codigo + ' — ' + p.name + '</span><b>' + pct + '%</b></div>' +
        '<div class="res-bar__track"><i style="width:' + pct + '%"></i></div></div>';
    }).join('');

    document.getElementById('res-conecta').innerHTML = principal.conecta.map(t => '<span class="chip">' + t + '</span>').join('');
    document.getElementById('res-recos').innerHTML = principal.recommendations.map(t => '<li>' + t + '</li>').join('');

    state.resultado = resultado;
    resetLeadBox();
    const registro = armarRegistro(); // deja window.__ultimoResultadoSentia listo, sin datos de contacto todavía
    guardarResultadoEnServidor(registro);
    showScreen('result');
  }

  // Guarda el resultado anónimo apenas está listo (sección 20: el resultado
  // existe aunque el usuario nunca deje datos de contacto). Nunca bloquea la
  // interfaz: si el servidor aún no tiene la ruta desplegada, solo se avisa
  // en consola y el usuario sigue viendo su resultado con normalidad.
  function guardarResultadoEnServidor(registro) {
    fetch(WEBHOOK_URL + '/api/perfil-sentia/resultado', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registro)
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      console.log('[perfil-sentia] Resultado guardado en el servidor.');
    }).catch(e => console.warn('[perfil-sentia] No se pudo guardar en el servidor (¿ruta aún no desplegada?):', e.message));
  }

  function guardarContactoEnServidor(id, contacto) {
    fetch(WEBHOOK_URL + '/api/perfil-sentia/' + encodeURIComponent(id) + '/contacto', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contacto)
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      console.log('[perfil-sentia] Contacto guardado en el servidor.');
    }).catch(e => console.warn('[perfil-sentia] No se pudo guardar el contacto (¿ruta aún no desplegada?):', e.message));
  }

  // ── Captación de lead (secciones 3, 4, 16 del spec) ──
  function resetLeadBox() {
    document.getElementById('lead-ask').style.display = '';
    document.getElementById('lead-form').style.display = 'none';
    document.getElementById('lead-done').style.display = 'none';
    ['lead-nombre', 'lead-whatsapp', 'lead-correo'].forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('lead-consent').checked = false;
  }

  document.getElementById('lead-yes').addEventListener('click', () => {
    document.getElementById('lead-ask').style.display = 'none';
    document.getElementById('lead-form').style.display = '';
  });
  document.getElementById('lead-no').addEventListener('click', () => {
    document.getElementById('lead-ask').style.display = 'none';
  });
  document.getElementById('lead-save').addEventListener('click', () => {
    const nombre = document.getElementById('lead-nombre').value.trim();
    const whatsapp = document.getElementById('lead-whatsapp').value.trim();
    const correo = document.getElementById('lead-correo').value.trim();
    const acepta = document.getElementById('lead-consent').checked;
    if (!nombre || !whatsapp) { alert('Escribe tu nombre y tu WhatsApp para continuar.'); return; }
    if (!acepta) { alert('Necesitamos tu autorización para poder escribirte.'); return; }

    const registro = armarRegistro({
      nombre, telefono: whatsapp, correo: correo || null,
      acepta_comunicaciones: true,
      fecha_consentimiento: new Date().toISOString()
    });
    guardarContactoEnServidor(registro.id, { nombre, telefono: whatsapp, correo: correo || null, acepta_comunicaciones: true });

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
      id: (window.__ultimoResultadoSentia && window.__ultimoResultadoSentia.id) || ('sentia-' + Date.now().toString(36)),
      fecha: new Date().toISOString(),
      source: 'perfil_sentia',

      perfil_base: state.perfilBase,
      perfil_principal: resultado.principal,
      perfil_secundario: resultado.secondary,
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
