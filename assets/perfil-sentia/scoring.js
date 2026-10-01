/* ═══════════════════════════════════════════════════════════════
   PUNTUACIÓN · "Encuentra tu perfil Sentia"
   Lógica pura de cálculo, sin tocar el DOM. Recibe puntajes crudos
   y entrega perfil principal, secundario y porcentajes que suman
   exactamente 100 (método de resto mayor).
   ═══════════════════════════════════════════════════════════════ */
window.SentiaScoring = {
  codigos: ['PA', 'AC', 'DE', 'EP', 'IH', 'AP'],

  emptyScores() {
    const s = {};
    this.codigos.forEach(c => { s[c] = 0; });
    return s;
  },

  // Suma un objeto de puntos (ej. {PA:3, AC:1}) al acumulado
  addPoints(scores, points) {
    if (!points) return;
    Object.keys(points).forEach(k => { scores[k] = (scores[k] || 0) + points[k]; });
  },

  // Calcula perfil principal/secundario y porcentajes (suman 100)
  computeResult(scores) {
    const entries = this.codigos.map(c => [c, scores[c] || 0]);
    const total = entries.reduce((s, [, v]) => s + v, 0);

    const sorted = entries.slice().sort((a, b) => b[1] - a[1]);
    const principal = sorted[0][0];
    const secondary = sorted[1][0];

    // Resto mayor: reparte el 100% sin perder ni sobrar puntos por el redondeo
    let percentages = {};
    if (total <= 0) {
      this.codigos.forEach(c => { percentages[c] = 0; });
    } else {
      const partes = entries.map(([k, v]) => {
        const exacto = (v / total) * 100;
        return { k, piso: Math.floor(exacto), resto: exacto - Math.floor(exacto) };
      });
      let asignado = partes.reduce((s, p) => s + p.piso, 0);
      let faltante = 100 - asignado;
      partes.sort((a, b) => b.resto - a.resto);
      for (let i = 0; i < faltante; i++) partes[i].piso += 1;
      partes.forEach(p => { percentages[p.k] = p.piso; });
    }

    // Empate entre el 1º y 2º lugar: se muestra como "perfil combinado" en vez de
    // forzar un único ganador artificial
    const empatado = total > 0 && sorted[0][1] === sorted[1][1];

    return { principal, secondary, scores: Object.assign({}, scores), percentages, sorted, empatado };
  }
};
