const CACHE_NAME = 'agent-quest-tw-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isAppShellOrCode(req, url) {
  if (req.mode === 'navigate') return true;
  const p = url.pathname;
  return (
    p.endsWith('/') ||
    p.endsWith('.html') ||
    p.endsWith('.js') ||
    p.endsWith('.css') ||
    p.endsWith('.webmanifest')
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Skip cross-origin video/analytics requests so YouTube embeds stream cleanly
  if (url.origin !== self.location.origin) return;

  // Network-First for HTML/JS/CSS/manifest so mobile PWA always gets latest content when online
  if (isAppShellOrCode(req, url)) {
    event.respondWith(
      (req.mode === 'navigate' ? fetch(req) : fetch(req, { cache: 'no-cache' }))
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => {
            if (cached) return cached;
            if (req.mode === 'navigate') {
              return caches.match('./index.html').then((idx) => idx || caches.match('./'));
            }
            return undefined;
          })
        )
    );
    return;
  }

  // Cache-First for static images & icons
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});

