importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({
  debug: false,
});

const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate } = workbox.strategies;

registerRoute(
  ({ url }) => url.origin === 'https://restaurant-api.dicoding.dev',
  new StaleWhileRevalidate({
    cacheName: 'restaurant-api',
  })
);