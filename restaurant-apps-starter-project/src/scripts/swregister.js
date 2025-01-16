import { Workbox } from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  const wb = new Workbox('/sw.js'); // Ensure the path is correct

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      console.log('Service Worker updated. Clearing old cache...');
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName !== 'eatosphere-cache') {
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

// Add to Home Screen (A2HS) handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  console.log('Install prompt triggered.');
  // Tampilkan tombol Add to Home Screen di UI
  const a2hsButton = document.getElementById('a2hsButton');
  if (a2hsButton) {
    a2hsButton.style.display = 'block'; // Show the button
    a2hsButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to A2HS: ${outcome}`);
        deferredPrompt = null;
        a2hsButton.style.display = 'none'; // Hide the button after prompt
      }
    });
  }
});

export default swRegister;
