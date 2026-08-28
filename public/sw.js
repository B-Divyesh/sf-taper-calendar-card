const CACHE='stepdown-v2'; const SHELL=['/','/demo','/privacy','/terms','/index.html','/manifest.webmanifest','/favicon.svg','/icon-192.png','/icon-512.png','/hero.webp'].concat('__ASSETS__');
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response;}).catch(()=>caches.match('/'))));});
