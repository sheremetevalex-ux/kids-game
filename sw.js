const CACHE_VERSION = 'kids-game-v3.0.0';

const PRECACHE = [
  './',
  './index.html',
  './index.html?v=20260221f',
  './styles.css',
  './styles.css?v=20260221f',
  './src/main.js',
  './src/main.js?v=20260221f',
  './manifest.webmanifest',
  './sw.js',
  './assets/img/icon-180.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/svg/bluey.svg',
  './assets/svg/bingo.svg',
  './assets/svg/logo.svg',
  './assets/audio/bg-loop.wav',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
          return null;
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function networkFirst(request, fallbackToIndex = false) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.status === 200) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    if (fallbackToIndex) {
      return cache.match('./index.html');
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  const fresh = await fetch(request);
  if (fresh && fresh.status === 200) {
    cache.put(request, fresh.clone());
  }
  return fresh;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, true));
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  const networkFirstExt = ['.js', '.css', '.html', '.webmanifest', '.wav'];
  const useNetworkFirst = networkFirstExt.some((ext) => url.pathname.endsWith(ext));
  event.respondWith(useNetworkFirst ? networkFirst(request) : cacheFirst(request));
});
