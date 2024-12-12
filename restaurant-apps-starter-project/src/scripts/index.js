import 'regenerator-runtime'; /* for async await transpile */
import { openDB } from 'idb';
import '../styles/main.css';
import { tampilkanRestoranFavorit } from './favorite';
import { tampilkanDetailRestoran } from './detail'; // Import the function

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

// Fungsi untuk menampilkan daftar restoran
function tampilkanDaftarRestoran() {
  fetch('https://restaurant-api.dicoding.dev/list')
    .then((response) => response.json())
    .then((data) => {
      const restaurants = data.restaurants;
      mainContent.innerHTML = '<div class="restaurant-list"></div>';
      const restaurantList = document.querySelector('.restaurant-list');
      restaurants.forEach((restaurant) => {
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

      // Add event listener to "Lihat Detail" buttons
      const detailLinks = document.querySelectorAll('.restaurant-detail-link');
      detailLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const id = link.getAttribute('href').split('/')[2];
          window.location.hash = `#/detail/${id}`;
          handleRouting(); // Call handleRouting to display restaurant details
        });
      });
    })
    .catch((error) => {
      console.error('Gagal memuat daftar restoran:', error);
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
export function handleRouting() {
  const url = window.location.hash.slice(1).toLowerCase();
  const urlSegments = url.split('/');

  switch (urlSegments[1] || '/') {
  case '':
  case '/':
  case 'home':
    tampilkanDaftarRestoran();
    break;
  case 'favorite':  // ubah dari 'favorit' ke 'favorite'
    tampilkanRestoranFavorit();
    break;
  case 'about-me':
    tampilkanAboutMe();
    break;
  case 'detail':
    if (urlSegments[2]) {
      tampilkanDetailRestoran(urlSegments[2]);
    }
    break;
  default:
    mainContent.innerHTML = '<p>Halaman tidak ditemukan.</p>';
    break;
  }
}

// Event listener untuk navigasi
window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

// Panggil fungsi handleRouting saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
  // handleRouting(); // Remove this call to avoid double routing

  // Fungsi untuk toggle hamburger menu
  hamburger.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Fungsi smooth scroll dan tutup navbar untuk setiap nav item
  navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const href = item.getAttribute('href');
      window.location.hash = href; // Update the hash to trigger routing
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      isMenuOpen = false;
      handleRouting(); // Call handleRouting after hash change
    });
  });

  // Tambahkan event listener untuk tombol "Favorite" di navbar
  const favoriteNavItem = document.querySelector('a[href="#/favorite"]');  // ubah dari '#/favorit'
  favoriteNavItem.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#/favorite';  // ubah dari '#/favorit'
    handleRouting();
  });
});

// Daftarkan service worker hanya di lingkungan produksi
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((error) => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}