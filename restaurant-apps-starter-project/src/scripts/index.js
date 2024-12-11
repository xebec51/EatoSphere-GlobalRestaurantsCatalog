import 'regenerator-runtime'; /* for async await transpile */
import { openDB } from 'idb';
import '../styles/main.css';
import { tampilkanRestoranFavorit } from './favorite';

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

          // Ambil elemen <a> yang menjadi parent dari tombol
          const linkElement = event.target.closest('a');

          // Ambil id restoran dari atribut href
          const href = linkElement.getAttribute('href');
          const id = href.substring(href.lastIndexOf('/') + 1);

          // Panggil fungsi tampilkanDetailRestoran dengan id yang benar
          tampilkanDetailRestoran(id);
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
        <div class="restaurant-detail-card">
          <h2>${restaurant.name}</h2>
          <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}" class="restaurant-image">
          <div class="restaurant-info">
            <table>
              <tr>
                <th>Alamat</th>
                <td>${restaurant.address}</td>
              </tr>
              <tr>
                <th>Kota</th>
                <td>${restaurant.city}</td>
              </tr>
              <tr>
                <th>Rating</th>
                <td>${restaurant.rating}</td>
              </tr>
            </table>
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
            <div class="reviews">
              ${restaurant.customerReviews.map((review) => `
                <div class="review-card">
                  <h4>${review.name}</h4>
                  <p>${review.date}</p>
                  <p>${review.review}</p>
                </div>
              `).join('')}
            </div>
          </div>
          <button id="favoriteButton">Tambahkan ke Favorit</button>
        </div>
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

// Fungsi untuk menampilkan halaman "About Me"
function tampilkanAboutMe() {
  mainContent.innerHTML = `
    <section id="about-me" class="about-me-section">
      <div class="about-me-container">
        <div class="about-image">
          <img src="images/profile-photo.jpg" alt="My photo" class="profile-photo" />
        </div>
        <div class="about-description">
          <h2>About Me</h2>
          <p>Hello! I'm Muh. Rinaldi Ruslan, a third-semester student majoring in Information Systems at Hasanuddin University. I live in Makassar, South Sulawesi. I'm passionate about technology, coding, and web development. I also enjoy exploring new cuisines and trying out different restaurants in my free time. My goal is to combine my passion for tech and creativity to build innovative web applications that enhance user experiences.</p>
          <p>When I'm not coding, you can find me traveling or spending time with family and friends. Let's connect through the social media links below!</p>
          <div class="social-links">
            <a href="https://linkedin.com/in/rinaldiruslan" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin fa-2x"></i>
            </a>
            <a href="https://instagram.com/rinaldiruslan" target="_blank" aria-label="Instagram">
              <i class="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://facebook.com/rinaldi.naldi.5220" target="_blank" aria-label="Facebook">
              <i class="fab fa-facebook fa-2x"></i>
            </a>
            <a href="https://github.com/xebec51" target="_blank" aria-label="GitHub">
              <i class="fab fa-github fa-2x"></i>
            </a>
          </div>
        </div>
      </div>
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

  // Tambahkan event listener untuk tombol "Favorite" di navbar
  const favoriteNavItem = document.querySelector('a[href="#/favorit"]');
  favoriteNavItem.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#/favorit';
    handleRouting();
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