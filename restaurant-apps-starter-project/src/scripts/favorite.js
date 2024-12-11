import { openDB } from 'idb';

const dbPromise = openDB('favorite-restaurants', 1, {
  upgrade(db) {
    db.createObjectStore('restaurants');
  },
});

export async function tampilkanRestoranFavorit() {
  const db = await dbPromise;
  const tx = db.transaction('restaurants', 'readonly');
  const store = tx.objectStore('restaurants');
  const allSavedRestaurants = await store.getAll();
  await tx.done;

  const mainContent = document.querySelector('#main-content');
  mainContent.innerHTML = '<div class="restaurant-list"></div>';

  const restaurantListContainer = document.querySelector('.restaurant-list');

  if (allSavedRestaurants.length === 0) {
    restaurantListContainer.innerHTML = '<p>Tidak ada restoran favorit yang ditemukan.</p>';
  } else {
    allSavedRestaurants.forEach((restaurant) => {
      const restaurantItem = document.createElement('div');
      restaurantItem.className = 'restaurant-card';
      restaurantItem.innerHTML = `
        <img src="${restaurant.pictureId}" alt="${restaurant.name}">
        <div class="restaurant-info">
          <h3>${restaurant.name}</h3>
          <p>${restaurant.city}</p>
          <p>Rating: ${restaurant.rating}</p>
        </div>
      `;
      restaurantListContainer.appendChild(restaurantItem);
    });
  }
}