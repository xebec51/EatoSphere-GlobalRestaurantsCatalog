import { Workbox } from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  const wb = new Workbox('/sw.bundle.js'); // Ensure the path is correct

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      console.log('Service Worker updated. Clearing old cache...');
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName !== 'restaurant-api') {
            console.log(`Deleting cache: ${cacheName}`);
            caches.delete(cacheName).then((success) => {
              if (success) {
                console.log(`Cache ${cacheName} deleted successfully`);
              } else {
                console.log(`Failed to delete cache ${cacheName}`);
              }
            });
          }
        });
      });
    }
  });

  try {
    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.log('Failed to register service worker', error);
  }
};

export default swRegister;
