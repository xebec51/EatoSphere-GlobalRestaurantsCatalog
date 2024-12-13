importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({
  debug: false,
});

const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, NetworkFirst, CacheFirst } = workbox.strategies;

// Cache daftar restoran dengan strategi StaleWhileRevalidate
registerRoute(
  ({ url }) => url.href === 'https://restaurant-api.dicoding.dev/list',
  new StaleWhileRevalidate({
    cacheName: 'restaurant-list',
  })
);

// Cache detail restoran dengan strategi NetworkFirst
registerRoute(
  ({ url }) => url.href.includes('https://restaurant-api.dicoding.dev/detail/'),
  new NetworkFirst({
    cacheName: 'restaurant-detail',
  })
);

// Cache gambar restoran dengan strategi CacheFirst
registerRoute(
  ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/images/'),
  new CacheFirst({
    cacheName: 'restaurant-images',
  })
);