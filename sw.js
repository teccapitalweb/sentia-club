const VERSION = 'sentia-v7';
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
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if (r.ok && r.type === 'basic') {
        const clone = r.clone();
        caches.open(CACHE_RUNTIME).then(c => c.put(e.request, clone));
      }
      return r;
    })).catch(() => caches.match('./vip-auth.html'))
  );
});
