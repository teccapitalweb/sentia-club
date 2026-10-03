/* ═══════════════════════════════════════════════════════════════
   PERFILES SENTIA · datos de los 6 perfiles del test "Encuentra tu
   perfil Sentia". Separado de la interfaz a propósito: para cambiar
   texto, recomendaciones o agregar personajes después, solo se toca
   este archivo.
   characterImage queda en null a propósito — se preparó el campo
   para una versión futura con ilustraciones por perfil, pero en
   esta versión no se genera ni se usa ninguna imagen.
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
    // PRUEBA: primer avatar real para este perfil (PNG con transparencia real,
    // generado y recortado con Canva) + video (clic para reproducir, quieto por
    // defecto). El fondo del video se quita en vivo con chroma key, ver
    // avatar-player.js — bgColor es el color plano detectado en ese clip.
    characterImage: 'assets/perfil-sentia/avatar-pa-prueba.png',
    characterVideo: { src: 'assets/perfil-sentia/avatar-pa-prueba.mp4', bgColor: [244, 238, 232] }
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
    characterImage: null
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
    characterImage: null
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
    characterImage: null
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
    characterImage: null
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
    characterImage: null
  }
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

/* Etiquetas legibles para "formatos_preferidos" (sección 5/6 del spec) */
window.SENTIA_FORMATOS_LABELS = {
  casos_practicos: 'Casos prácticos',
  analisis: 'Análisis profundo',
  aprendizaje_practico: 'Aprendizaje aplicable',
  exploracion: 'Exploración de temas nuevos',
  reflexion: 'Ejercicios de reflexión',
  actualizacion: 'Actualización y certificación'
};
