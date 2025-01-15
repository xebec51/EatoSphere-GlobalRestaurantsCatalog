importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({
  debug: false,
});

const { registerRoute, setCatchHandler } = workbox.routing;
const { StaleWhileRevalidate, NetworkFirst, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

// Cache daftar restoran dengan strategi StaleWhileRevalidate
registerRoute(
  ({ url }) => url.href.includes('https://restaurant-api.dicoding.dev/list'),
  new StaleWhileRevalidate({
    cacheName: 'restaurant-list',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// Cache detail restoran dengan strategi NetworkFirst
registerRoute(
  ({ url }) => url.href.includes('https://restaurant-api.dicoding.dev/detail/'),
  new NetworkFirst({
    cacheName: 'restaurant-detail',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// Cache gambar restoran dengan strategi CacheFirst
registerRoute(
  ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/images/'),
  new CacheFirst({
    cacheName: 'restaurant-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// Cache static assets (CSS, JS, manifest) dengan StaleWhileRevalidate
registerRoute(
  ({ request }) => ['style', 'script', 'manifest'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
  })
);

// Cache halaman utama dengan strategi NetworkFirst
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
  })
);

// Cache gambar hero dengan strategi CacheFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/images/heros/'),
  new CacheFirst({
    cacheName: 'hero-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// Tangani fallback untuk sumber daya yang gagal dimuat
setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'image') {
    console.log('Serving fallback image for:', event.request.url);
    return caches.match('/images/fallback.png');
  }

  if (event.request.mode === 'navigate') {
    console.log('Serving fallback page for offline navigation.');
    return caches.match('/index.html');
  }

  return Response.error();
});

// Event install untuk memastikan service worker baru langsung aktif
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('restaurant-cache-v1').then(async (cache) => {
      console.log('Pre-caching essential assets...');
      try {
        await cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/images/heros/hero-image-large.jpg',
          '/images/heros/hero-image-small.jpg',
        ]);
        console.log('Assets pre-cached successfully.');
      } catch (error) {
        console.error('Failed to cache assets during install:', error);
      }
    })
  );
  self.skipWaiting(); // Pastikan SW baru langsung aktif
});

// Event activate untuk membersihkan cache lama
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [
    'restaurant-list',
    'restaurant-detail',
    'restaurant-images',
    'static-assets',
    'pages',
    'hero-images',
    'restaurant-cache-v1',
  ];

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => {
      console.log('Old caches deleted. Claiming clients...');
      return self.clients.claim(); // Pastikan SW mengontrol halaman
    })
  );
});

// Debugging tambahan
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
});

self.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
});
