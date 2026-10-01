/* ═══════════════════════════════════════════════════════════════
   PREGUNTAS · "Encuentra tu perfil Sentia"
   Separado de la interfaz para poder editar preguntas, opciones y
   puntajes sin tocar el código de la pantalla.

   Estructura:
   - base: primera pregunta, siempre igual para todos. Determina
     perfil_base y qué pregunta contextual se muestra después.
   - contextual: una pregunta distinta según la respuesta de "base".
   - general: 5 preguntas que se muestran a todos por igual.

   Cada opción de contextual/general trae:
   - points: cuánto suma a cada código de perfil (PA, AC, DE, EP, IH, AP)
   - tags: etiquetas internas que se guardan en el registro (sección 6)
   - formato: el formato de aprendizaje que representa esa opción
     (se usa para "formatos_preferidos" en el registro guardado)
   La opción de "base" no suma puntos ni formato, solo decide la ruta
   condicional y aporta su propia etiqueta (perfil_base).
   ═══════════════════════════════════════════════════════════════ */
window.SENTIA_QUESTIONS = {

  base: {
    id: 'base',
    text: '¿Cuál de estas opciones te representa mejor?',
    options: [
      { label: 'Estudio Psicología',            value: 'estudiante', icon: 'book',       tag: 'estudiante' },
      { label: 'Soy psicólogo/a',                value: 'psicologo',  icon: 'brain',      tag: 'psicologo' },
      { label: 'Soy docente',                    value: 'docente',    icon: 'chalkboard', tag: 'docente' },
      { label: 'Trabajo en educación',           value: 'educacion',  icon: 'school',     tag: 'educacion' },
      { label: 'Soy profesional de salud',       value: 'salud',      icon: 'pulse',      tag: 'salud' },
      { label: 'Busco crecimiento personal',     value: 'personal',   icon: 'sprout',     tag: 'crecimiento_personal' },
      { label: 'Otro',                           value: 'otro',       icon: 'dots',       tag: 'otro' }
    ]
  },

  // Mensaje breve mostrado justo antes de la pregunta contextual, según perfil_base
  contextMessage: {
    psicologo:  'Perfecto. Vamos a conocer un poco más sobre tu forma de trabajar.',
    docente:    'Perfecto. Vamos a conocer qué herramientas pueden ayudarte más.',
    educacion:  'Perfecto. Vamos a conocer qué herramientas pueden ayudarte más.',
    estudiante: 'Genial. Vamos a descubrir qué tipo de aprendizaje conecta más contigo.',
    salud:      'Perfecto. Vamos a conocer un poco más sobre ti.',
    personal:   'Perfecto. Vamos a conocer un poco más sobre ti.',
    otro:       'Perfecto. Vamos a conocer un poco más sobre ti.'
  },

  // Pregunta contextual: una por cada valor posible de "base".
  // docente/educacion comparten la misma; salud/otro comparten un fallback genérico.
  contextual: {
    psicologo: {
      text: '¿Qué te gustaría fortalecer más en tu práctica?',
      options: [
        { label: 'Intervención clínica',          icon: 'target',    points: { PA: 3, AC: 1 }, tags: ['intervencion'],              formato: 'casos_practicos' },
        { label: 'Evaluación y diagnóstico',       icon: 'clipboard', points: { AC: 3 },        tags: ['diagnostico'],                formato: 'analisis' },
        { label: 'Comunicación terapéutica',       icon: 'chat',      points: { IH: 2, DE: 1 }, tags: ['comunicacion_terapeutica'],   formato: 'reflexion' },
        { label: 'Herramientas para consulta',     icon: 'tool',      points: { DE: 2, PA: 2 }, tags: ['herramientas_consulta'],      formato: 'aprendizaje_practico' },
        { label: 'Actualización profesional',      icon: 'refresh',   points: { AP: 3 },        tags: ['actualizacion_profesional'],  formato: 'actualizacion' }
      ]
    },
    docente: {
      text: '¿Qué reto aparece más en tu día a día?',
      options: [
        { label: 'Dificultades de aprendizaje',    icon: 'puzzle',    points: { DE: 3, AC: 1 }, tags: ['dificultades_aprendizaje'],   formato: 'analisis' },
        { label: 'Manejo de aula',                  icon: 'group',     points: { DE: 3 },        tags: ['manejo_aula'],                formato: 'aprendizaje_practico' },
        { label: 'Inclusión educativa',             icon: 'heart',     points: { DE: 2, IH: 2 }, tags: ['inclusion_educativa'],        formato: 'reflexion' },
        { label: 'Salud mental de estudiantes',     icon: 'pulse',     points: { IH: 3, DE: 1 }, tags: ['salud_mental', 'educacion'],  formato: 'reflexion' },
        { label: 'Estrategias de enseñanza',        icon: 'book',      points: { DE: 3, AP: 1 }, tags: ['estrategias_ensenanza'],      formato: 'aprendizaje_practico' }
      ]
    },
    estudiante: {
      text: '¿Qué te gustaría reforzar primero?',
      options: [
        { label: 'Comprender mejor la teoría',               icon: 'book',    points: { AC: 3 },        tags: ['teoria'],                     formato: 'analisis' },
        { label: 'Aprender mediante casos',                   icon: 'case',    points: { PA: 3 },        tags: ['casos_clinicos'],             formato: 'casos_practicos' },
        { label: 'Prepararme para la práctica profesional',   icon: 'target',  points: { PA: 2, AP: 2 }, tags: ['practica_profesional'],       formato: 'aprendizaje_practico' },
        { label: 'Explorar especialidades',                   icon: 'compass', points: { EP: 3 },        tags: ['especialidades'],             formato: 'exploracion' },
        { label: 'Aprender herramientas aplicables',          icon: 'tool',    points: { DE: 2, PA: 2 }, tags: ['aprendizaje_practico'],       formato: 'aprendizaje_practico' }
      ]
    },
    personal: {
      text: '¿Qué te gustaría trabajar más?',
      options: [
        { label: 'Manejo emocional',       icon: 'heart',   points: { IH: 3 },        tags: ['manejo_emocional', 'salud_mental'], formato: 'reflexion' },
        { label: 'Ansiedad y estrés',       icon: 'pulse',   points: { IH: 3 },        tags: ['ansiedad_estres', 'salud_mental'], formato: 'reflexion' },
        { label: 'Comunicación',            icon: 'chat',    points: { IH: 2, DE: 1 }, tags: ['comunicacion'],                    formato: 'reflexion' },
        { label: 'Autoconocimiento',        icon: 'sprout',  points: { IH: 3 },        tags: ['autoconocimiento'],                formato: 'reflexion' },
        { label: 'Hábitos y motivación',    icon: 'refresh', points: { IH: 2, AP: 1 }, tags: ['habitos_motivacion'],              formato: 'actualizacion' }
      ]
    },
    // Fallback genérico para "Soy profesional de salud" y "Otro" (el spec no define
    // una pregunta propia para estos dos casos)
    _fallback: {
      text: '¿Qué te gustaría explorar más dentro de Sentia?',
      options: [
        { label: 'Herramientas aplicables a mi área',   icon: 'tool',    points: { DE: 2, PA: 2 }, tags: ['herramientas_aplicables'], formato: 'aprendizaje_practico' },
        { label: 'Nuevas especialidades',                icon: 'compass', points: { EP: 3 },        tags: ['especialidades'],          formato: 'exploracion' },
        { label: 'Bienestar y desarrollo personal',       icon: 'heart',   points: { IH: 3 },        tags: ['salud_mental'],            formato: 'reflexion' },
        { label: 'Actualización de conocimientos',        icon: 'refresh', points: { AP: 3 },        tags: ['actualizacion_profesional'], formato: 'actualizacion' }
      ]
    }
  },

  // 5 preguntas generales, iguales para todos
  general: [
    {
      text: 'Tienes una hora libre para aprender algo nuevo. ¿Qué elegirías?',
      options: [
        { label: 'Resolver un caso real',                         icon: 'case',    points: { PA: 3, AC: 1 }, tags: ['casos_clinicos'],            formato: 'casos_practicos' },
        { label: 'Analizar qué está ocurriendo y por qué',         icon: 'search',  points: { AC: 3, PA: 1 }, tags: ['diagnostico'],               formato: 'analisis' },
        { label: 'Aprender una estrategia que pueda aplicar',      icon: 'tool',    points: { DE: 3, PA: 1 }, tags: ['aprendizaje_practico'],      formato: 'aprendizaje_practico' },
        { label: 'Explorar un tema completamente nuevo',           icon: 'compass', points: { EP: 3, AP: 1 }, tags: ['especialidades'],            formato: 'exploracion' },
        { label: 'Trabajar algo relacionado con emociones',        icon: 'heart',   points: { IH: 3 },        tags: ['salud_mental'],              formato: 'reflexion' },
        { label: 'Tomar una actualización profesional',            icon: 'refresh', points: { AP: 3, EP: 1 }, tags: ['actualizacion_profesional'], formato: 'actualizacion' }
      ]
    },
    {
      text: '¿Cuándo sientes que realmente aprendiste algo?',
      options: [
        { label: 'Cuando puedo aplicarlo inmediatamente',          icon: 'target',  points: { PA: 3, DE: 1 }, tags: ['aprendizaje_practico'], formato: 'aprendizaje_practico' },
        { label: 'Cuando comprendo el porqué',                     icon: 'brain',   points: { AC: 3 },        tags: ['teoria'],               formato: 'analisis' },
        { label: 'Cuando tengo una herramienta lista para usar',   icon: 'tool',    points: { DE: 3, PA: 1 }, tags: ['herramientas_practicas'], formato: 'aprendizaje_practico' },
        { label: 'Cuando descubro algo nuevo',                     icon: 'compass', points: { EP: 3 },        tags: ['especialidades'],       formato: 'exploracion' },
        { label: 'Cuando puedo ayudar mejor a otras personas',     icon: 'group',   points: { IH: 3, PA: 1 }, tags: ['acompanamiento'],       formato: 'reflexion' },
        { label: 'Cuando siento que crecí profesionalmente',       icon: 'refresh', points: { AP: 3 },        tags: ['actualizacion_profesional'], formato: 'actualizacion' }
      ]
    },
    {
      text: '¿Qué tipo de experiencia te atrapa más?',
      options: [
        { label: 'Casos interactivos',       icon: 'case',    points: { PA: 3 },        tags: ['casos_clinicos'], formato: 'casos_practicos' },
        { label: 'Análisis profundo',         icon: 'search',  points: { AC: 3 },        tags: ['diagnostico'],    formato: 'analisis' },
        { label: 'Actividades aplicables',    icon: 'tool',    points: { DE: 3, PA: 1 }, tags: ['aprendizaje_practico'], formato: 'aprendizaje_practico' },
        { label: 'Exploración de nuevos temas', icon: 'compass', points: { EP: 3 },      tags: ['especialidades'], formato: 'exploracion' },
        { label: 'Ejercicios de reflexión',   icon: 'heart',   points: { IH: 3 },        tags: ['autoconocimiento'], formato: 'reflexion' },
        { label: 'Clases con especialistas',  icon: 'refresh', points: { AP: 3, EP: 1 }, tags: ['actualizacion_profesional'], formato: 'actualizacion' }
      ]
    },
    {
      text: 'Si pudieras elegir el formato de tu próxima sesión de aprendizaje, ¿cuál sería?',
      options: [
        { label: 'Un caso clínico para resolver paso a paso',      icon: 'case',    points: { PA: 3, AC: 1 }, tags: ['casos_clinicos'],   formato: 'casos_practicos' },
        { label: 'Un análisis detallado de un diagnóstico',        icon: 'clipboard', points: { AC: 3 },      tags: ['diagnostico'],      formato: 'analisis' },
        { label: 'Una guía práctica que pueda usar ya',            icon: 'tool',    points: { DE: 3, PA: 1 }, tags: ['aprendizaje_practico'], formato: 'aprendizaje_practico' },
        { label: 'Un recorrido por un tema que no conozco',        icon: 'compass', points: { EP: 3 },        tags: ['especialidades'],   formato: 'exploracion' },
        { label: 'Un espacio para entender mis propias emociones', icon: 'heart',   points: { IH: 3 },        tags: ['autoconocimiento'], formato: 'reflexion' },
        { label: 'Una certificación que sume a mi perfil',         icon: 'refresh', points: { AP: 3 },        tags: ['actualizacion_profesional'], formato: 'actualizacion' }
      ]
    },
    {
      text: '¿Qué te gustaría sentir al terminar tu formación en Sentia?',
      options: [
        { label: 'Que puedo resolver situaciones reales con confianza', icon: 'target', points: { PA: 3 }, tags: ['intervencion'],  formato: 'casos_practicos' },
        { label: 'Que entiendo a fondo lo que hago y por qué',          icon: 'brain',  points: { AC: 3 }, tags: ['diagnostico'],   formato: 'analisis' },
        { label: 'Que tengo mejores herramientas para enseñar o guiar', icon: 'tool',   points: { DE: 3 }, tags: ['herramientas_practicas'], formato: 'aprendizaje_practico' },
        { label: 'Que descubrí algo que no sabía que me interesaba',    icon: 'compass',points: { EP: 3 }, tags: ['especialidades'], formato: 'exploracion' },
        { label: 'Que me conozco y gestiono mejor',                     icon: 'heart',  points: { IH: 3 }, tags: ['autoconocimiento'], formato: 'reflexion' },
        { label: 'Que estoy más actualizado/a que antes',                icon: 'refresh',points: { AP: 3 }, tags: ['actualizacion_profesional'], formato: 'actualizacion' }
      ]
    }
  ]
};
