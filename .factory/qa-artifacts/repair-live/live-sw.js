const CACHE = 'stepdown-v3';
const SHELL = ['/', '/demo', '/privacy', '/terms', '/index.html', '/404.html', '/404.css', '/manifest.webmanifest', '/favicon.svg', '/icon-180.png', '/icon-192.png', '/icon-512.png', '/hero.webp'].concat(["/assets/index-DRYw2-RC.js","/assets/index-DnrWqz1c.css"]);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const oldCaches = (await caches.keys()).filter(name => name !== CACHE);
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    await self.clients.claim();
    if (oldCaches.length) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
    }
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(async () => (await caches.match(url.pathname)) || (await caches.match('/'))));
    return;
  }
  event.respondWith(caches.match(url.pathname, { ignoreSearch: true }).then(cached => cached || fetch(event.request)));
});
