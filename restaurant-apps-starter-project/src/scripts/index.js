import 'regenerator-runtime'; /* for async await transpile */
import { openDB } from 'idb';
import '../styles/main.css';

const mainContent = document.querySelector('#main-content');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

let isMenuOpen = false;

// Fungsi untuk membuka koneksi ke IndexedDB
const dbPromise = openDB('favorite-restaurants', 1, {
  upgrade(db) {
    db.createObjectStore('restaurants');
  },
});

// Fungsi untuk menangani klik tombol favorit
async function handleFavoriteButtonClick(restaurant) {
  const db = await dbPromise;
  const tx = db.transaction('restaurants', 'readwrite');
  const store = tx.objectStore('restaurants');
  const isFavorited = await store.get(restaurant.id);

  const favoriteButton = document.getElementById('favoriteButton');

  if (isFavorited) {
    await store.delete(restaurant.id);
    favoriteButton.textContent = 'Tambahkan ke Favorit';
  } else {
    await store.put(restaurant, restaurant.id);
    favoriteButton.textContent = 'Hapus dari Favorit';
  }

  await tx.done;
}

// Fungsi untuk menampilkan daftar restoran
function tampilkanDaftarRestoran() {
  fetch('https://restaurant-api.dicoding.dev/list')
    .then((response) => response.json())
    .then((data) => {
      const restaurants = data.restaurants;
      mainContent.innerHTML = '<div class="restaurant-list"></div>';

      const restaurantList = document.querySelector('.restaurant-list');

      restaurants.forEach((restaurant) => {
        const restaurantElement = document.createElement('article');
        restaurantElement.classList.add('restaurant-card');
        restaurantElement.innerHTML = `
          <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}" />
          <div class="restaurant-info">
            <h3>${restaurant.name}</h3>
            <p>Kota: ${restaurant.city}</p>
            <p>Rating: ${restaurant.rating}</p>
            <p>${restaurant.description.substring(0, 100)}...</p>
            <a href="#/detail/${restaurant.id}" class="restaurant-detail-link">Lihat Detail</a>
          </div>
        `;
        restaurantList.appendChild(restaurantElement);
      });

      // Tambahkan event listener pada tombol "Lihat Detail"
      const detailLinks = document.querySelectorAll('.restaurant-detail-link');
      detailLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          window.location.hash = link.getAttribute('href');
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      mainContent.innerHTML = '<p>Gagal memuat data restoran.</p>';
    });
}

// Fungsi untuk menampilkan detail restoran
function tampilkanDetailRestoran(id) {
  fetch(`https://restaurant-api.dicoding.dev/detail/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const restaurant = data.restaurant;
      mainContent.innerHTML = '';

      const restaurantElement = document.createElement('article');
      restaurantElement.classList.add('restaurant-detail');
      restaurantElement.innerHTML = `
        <h2>${restaurant.name}</h2>
        <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}" class="restaurant-image">
        <p>Alamat: ${restaurant.address}</p>
        <p>Kota: ${restaurant.city}</p>
        <p>Rating: ${restaurant.rating}</p>
        <h3>Deskripsi</h3>
        <p>${restaurant.description}</p>
        <h3>Menu Makanan</h3>
        <ul>
          ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
        </ul>
        <h3>Menu Minuman</h3>
        <ul>
          ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
        </ul>
        <h3>Customer Reviews</h3>
        <ul>
          ${restaurant.customerReviews.map((review) => `
            <li>
              <h4>${review.name}</h4>
              <p>${review.date}</p>
              <p>${review.review}</p>
            </li>
          `).join('')}
        </ul>
        <button id="favoriteButton">Tambahkan ke Favorit</button> 
      `;
      mainContent.appendChild(restaurantElement);

      const favoriteButton = document.getElementById('favoriteButton');
      favoriteButton.addEventListener('click', () => handleFavoriteButtonClick(restaurant));
    })
    .catch((error) => {
      console.error('Error fetching detail:', error);
      mainContent.innerHTML = '<p>Gagal memuat detail restoran.</p>';
    });
}

// Fungsi untuk menampilkan restoran favorit
async function tampilkanRestoranFavorit() {
  const db = await dbPromise;
  const tx = db.transaction('restaurants', 'readonly');
  const store = tx.objectStore('restaurants');
  const restaurants = await store.getAll();

  mainContent.innerHTML = '';

  if (restaurants.length === 0) {
    mainContent.innerHTML = '<p>Belum ada restoran favorit.</p>';
    return;
  }

  restaurants.forEach((restaurant) => {
    const restaurantElement = document.createElement('article');
    restaurantElement.classList.add('restaurant-card');
    restaurantElement.innerHTML = `
      <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}" />
      <div class="restaurant-info">
        <h3>${restaurant.name}</h3>
        <p>Kota: ${restaurant.city}</p>
        <p>Rating: ${restaurant.rating}</p>
        <p>${restaurant.description.substring(0, 100)}...</p>
        <a href="#/detail/${restaurant.id}" class="restaurant-detail-link">Lihat Detail</a>
      </div>
    `;
    mainContent.appendChild(restaurantElement);
  });

  // Tambahkan event listener pada tombol "Lihat Detail"
  const detailLinks = document.querySelectorAll('.restaurant-detail-link');
  detailLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.hash = link.getAttribute('href');
    });
  });
}

// Fungsi untuk menampilkan halaman "About Me"
function tampilkanAboutMe() {
  mainContent.innerHTML = `
    <section class="about-me">
      <h2>About Me</h2>
      <p>This is the About Me section.</p>
    </section>
  `;
}

// Fungsi untuk menangani routing
function handleRouting() {
  const url = window.location.hash.slice(1).toLowerCase();
  const urlSegments = url.split('/');

  if (url === '' || url === '/') {
    tampilkanDaftarRestoran();
  } else if (urlSegments[0] === 'detail' && urlSegments[1]) {
    tampilkanDetailRestoran(urlSegments[1]);
  } else if (url === 'favorit') {
    tampilkanRestoranFavorit();
  } else if (url === 'about-me') {
    tampilkanAboutMe();
  }
}

// Event listener untuk navigasi
window.addEventListener('hashchange', handleRouting);

// Panggil fungsi handleRouting saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
  handleRouting();

  // Fungsi untuk toggle hamburger menu
  hamburger.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active', isMenuOpen);
  });

  // Fungsi smooth scroll dan tutup navbar untuk setiap nav item
  navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.hash = item.getAttribute('href');
      isMenuOpen = false;
      navLinks.classList.remove('active');
    });
  });
});

// Daftarkan service worker hanya di lingkungan produksi
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}