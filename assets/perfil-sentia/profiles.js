/* ═══════════════════════════════════════════════════════════════
   PERFILES SENTIA · datos de los 6 perfiles del test "Encuentra tu
   perfil Sentia". Separado de la interfaz a propósito: para cambiar
   texto, recomendaciones o agregar personajes después, solo se toca
   este archivo.

   characters: { f: {image, video}, m: {image, video} } — avatar por
   sexo (el usuario elige antes de ver el resultado). Si un perfil
   todavía no tiene el avatar de un sexo listo, queda en null y la
   interfaz usa el otro sexo disponible, o el círculo con las letras
   si no hay ninguno (ver _personaje() más abajo y app.js).
   Los archivos finales viven en assets/perfil-sentia/avatars/ —
   los originales que se van agregando se sueltan primero en
   assets/perfil-sentia/avatars-raw/ (ver LEEME.txt ahí).
   ═══════════════════════════════════════════════════════════════ */
window.SENTIA_PROFILES = {
  PA: {
    code: 'PA',
    name: 'Psicólogo Aplicado',
    tagline: 'Aprendes mejor cuando puedes llevar el conocimiento a la práctica.',
    description: 'Buscas situaciones reales: intervención, casos clínicos, simuladores y herramientas que puedas usar desde la primera sesión. El conocimiento te sirve cuando se convierte en acción.',
    dominantFocus: 'Intervención + aplicación práctica',
    learningStyle: 'Práctico e interactivo',
    conecta: ['Casos clínicos', 'Role-play', 'Simuladores', 'Herramientas de intervención'],
    recommendations: ['Role-play terapéutico', 'Casos clínicos interactivos', 'Simuladores de intervención', 'Guías de consulta aplicables'],
    growthLabel: 'Intervención y casos prácticos',
    cursoRecomendado: 'auxilios',
    characters: {
      f: { image: 'assets/perfil-sentia/avatars/PA-f.png', video: { src: 'assets/perfil-sentia/avatars/PA-f.mp4', bgColor: [244, 238, 232] } },
      m: { image: 'assets/perfil-sentia/avatars/PA-m.png' }
    }
  },
  AC: {
    code: 'AC',
    name: 'Analítico Clínico',
    tagline: 'Necesitas entender el porqué antes de actuar.',
    description: 'Disfrutas comprender qué está ocurriendo: evaluar, diagnosticar y analizar cada situación con profundidad antes de decidir un camino. El detalle y el criterio clínico te dan seguridad.',
    dominantFocus: 'Evaluación + diagnóstico diferencial',
    learningStyle: 'Analítico y reflexivo',
    conecta: ['Diagnóstico diferencial', 'Análisis de caso', 'Evaluación psicológica', 'Criterio clínico'],
    recommendations: ['Diagnóstico diferencial aplicado', 'Casos de evaluación paso a paso', 'Análisis de instrumentos psicométricos', 'Razonamiento clínico avanzado'],
    growthLabel: 'Evaluación y análisis de casos',
    cursoRecomendado: 'custodia',
    characters: {
      f: { image: 'assets/perfil-sentia/avatars/AC-f.png' },
      m: { image: 'assets/perfil-sentia/avatars/AC-m.png' }
    }
  },
  DE: {
    code: 'DE',
    name: 'Docente Estratégico',
    tagline: 'Aprendes para poder enseñar y acompañar mejor a otros.',
    description: 'Buscas herramientas de enseñanza, acompañamiento, inclusión y manejo de situaciones educativas reales. Te interesa lo que puedas llevar directo al aula o a tu espacio de trabajo.',
    dominantFocus: 'Enseñanza + acompañamiento',
    learningStyle: 'Estratégico y aplicable',
    conecta: ['Manejo de aula', 'Inclusión educativa', 'Estrategias de enseñanza', 'Acompañamiento socioemocional'],
    recommendations: ['Estrategias de manejo de aula', 'Inclusión educativa en la práctica', 'Herramientas para dificultades de aprendizaje', 'Salud mental en el entorno escolar'],
    growthLabel: 'Enseñanza y manejo de grupos',
    cursoRecomendado: 'auxilios',
    characters: {
      f: { image: 'assets/perfil-sentia/avatars/DE-f.png' },
      m: { image: 'assets/perfil-sentia/avatars/DE-m.png' }
    }
  },
  EP: {
    code: 'EP',
    name: 'Explorador Profesional',
    tagline: 'Te mueve la curiosidad por descubrir nuevas áreas.',
    description: 'Tienes interés por diferentes temas y te gusta ampliar tu panorama antes de especializarte. Disfrutas explorar especialidades y conectar ideas de distintas áreas.',
    dominantFocus: 'Exploración + ampliación de panorama',
    learningStyle: 'Curioso y exploratorio',
    conecta: ['Nuevas especialidades', 'Temas emergentes', 'Perspectivas interdisciplinarias', 'Introducción a áreas nuevas'],
    recommendations: ['Panorama de especialidades en psicología', 'Introducción a nuevas áreas de práctica', 'Tendencias emergentes en salud mental', 'Rutas de especialización'],
    growthLabel: 'Explorar nuevas especialidades',
    cursoRecomendado: 'custodia',
    characters: {
      f: { image: 'assets/perfil-sentia/avatars/EP-f.png' },
      m: { image: 'assets/perfil-sentia/avatars/EP-m.png' }
    }
  },
  IH: {
    code: 'IH',
    name: 'Impulsor Humano',
    tagline: 'Te interesa el bienestar y el desarrollo de las personas, empezando por ti.',
    description: 'Te mueve todo lo relacionado con emociones, comunicación, bienestar y crecimiento humano. Buscas comprenderte mejor para poder acompañar mejor a los demás.',
    dominantFocus: 'Bienestar + desarrollo humano',
    learningStyle: 'Reflexivo y emocional',
    conecta: ['Manejo emocional', 'Autoconocimiento', 'Comunicación consciente', 'Bienestar integral'],
    recommendations: ['Manejo de ansiedad y estrés', 'Comunicación consciente', 'Autoconocimiento aplicado', 'Hábitos y motivación'],
    growthLabel: 'Bienestar y comunicación socioemocional',
    cursoRecomendado: 'auxilios',
    characters: {
      f: { image: 'assets/perfil-sentia/avatars/IH-f.png' },
      m: { image: 'assets/perfil-sentia/avatars/IH-m.png' }
    }
  },
  AP: {
    code: 'AP',
    name: 'Actualización Profesional',
    tagline: 'Buscas mantenerte vigente y fortalecer tu perfil constantemente.',
    description: 'Te interesa capacitarte, certificarte y adquirir nuevos conocimientos que fortalezcan tu perfil profesional. Ver tu progreso y tu crecimiento te motiva a seguir aprendiendo.',
    dominantFocus: 'Capacitación + certificación continua',
    learningStyle: 'Estructurado y orientado a resultados',
    conecta: ['Certificaciones', 'Actualización de conocimientos', 'Clases con especialistas', 'Crecimiento profesional'],
    recommendations: ['Certificaciones con folio verificable', 'Clases en vivo con especialistas', 'Actualización en temas vigentes', 'Rutas de crecimiento profesional'],
    growthLabel: 'Actualización y certificación',
    cursoRecomendado: 'laboral',
    characters: {
      f: { image: 'assets/perfil-sentia/avatars/AP-f.png' },
      m: { image: 'assets/perfil-sentia/avatars/AP-m.png' }
    }
  }
};

/* Devuelve el avatar a mostrar para un perfil + sexo elegido, con respaldo:
   si el sexo preferido no está listo todavía, usa el otro si existe;
   si ninguno existe, regresa null (la interfaz cae al círculo con letras). */
window.sentiaGetCharacter = function (profileCode, genero) {
  const p = window.SENTIA_PROFILES[profileCode];
  if (!p || !p.characters) return null;
  return p.characters[genero] || p.characters[genero === 'f' ? 'm' : 'f'] || null;
};

/* Frase combinada cuando el 1º y 2º lugar quedan empatados (sección 2 del spec).
   Clave: los dos códigos ordenados alfabéticamente y unidos con "_" (ej. "AC_PA"),
   así no importa en qué orden lleguen principal/secundario. */
window.SENTIA_COMBINED_TAGLINES = {
  'AC_PA': 'Combinas una orientación práctica con una fuerte capacidad analítica.',
  'DE_PA': 'Combinas la aplicación práctica con la vocación de enseñar y acompañar.',
  'EP_PA': 'Combinas la aplicación práctica con la curiosidad por explorar nuevas áreas.',
  'IH_PA': 'Combinas la aplicación práctica con una fuerte sensibilidad humana.',
  'AP_PA': 'Combinas la aplicación práctica con el interés por mantenerte actualizado/a.',
  'AC_DE': 'Combinas el análisis profundo con la vocación de enseñar y acompañar.',
  'AC_EP': 'Combinas el análisis profundo con la curiosidad por explorar nuevas áreas.',
  'AC_IH': 'Combinas el análisis profundo con una fuerte sensibilidad humana.',
  'AC_AP': 'Combinas el análisis profundo con el interés por mantenerte actualizado/a.',
  'DE_EP': 'Combinas la vocación de enseñar con la curiosidad por explorar nuevas áreas.',
  'DE_IH': 'Combinas la vocación de enseñar con una fuerte sensibilidad humana.',
  'AP_DE': 'Combinas la vocación de enseñar con el interés por mantenerte actualizado/a.',
  'EP_IH': 'Combinas la curiosidad por explorar con una fuerte sensibilidad humana.',
  'AP_EP': 'Combinas la curiosidad por explorar con el interés por mantenerte actualizado/a.',
  'AP_IH': 'Combinas la sensibilidad humana con el interés por mantenerte actualizado/a.'
};

/* Catálogo real: se trae de sentiamx.com/assets/cursos.json, la misma
   fuente que ya usan las tarjetas del landing y el chat de Nora — antes
   estaba copiado a mano aquí también y se desincronizaba (pasó con el
   precio). cursoRecomendado en cada perfil apunta aquí por id — ajusta
   esa asignación cuando haya más cursos o un mapeo curso↔perfil más
   preciso; hoy es la mejor coincidencia por tema, no una elección
   validada con el equipo.
   window.SENTIA_CURSOS empieza vacío y se llena solo cuando el fetch
   resuelve; app.js ya maneja con calma el caso de que un curso no
   exista todavía (oculta la tarjeta "siguiente paso" en vez de tronar) —
   como el resultado se ve varios segundos después de abrir la página
   (7 preguntas + género), en la práctica siempre está listo a tiempo. */
window.SENTIA_CURSOS = {};
fetch('https://sentiamx.com/assets/cursos.json')
  .then(r => r.json())
  .then(d => {
    (d.cursos || []).forEach(c => {
      window.SENTIA_CURSOS[c.id] = {
        titulo: c.titulo,
        area: c.area,
        descripcion: c.resumen,
        url: 'https://sentiamx.com/index.html#' + c.anchor,
        gratis: !!c.gratis
      };
    });
  })
  .catch(e => console.warn('[perfil-sentia] No se pudo cargar el catálogo de cursos:', e.message));

/* Etiquetas legibles para "formatos_preferidos" (sección 5/6 del spec) */
window.SENTIA_FORMATOS_LABELS = {
  casos_practicos: 'Casos prácticos',
  analisis: 'Análisis profundo',
  aprendizaje_practico: 'Aprendizaje aplicable',
  exploracion: 'Exploración de temas nuevos',
  reflexion: 'Ejercicios de reflexión',
  actualizacion: 'Actualización y certificación'
};
