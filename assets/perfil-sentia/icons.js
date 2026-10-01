/* ═══ Íconos de línea (24x24, stroke) para las tarjetas de opciones ═══ */
window.SENTIA_ICONS = {
  book: '<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6v13"/><path d="M12 6v13"/><path d="M21 6v13"/>',
  brain: '<path d="M9.5 3a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0-2 2.45v2.1a2.5 2.5 0 0 0 1 2v2.45A2.5 2.5 0 0 0 8.5 18H9"/><path d="M14.5 3a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1 2 2.45v2.1a2.5 2.5 0 0 1-1 2v2.45A2.5 2.5 0 0 1 15.5 18H15"/><path d="M9.5 3v15M14.5 3v15"/>',
  chalkboard: '<rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21l4-4 4 4"/>',
  school: '<path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10.5V16c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5.5"/>',
  pulse: '<circle cx="12" cy="12" r="9"/><path d="M7 12h2.5l1.5-4 2.5 8 1.5-4H17"/>',
  sprout: '<path d="M7 20h10"/><path d="M12 20v-7"/><path d="M12 13c0-3.5-2.5-6-6.5-6C5.5 11.5 8 13 12 13Z"/><path d="M12 11c0-4 3-7 7.5-7C19.5 8.5 16.5 11 12 11Z"/>',
  dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
  clipboard: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h6"/>',
  chat: '<path d="M21 14l-3-3H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10"/><path d="M14 15v2a1 1 0 0 1-1 1H6l-3 3V11a1 1 0 0 1 1-1h2"/>',
  tool: '<path d="M14.5 5.5a4 4 0 0 1 5.6 5.6L9 22l-4-4L16.1 6.9a4 4 0 0 1-1.6-1.4Z"/><path d="M3 21h4"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M3 16v4h4"/><path d="M21 8V4h-4"/>',
  puzzle: '<path d="M9 3h3v2.2a1.8 1.8 0 0 0 3 1.3V4h3a2 2 0 0 1 2 2v3h-2a1.8 1.8 0 0 0 0 3.6h2V16a2 2 0 0 1-2 2h-3v-2.2a1.8 1.8 0 0 0-3.6 0V18H9a2 2 0 0 1-2-2v-3h2.2a1.8 1.8 0 0 0 0-3.6H7V5a2 2 0 0 1 2-2Z"/>',
  group: '<path d="M9 7a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>',
  heart: '<path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572"/>',
  case: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-4 2 2-6 4-2Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>'
};
window.sentiaIconSvg = function (name, size) {
  size = size || 22;
  const inner = window.SENTIA_ICONS[name] || window.SENTIA_ICONS.dots;
  return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
};
