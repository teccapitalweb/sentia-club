// Estrategia:
//  - HTML (navegaciones): RED PRIMERO. Cada despliegue se ve de inmediato; si no
//    hay conexión, se usa la copia en caché (modo offline).
//  - Otros recursos (css, imágenes): CACHÉ PRIMERO (rápido), con respaldo de red.
// Sube VERSION al cambiar archivos del shell para limpiar cachés viejas.
const VERSION = 'sentia-v10-net-first';
const CACHE_SHELL = VERSION + '-shell';
const CACHE_RUNTIME = VERSION + '-runtime';

const SHELL_FILES = [
  './',
  'vip-auth.html',
  'vip-panel.html',
  'vip-admin.html',
  'mobile.css',
  'assets/icon-sentia.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_SHELL).then(c => c.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_SHELL && k !== CACHE_RUNTIME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function esHTML(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // HTML: siempre intenta la red primero para no servir páginas viejas.
  if (esHTML(e.request)) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok && r.type === 'basic') {
          const clone = r.clone();
          caches.open(CACHE_SHELL).then(c => c.put(e.request, clone));
        }
        return r;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('./vip-auth.html')))
    );
    return;
  }

  // Resto de recursos: caché primero, con respaldo de red.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if (r.ok && r.type === 'basic') {
        const clone = r.clone();
        caches.open(CACHE_RUNTIME).then(c => c.put(e.request, clone));
      }
      return r;
    }))
  );
});
