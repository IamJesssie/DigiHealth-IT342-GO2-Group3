const CACHE_NAME = 'digihealth-pwa-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', OFFLINE_URL];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((n) => (!whitelist.includes(n) ? caches.delete(n) : undefined))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((res) => res || caches.match(OFFLINE_URL)))
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notification from DigiHealth',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: { dateOfArrival: Date.now(), primaryKey: 1 }
  };
  event.waitUntil(self.registration.showNotification('DigiHealth', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(clients.openWindow('/'));
  }
});
