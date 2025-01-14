import { openDB } from 'idb';
import { tampilkanDetailRestoran } from './detail.js'; // Import the function
import { handleRouting } from './index.js'; // Import the function

const dbPromise = openDB('favorite-restaurants', 1, {
  upgrade(db) {
    db.createObjectStore('restaurants');
  },
});

// Fungsi untuk memeriksa apakah restoran sudah ada di daftar favorit
export async function cekRestoranFavorit(id) {
  const db = await dbPromise;
  const tx = db.transaction('restaurants', 'readonly');
  const store = tx.objectStore('restaurants');
  const restaurant = await store.get(id);
  await tx.done;
  return !!restaurant;
}

export async function tampilkanRestoranFavorit() {
  const db = await dbPromise;
  const tx = db.transaction('restaurants', 'readonly');
  const store = tx.objectStore('restaurants');
  const allSavedRestaurants = await store.getAll();
  await tx.done;

  const mainContent = document.querySelector('#main-content');
  mainContent.innerHTML = '<div class="restaurant-list"></div>';

  const restaurantList = document.querySelector('.restaurant-list');

  if (allSavedRestaurants.length === 0) {
    mainContent.innerHTML = `
      <div class="no-restaurants-message">
        <img src="images/no-data.svg" alt="No data" class="no-data-image">
        <h2>Tidak Ada Restoran Favorit</h2>
        <p>Anda belum menambahkan restoran ke daftar favorit.</p>
      </div>
    `;
  } else {
    allSavedRestaurants.forEach((restaurant) => {
      const restaurantItem = document.createElement('div');
      restaurantItem.className = 'restaurant-card';
      restaurantItem.innerHTML = `
        <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}">
        <div class="restaurant-info">
          <h3>${restaurant.name}</h3>
          <p>Kota: ${restaurant.city}</p>
          <p>Rating: ${restaurant.rating}</p>
          <p>${restaurant.description.substring(0, 100)}...</p>
          <a href="#/detail/${restaurant.id}" class="restaurant-detail-link">Lihat Detail</a>
        </div>
      `;
      restaurantList.appendChild(restaurantItem);
    });

    // Add event listener to "Lihat Detail" buttons in the favorite list
    const detailLinks = document.querySelectorAll('.restaurant-detail-link');
    detailLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const id = link.getAttribute('href').split('/')[2];
        window.location.hash = `#/detail/${id}`;
        handleRouting(); // Call handleRouting to display restaurant details
      });
    });
  }
}