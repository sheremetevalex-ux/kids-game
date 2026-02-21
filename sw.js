const CACHE_VERSION = 'kind-city-cache-v1.0.0';
const APP_SHELL = './index.html';

const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './sw.js',
  './src/main.js',
  './src/router.js',
  './src/state.js',
  './src/ui.js',
  './src/audio.js',
  './src/storage.js',
  './src/data.js',
  './src/engine/canvas.js',
  './src/engine/sprites.js',
  './src/engine/particles.js',
  './src/engine/input.js',
  './src/scenes/start.js',
  './src/scenes/map.js',
  './src/scenes/episode_select.js',
  './src/scenes/episode_runner.js',
  './src/scenes/reward.js',
  './src/scenes/settings_parent.js',
  './src/scenes/stickers.js',
  './src/scenes/episodes/index.js',
  './src/scenes/episodes/common.js',
  './src/scenes/episodes/home_routine.js',
  './src/scenes/episodes/home_tidy.js',
  './src/scenes/episodes/home_kind_words.js',
  './src/scenes/episodes/park_turn_slide.js',
  './src/scenes/episodes/park_lost_toy.js',
  './src/scenes/episodes/park_picnic_share.js',
  './src/scenes/episodes/shop_color_shape.js',
  './src/scenes/episodes/shop_queue_kindness.js',
  './src/scenes/episodes/shop_bag_sort.js',
  './src/scenes/episodes/play_sandcastle_puzzle.js',
  './src/scenes/episodes/play_swing_turns.js',
  './src/scenes/episodes/play_cross_street.js',
  './src/scenes/episodes/work_fix_birdhouse.js',
  './src/scenes/episodes/work_tool_match.js',
  './src/scenes/episodes/work_help_delivery.js',
  './src/scenes/episodes/calm_balloon_breath.js',
  './src/scenes/episodes/calm_cloud_count.js',
  './src/scenes/episodes/calm_heart_hug.js',
  './assets/img/icon-180.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/svg/logo.svg',
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

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.status === 200) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await cache.match(request);
    return cached || cache.match(APP_SHELL);
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
    event.respondWith(networkFirst(APP_SHELL));
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(cacheFirst(request));
});
