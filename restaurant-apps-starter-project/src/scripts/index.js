import 'regenerator-runtime'; /* for async await transpile */
import { openDB } from 'idb';
import '../styles/main.css';
import { tampilkanRestoranFavorit } from './favorite.js';
import { tampilkanDetailRestoran } from './detail.js'; // Import the function
import swRegister from './swregister.js'; // Import swRegister

const mainContent = document.querySelector('#main-content');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const skipLink = document.querySelector('.skip-link');

let isMenuOpen = false;

// Fungsi untuk membuka koneksi ke IndexedDB
const dbPromise = openDB('favorite-restaurants', 1, {
  upgrade(db) {
    db.createObjectStore('restaurants');
  },
});

// Fungsi untuk menampilkan daftar restoran
async function tampilkanDaftarRestoran() {
  try {
    const cache = await caches.open('restaurant-list');
    const cachedResponse = await cache.match('https://restaurant-api.dicoding.dev/list');

    if (cachedResponse) {
      const data = await cachedResponse.json();
      renderRestaurants(data.restaurants);
    } else {
      const response = await fetch('https://restaurant-api.dicoding.dev/list');
      const clonedResponse = response.clone(); // Clone the response before consuming it
      const data = await response.json();
      renderRestaurants(data.restaurants);
      // Cache response
      cache.put('https://restaurant-api.dicoding.dev/list', clonedResponse);
    }
  } catch (error) {
    console.error('Gagal memuat daftar restoran:', error);
    const restaurantList = document.querySelector('.restaurant-list');
    if (restaurantList) {
      restaurantList.innerHTML = '<p>Gagal memuat daftar restoran. Anda sedang offline. Silakan periksa koneksi internet Anda.</p>';
    }
  }
}

function renderRestaurants(restaurants) {
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
  const hamburgerButton = document.querySelector('.hamburger');
  const navigationDrawer = document.querySelector('.nav-links');
  const mainContent = document.querySelector('#main-content');

  // Check if the event listener is already added
  if (!hamburgerButton.dataset.listenerAdded) {
    // Toggle menu handler with propagation stopped
    hamburgerButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event bubbling
      hamburgerButton.classList.toggle('open'); // Toggle 'open' class
      navigationDrawer.classList.toggle('open'); // Toggle 'open' class
      isMenuOpen = !isMenuOpen;
      console.log('Menu is open:', isMenuOpen);
    });

    // Mark the event listener as added
    hamburgerButton.dataset.listenerAdded = 'true';
  }

  // Close menu when clicking on main content
  mainContent.addEventListener('click', () => {
    if (isMenuOpen) {
      hamburgerButton.classList.remove('open');
      navigationDrawer.classList.remove('open');
      isMenuOpen = false;
    }
  });

  // Close menu when clicking on navigation items
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (isMenuOpen) {
        hamburgerButton.classList.remove('open');
        navigationDrawer.classList.remove('open');
        isMenuOpen = false;
      }
    });
  });

  // Skip to content functionality
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  swRegister(); // Call swRegister to register the service worker
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